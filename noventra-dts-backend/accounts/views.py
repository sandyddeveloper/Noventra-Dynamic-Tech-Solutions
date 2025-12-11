# backend/apps/accounts/views.py
from datetime import timedelta
from django.conf import settings
from django.db import transaction
from django.utils import timezone
from django.core.cache import cache

from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken



from .serializers import (
    LoginSerializer,
    InviteCreateSerializer,
    AcceptInviteSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
    UserSerializer,
    RegisterSerializer,
)
from .models import (
    User,
    RefreshToken as DBRefreshToken,
    InviteToken,
    EmailVerificationToken,
    PasswordResetToken,
)
from .tokens import (
    create_stored_refresh_token,
    rotate_refresh_token,
    invalidate_all_user_sessions,
    get_cached_rt_meta,
    touch_last_active_throttled,
    create_email_verification,
    create_invite_token,
    create_password_reset,
)
from .tokens import cache_rt_meta
from .utils import (
    extract_request_meta,
    send_invite_email,
    send_password_reset_email,
    send_verification_email,
    audit_log,
)

from django.contrib.auth import authenticate
import logging

logger = logging.getLogger(__name__)

# Cookie names / config (defaults)
REFRESH_TOKEN_COOKIE_NAME = getattr(settings, "REFRESH_TOKEN_COOKIE_NAME", "refresh_token")
REFRESH_JTI_COOKIE_NAME = getattr(settings, "REFRESH_JTI_COOKIE_NAME", "refresh_jti")
REFRESH_COOKIE_MAX_AGE = int(getattr(settings, "REFRESH_COOKIE_MAX_AGE", 60 * 60 * 24 * 30))
REFRESH_REQUIRE_CUSTOM_HEADER = bool(getattr(settings, "REFRESH_REQUIRE_CUSTOM_HEADER", False))
REFRESH_REQUIRED_HEADER_NAME = getattr(settings, "REFRESH_REQUIRED_HEADER_NAME", "X-CSRF-REFRESH")


# backend/apps/accounts/views.py  (replace RegisterView only)
class RegisterView(APIView):
    """
    Public user registration.

    Behavior controlled by settings.REQUIRE_EMAIL_VERIFICATION (default True).
    If False -> create active user immediately and skip sending verification email.
    """
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]
        full_name = serializer.validated_data.get("full_name", "")
        password = serializer.validated_data["password"]

        require_verification = getattr(settings, "REQUIRE_EMAIL_VERIFICATION", True)

        # Create user. Make active depending on setting.
        user = User.objects.create_user(
            email=email,
            password=password,
            full_name=full_name,
            is_active=(not require_verification)
        )

        if require_verification:
            # create email verification token and attempt send (send helper should be resilient)
            verification = create_email_verification(user)
            try:
                send_verification_email(verification, request)
            except Exception:
                # ensure we don't crash registration if mail backend fails;
                audit_log(user, "EMAIL_SEND_FAILED", entity_type="user", entity_id=str(user.id))

            detail = "Account created. Please verify your email to activate the account."
            status_code = status.HTTP_201_CREATED
        else:
            # No verification required — user is active immediately.
            audit_log(user, "REGISTER_NO_VERIFICATION", entity_type="user", entity_id=str(user.id),
                      meta={"ip": request.META.get("REMOTE_ADDR")})
            detail = "Account created. You can now log in."
            status_code = status.HTTP_201_CREATED

        # General register audit (already logged for no-verif case above)
        if require_verification:
            audit_log(user, "REGISTER", entity_type="user", entity_id=str(user.id),
                      meta={"ip": request.META.get("REMOTE_ADDR")})

        return Response({"detail": detail}, status=status_code)

