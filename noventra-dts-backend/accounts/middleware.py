# backend/apps/accounts/middleware.py
from django.http import JsonResponse
from django.conf import settings
from django.utils import timezone
from django.core.cache import cache

from .tokens import get_cached_rt_meta, touch_last_active_throttled
from .models import RefreshToken

REFRESH_JTI_COOKIE_NAME = getattr(settings, "REFRESH_JTI_COOKIE_NAME", "refresh_jti")
INACTIVITY_MINUTES = getattr(settings, "SESSION_INACTIVITY_MINUTES", 20)

class SessionCookieMiddleware:
    """
    Read refresh_jti httpOnly cookie and enforce inactivity using cache-first checks.
    Keeps DB writes throttled via touch_last_active_throttled.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        jti = request.COOKIES.get(REFRESH_JTI_COOKIE_NAME)
        if jti:
            meta = get_cached_rt_meta(jti)
            now = timezone.now()
            # 1. cache-first check
            if meta is not None:
                # if cached expired or revoked -> reject
                if meta.get("revoked") or (meta.get("expires_at") and meta["expires_at"] < now.timestamp()):
                    return JsonResponse({"detail": "Session invalid"}, status=401)
                # update last_active in throttled fashion (non-blocking)
                try:
                    touch_last_active_throttled(jti, now=now)
                except Exception:
                    # log but don't block
                    pass
            else:
                # cache miss -> check DB
                try:
                    rt = RefreshToken.objects.get(jti=jti)
                    if rt.revoked or (rt.expires_at and rt.expires_at < now):
                        return JsonResponse({"detail":"Session invalid"}, status=401)
                    # prime cache
                    cache.set(f"rt:{jti}", {
                        "revoked": rt.revoked,
                        "expires_at": rt.expires_at.timestamp() if rt.expires_at else 0,
                        "user_id": str(rt.user_id),
                        "replaced_by_jti": rt.replaced_by_jti,
                    }, timeout=300)
                    try:
                        touch_last_active_throttled(jti, now=now)
                    except Exception:
                        pass
                except RefreshToken.DoesNotExist:
                    return JsonResponse({"detail":"Session invalid"}, status=401)
        response = self.get_response(request)
        return response
