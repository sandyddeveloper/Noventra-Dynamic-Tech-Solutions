# backend/apps/accounts/tokens.py
import uuid
from datetime import timedelta
from typing import Optional, Dict, Any, Tuple

from django.conf import settings
from django.utils import timezone
from django.core.cache import cache

from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken

from .models import (
    RefreshToken as DBRefreshToken,
    EmailVerificationToken,
    InviteToken,
    PasswordResetToken,
)

# Cache key prefixes & defaults
CACHE_PREFIX_RT = getattr(settings, "CACHE_PREFIX_RT", "rt:")
CACHE_TOUCHED_PREFIX = getattr(settings, "CACHE_TOUCHED_PREFIX", "rt_touch:")
CACHE_TTL_DEFAULT = int(getattr(settings, "CACHE_TTL_DEFAULT", 300))  # 5 minutes
REFRESH_TOUCH_SECONDS = int(getattr(settings, "REFRESH_LAST_ACTIVE_TOUCH_SECONDS", 60))


def _cache_key(jti: str) -> str:
    return f"{CACHE_PREFIX_RT}{jti}"


def _touch_key(jti: str) -> str:
    return f"{CACHE_TOUCHED_PREFIX}{jti}"


# ---------------------------
# Refresh token helpers
# ---------------------------
def create_stored_refresh_token(
    user,
    request_meta: Optional[Dict[str, Any]] = None,
    store_token_str: bool = False,
    cache_ttl: int = CACHE_TTL_DEFAULT,
) -> Tuple[SimpleRefreshToken, str, str, DBRefreshToken]:
    """
    Create a SimpleJWT refresh token + DB row and prime cache.
    Returns: (simple_refresh_obj, refresh_str, jti, db_obj)
    request_meta: {"ip": str, "device": str, "user_agent": str}
    """
    simple_rt = SimpleRefreshToken.for_user(user)
    refresh_str = str(simple_rt)
    jti = simple_rt["jti"]

    expires_delta = settings.SIMPLE_JWT.get("REFRESH_TOKEN_LIFETIME", timedelta(days=30))
    expires_at = timezone.now() + expires_delta

    db_rt = DBRefreshToken.objects.create(
        jti=jti,
        user=user,
        token_str=refresh_str if store_token_str else None,
        expires_at=expires_at,
        last_active=timezone.now(),
        device=(request_meta.get("device") if request_meta else None),
        ip_address=(request_meta.get("ip") if request_meta else None),
        user_agent=(request_meta.get("user_agent") if request_meta else None),
    )

    # prime cache metadata for fast checks
    cache.set(
        _cache_key(jti),
        {
            "revoked": False,
            "expires_at": expires_at.timestamp(),
            "user_id": str(user.id),
            "replaced_by_jti": None,
        },
        timeout=cache_ttl,
    )

    return simple_rt, refresh_str, jti, db_rt


def rotate_refresh_token(
    old_db_rt: DBRefreshToken,
    user,
    request_meta: Optional[Dict[str, Any]] = None,
    cache_client=None,
    store_token_str: bool = False,
    cache_ttl: int = CACHE_TTL_DEFAULT,
) -> Tuple[SimpleRefreshToken, str, str, DBRefreshToken]:
    """
    Rotate refresh token: create new stored DB row and mark old_db_rt as replaced.
    Accepts DB objects as params to avoid re-querying.
    Returns (new_simple_rt, new_refresh_str, new_jti, new_db_rt).
    """
    cache_client = cache_client or cache

    # create new token + db row
    new_simple_rt, new_refresh_str, new_jti, new_db_rt = create_stored_refresh_token(
        user, request_meta=request_meta, store_token_str=store_token_str, cache_ttl=cache_ttl
    )

    # mark old as replaced (atomic single-row update inside model method)
    old_db_rt.mark_replaced(new_jti)

    # update cache: set new meta and evict old
    cache_client.set(
        _cache_key(new_jti),
        {
            "revoked": False,
            "expires_at": new_db_rt.expires_at.timestamp() if new_db_rt.expires_at else 0,
            "user_id": str(user.id),
            "replaced_by_jti": None,
        },
        timeout=cache_ttl,
    )
    cache_client.delete(_cache_key(old_db_rt.jti))

    return new_simple_rt, new_refresh_str, new_jti, new_db_rt


def invalidate_all_user_sessions(user, reason: str = "revoked_all") -> None:
    """
    Bulk revoke all non-revoked refresh tokens for a user and evict their cache entries.
    """
    jt_is = list(DBRefreshToken.objects.filter(user=user, revoked=False).values_list("jti", flat=True))
    DBRefreshToken.objects.filter(user=user, revoked=False).update(revoked=True, revoked_reason=reason)
    for j in jt_is:
        cache.delete(_cache_key(j))


def get_cached_rt_meta(jti: str) -> Optional[Dict[str, Any]]:
    """
    Return cached metadata dict for jti or None.
    """
    return cache.get(_cache_key(jti))


def cache_rt_meta(jti: str, meta: Dict[str, Any], timeout: int = CACHE_TTL_DEFAULT) -> None:
    cache.set(_cache_key(jti), meta, timeout=timeout)


def touch_last_active_throttled(jti: str, now=None, throttle_seconds: Optional[int] = None) -> bool:
    """
    Update last_active DB field but throttle updates to once per throttle_seconds.
    Returns True if DB was updated, False if throttled.
    """
    throttle_seconds = throttle_seconds if throttle_seconds is not None else REFRESH_TOUCH_SECONDS
    now = now or timezone.now()
    touch_key = _touch_key(jti)
    if cache.get(touch_key):
        return False
    DBRefreshToken.objects.filter(jti=jti).update(last_active=now)
    cache.set(touch_key, 1, timeout=throttle_seconds)
    return True


# ---------------------------
# Email / Invite / Password reset token creators
# ---------------------------
def _generate_token_string() -> str:
    """Simple unique token generator. Replace with JWT if you prefer signed tokens."""
    return uuid.uuid4().hex


def create_email_verification(user, expires_in_hours: Optional[int] = None) -> EmailVerificationToken:
    """
    Create an EmailVerificationToken instance for the given user.
    """
    if expires_in_hours is None:
        expires_in_hours = int(getattr(settings, "EMAIL_VERIFICATION_EXPIRES_HOURS", 48))
    token_str = _generate_token_string()
    expires_at = timezone.now() + timedelta(hours=expires_in_hours)
    v = EmailVerificationToken.objects.create(user=user, token=token_str, expires_at=expires_at, used=False)
    return v


def create_invite_token(email: str, invited_by=None, expires_in_hours: Optional[int] = None) -> InviteToken:
    """
    Create an InviteToken tied to an email (invited_by may be a User or None).
    """
    if expires_in_hours is None:
        expires_in_hours = int(getattr(settings, "INVITE_TOKEN_EXPIRES_HOURS", 72))
    token_str = _generate_token_string()
    expires_at = timezone.now() + timedelta(hours=expires_in_hours)
    inv = InviteToken.objects.create(email=email, token=token_str, invited_by=invited_by, expires_at=expires_at, used=False)
    return inv


def create_password_reset(user, expires_in_hours: Optional[int] = None) -> PasswordResetToken:
    """
    Create a PasswordResetToken for the given user.
    """
    if expires_in_hours is None:
        expires_in_hours = int(getattr(settings, "PASSWORD_RESET_EXPIRES_HOURS", 4))
    token_str = _generate_token_string()
    expires_at = timezone.now() + timedelta(hours=expires_in_hours)
    pr = PasswordResetToken.objects.create(user=user, token=token_str, expires_at=expires_at, used=False)
    return pr