# backend/apps/accounts/views.py  (LoginView — replace or copy comments)


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger.debug("LoginView payload: %s", request.data)
        # accept either 'email' or 'username'
        email = request.data.get("email") or request.data.get("username")
        password = request.data.get("password")
        device = request.data.get("device", "")

        if not email or not password:
            logger.info("Login attempt missing credentials: %s", request.META.get("REMOTE_ADDR"))
            return Response({"detail": "Missing credentials"}, status=status.HTTP_400_BAD_REQUEST)

        # Try Django authenticate first — supports custom backends and username/email as configured.
        user = authenticate(request=request, username=email, password=password)
        if user is None:
            # Try fallback lookup by email (in case authenticate uses username field)
            try:
                u = User.objects.get(email__iexact=email)
            except User.DoesNotExist:
                logger.info("Login failed - user not found for: %s", email)
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

            if not u.check_password(password):
                logger.info("Login failed - wrong password for: %s", email)
                return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
            user = u

        if not user.is_active:
            logger.info("Login attempt for inactive account: %s", email)
            return Response({"detail": "Account inactive"}, status=status.HTTP_403_FORBIDDEN)

        request_meta = extract_request_meta(request)
        simple_rt, refresh_str, jti, db_rt = create_stored_refresh_token(user, request_meta)
        access = str(simple_rt.access_token)

        audit_log(user, "LOGIN", entity_type="user", entity_id=str(user.id), meta=request_meta)

        response = Response({"access": access, "user": UserSerializer(user).data}, status=status.HTTP_200_OK)
        cookie_secure = getattr(settings, "SESSION_COOKIE_SECURE", True)

        # Log cookies we set
        logger.debug("Setting refresh cookie (secure=%s) jti=%s", cookie_secure, jti)

        response.set_cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            refresh_str,
            max_age=REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=cookie_secure,
            samesite="Lax",
            path="/",
        )
        response.set_cookie(
            REFRESH_JTI_COOKIE_NAME,
            jti,
            max_age=REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=cookie_secure,
            samesite="Lax",
            path="/",
        )
        return response



class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        jti = request.COOKIES.get(REFRESH_JTI_COOKIE_NAME)
        if jti:
            try:
                rt = DBRefreshToken.objects.get(jti=jti)
                rt.revoke(reason="user_logout")
                # evict cache entry (our tokens helpers use rt: prefix)
                cache.delete(f"rt:{jti}")
            except DBRefreshToken.DoesNotExist:
                pass

        response = Response({"detail": "Logged out"}, status=status.HTTP_200_OK)
        response.delete_cookie(REFRESH_TOKEN_COOKIE_NAME, path="/api/auth/token/")
        response.delete_cookie(REFRESH_JTI_COOKIE_NAME, path="/")
        try:
            audit_log(request.user, "LOGOUT", entity_type="user", entity_id=str(request.user.id), meta=extract_request_meta(request))
        except Exception:
            # audit failures shouldn't break response
            pass
        return response


class TokenRefreshRotateView(APIView):
    """
    Refresh rotation endpoint.
    Reads refresh token cookie, validates, checks server-side DB row,
    rotates refresh token (create new DB row, mark old replaced), returns new access token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        # optional anti-CSRF custom header check
        if REFRESH_REQUIRE_CUSTOM_HEADER and not request.headers.get(REFRESH_REQUIRED_HEADER_NAME):
            return Response({"detail": f"Missing required header {REFRESH_REQUIRED_HEADER_NAME}"}, status=status.HTTP_403_FORBIDDEN)

        refresh_str = request.COOKIES.get(REFRESH_TOKEN_COOKIE_NAME)
        if not refresh_str:
            return Response({"detail": "Refresh token missing"}, status=status.HTTP_401_UNAUTHORIZED)

        # Verify signature & extract jti & user id
        try:
            incoming_rt = SimpleRefreshToken(refresh_str)
            incoming_jti = incoming_rt["jti"]
            user_claim = settings.SIMPLE_JWT.get("USER_ID_CLAIM", "user_id")
            user_id = incoming_rt.get(user_claim)
        except Exception:
            return Response({"detail": "Invalid refresh token"}, status=status.HTTP_401_UNAUTHORIZED)

        # cache-first meta check
        meta = get_cached_rt_meta(incoming_jti)
        now = timezone.now()
        if meta:
            # quick cache based reject
            if meta.get("revoked") or (meta.get("expires_at") and meta["expires_at"] < now.timestamp()):
                # revoke all defensively if suspicious reuse detected
                if meta.get("revoked") and meta.get("replaced_by_jti"):
                    try:
                        user = User.objects.get(pk=meta.get("user_id"))
                        invalidate_all_user_sessions(user, reason="replay_detected_reuse")
                    except Exception:
                        pass
                return Response({"detail": "Refresh token invalid"}, status=status.HTTP_401_UNAUTHORIZED)

        # DB lookup (use select_related to also load user)
        try:
            db_rt = DBRefreshToken.objects.select_related("user").get(jti=incoming_jti)
        except DBRefreshToken.DoesNotExist:
            # unknown jti -> possible replay. Revoke all user's sessions if we can deduce user.
            if user_id:
                try:
                    user = User.objects.get(pk=user_id)
                    invalidate_all_user_sessions(user, reason="replay_detected_unknown_jti")
                except Exception:
                    pass
            return Response({"detail": "Refresh token not recognized (possible reuse). All sessions revoked."}, status=status.HTTP_401_UNAUTHORIZED)

        # If revoked (and rotated) -> reuse detection
        if db_rt.revoked:
            if db_rt.replaced_by_jti:
                invalidate_all_user_sessions(db_rt.user, reason="replay_detected_reuse")
                return Response({"detail": "Refresh token reuse detected. All sessions revoked."}, status=status.HTTP_401_UNAUTHORIZED)
            else:
                return Response({"detail": "Refresh token revoked"}, status=status.HTTP_401_UNAUTHORIZED)

        # expiry check
        if db_rt.expires_at and db_rt.expires_at < now:
            db_rt.revoke(reason="expired")
            cache.delete(f"rt:{incoming_jti}")
            return Response({"detail": "Refresh token expired"}, status=status.HTTP_401_UNAUTHORIZED)

        # rotate now (pass db row & user to helper)
        request_meta = extract_request_meta(request)
        new_simple_rt, new_refresh_str, new_jti, new_db_rt = rotate_refresh_token(db_rt, db_rt.user, request_meta)

        # rotate succeeded, produce new access
        new_access = str(new_simple_rt.access_token)

        # set cookies with the new refresh
        response = Response({"access": new_access}, status=status.HTTP_200_OK)
        cookie_secure = getattr(settings, "SESSION_COOKIE_SECURE", True)
        response.set_cookie(
            REFRESH_TOKEN_COOKIE_NAME,
            new_refresh_str,
            max_age=REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=cookie_secure,
            samesite="Lax",
            path="/",
        )
        response.set_cookie(
            REFRESH_JTI_COOKIE_NAME,
            new_jti,
            max_age=REFRESH_COOKIE_MAX_AGE,
            httponly=True,
            secure=cookie_secure,
            samesite="Lax",
            path="/",
        )

        # touch last_active (throttled)
        try:
            touch_last_active_throttled(new_jti, now=now)
        except Exception:
            pass

        try:
            audit_log(db_rt.user, "TOKEN_ROTATED", entity_type="refresh", entity_id=str(db_rt.id), meta={"old_jti": db_rt.jti, "new_jti": new_jti})
        except Exception:
            pass

        return response


class InviteCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        if request.user.role not in ("SUPER_ADMIN", "ADMIN", "HR"):
            return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
        s = InviteCreateSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        email = s.validated_data["email"]

        # Use helper to create invite token (sets expiry, invited_by)
        inv = create_invite_token(email=email, invited_by=request.user)

        # send invite email (helper handles formatting; should be resilient)
        try:
            send_invite_email(inv, request)
        except Exception:
            # log via audit and continue
            audit_log(request.user, "INVITE_SEND_FAILED", entity_type="invite", entity_id=str(inv.id), meta={"email": email})

        audit_log(request.user, "INVITE_CREATED", entity_type="invite", entity_id=str(inv.id), meta={"email": email})
        return Response({"detail": "Invite sent"}, status=status.HTTP_200_OK)


class AcceptInviteView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        s = AcceptInviteSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        token = s.validated_data["token"]
        full_name = s.validated_data["full_name"]
        password = s.validated_data["password"]

        try:
            inv = InviteToken.objects.select_for_update().get(token=token, used=False)
        except InviteToken.DoesNotExist:
            return Response({"detail": "Invalid invite"}, status=status.HTTP_400_BAD_REQUEST)

        if inv.expires_at and inv.expires_at < timezone.now():
            return Response({"detail": "Invite expired"}, status=status.HTTP_400_BAD_REQUEST)

        # create or update user for the invited email
        user, created = User.objects.get_or_create(email=inv.email, defaults={"full_name": full_name, "is_active": True})
        if not created:
            user.full_name = full_name
        user.set_password(password)
        user.is_active = True
        user.save(update_fields=["full_name", "password", "is_active"])

        # mark invite used inside same transaction
        inv.used = True
        inv.save(update_fields=["used"])

        audit_log(user, "INVITE_ACCEPTED", entity_type="invite", entity_id=str(inv.id))
        return Response({"detail": "Account created"}, status=status.HTTP_201_CREATED)


class RequestPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        s = PasswordResetRequestSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        email = s.validated_data["email"]
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # don't reveal presence of account
            return Response({"detail": "If that account exists, we'll send a reset link."}, status=status.HTTP_200_OK)

        # create reset token via helper (sets expiry)
        pr = create_password_reset(user)
        try:
            send_password_reset_email(pr, request)
        except Exception:
            audit_log(user, "PASSWORD_RESET_SEND_FAILED", entity_type="user", entity_id=str(user.id))

        audit_log(user, "PASSWORD_RESET_REQUEST", entity_type="user", entity_id=str(user.id))
        return Response({"detail": "If that account exists, we've sent an email."}, status=status.HTTP_200_OK)


class ConfirmPasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    @transaction.atomic
    def post(self, request):
        s = PasswordResetConfirmSerializer(data=request.data)
        s.is_valid(raise_exception=True)
        token = s.validated_data["token"]
        new_pass = s.validated_data["password"]

        try:
            pr = PasswordResetToken.objects.select_for_update().get(token=token, used=False)
        except PasswordResetToken.DoesNotExist:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

        if pr.expires_at and pr.expires_at < timezone.now():
            pr.used = True
            pr.save(update_fields=["used"])
            return Response({"detail": "Expired token"}, status=status.HTTP_400_BAD_REQUEST)

        user = pr.user
        user.set_password(new_pass)
        user.save(update_fields=["password"])

        pr.used = True
        pr.save(update_fields=["used"])

        audit_log(user, "PASSWORD_RESET_COMPLETE", entity_type="user", entity_id=str(user.id))
        return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)


class VerifyEmailView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        token = request.data.get("token")
        if not token:
            return Response({"detail": "Token required"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            v = EmailVerificationToken.objects.get(token=token, used=False)
        except EmailVerificationToken.DoesNotExist:
            return Response({"detail": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
        if v.expires_at and v.expires_at < timezone.now():
            v.used = True
            v.save(update_fields=["used"])
            return Response({"detail": "Expired"}, status=status.HTTP_400_BAD_REQUEST)

        user = v.user
        user.is_active = True
        user.save(update_fields=["is_active"])
        v.used = True
        v.save(update_fields=["used"])
        audit_log(user, "EMAIL_VERIFIED", entity_type="user", entity_id=str(user.id))
        return Response({"detail": "Email verified"}, status=status.HTTP_200_OK)


class SessionsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        rts = DBRefreshToken.objects.filter(user=request.user).order_by("-created_at")
        data = [{
            "jti": rt.jti,
            "created_at": rt.created_at,
            "expires_at": rt.expires_at,
            "revoked": rt.revoked,
            "revoked_reason": getattr(rt, "revoked_reason", None),
            "replaced_by_jti": getattr(rt, "replaced_by_jti", None),
            "device": rt.device,
            "ip": rt.ip_address,
            "last_active": getattr(rt, "last_active", None),
        } for rt in rts]
        return Response(data, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def revoke_user_sessions(request, user_id):
    if request.user.role not in ("SUPER_ADMIN", "ADMIN"):
        return Response({"detail": "Forbidden"}, status=status.HTTP_403_FORBIDDEN)
    try:
        u = User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    invalidate_all_user_sessions(u, reason="admin_revoked")
    audit_log(request.user, "ADMIN_REVOKE", entity_type="user", entity_id=str(u.id), meta={"by": str(request.user.id)})
    return Response({"detail": "User sessions revoked"}, status=status.HTTP_200_OK)



class UserView(APIView):
    """
    Return the currently authenticated user (or 401 if not authenticated).
    GET /api/auth/me/
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

class UserDetailView(APIView):
    """
    Return any user by ID (super-admins or internal use). Use user_id type according to your model PK.
    GET /api/auth/users/<user_id>/
    """
    permission_classes = [permissions.IsAuthenticated]  # adjust to IsAdminUser if you want restricted access

    def get(self, request, user_id):
        try:
            u = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(UserSerializer(u).data, status=status.HTTP_200_OK)