from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from accounts.models import User, RefreshToken, InviteToken
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken as SimpleRefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "email", "full_name", "role", "is_active", "created_at")


class LoginSerializer(serializers.Serializer):
    """
    Accept either 'email' or 'username' as identifier to support multiple frontends/clients.
    One of them is required. Password required.
    """
    email = serializers.EmailField(required=False, allow_null=True)
    username = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    password = serializers.CharField(write_only=True)
    device = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        email = attrs.get("email") or None
        username = attrs.get("username") or None
        password = attrs.get("password")

        if not password:
            raise serializers.ValidationError({"password": "Password is required."})

        if not email and not username:
            # keep message generic to avoid leaking presence info
            raise serializers.ValidationError("Provide either email or username and a password.")

        # normalize email if present
        if email:
            attrs["email"] = email.strip().lower()

        if username:
            attrs["username"] = username.strip()

        return attrs


class TokenPairSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()


class RefreshSerializer(serializers.Serializer):
    """
    NOTE: Your refresh rotation endpoint reads the refresh token from a cookie (httponly).
    This serializer remains for clients that might send refresh in the body, but your
    TokenRefreshRotateView does not require it — it uses cookies.
    """
    refresh = serializers.CharField(required=False, allow_blank=True)
    device = serializers.CharField(required=False, allow_blank=True)


class InviteCreateSerializer(serializers.Serializer):
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=[r[0] for r in User._meta.get_field("role").choices])
    message = serializers.CharField(required=False, allow_blank=True)

    def validate_email(self, value):
        return value.strip().lower()


class AcceptInviteSerializer(serializers.Serializer):
    token = serializers.CharField()
    full_name = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        # run Django validators here to keep rules consistent
        validate_password(value)
        return value


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        return value.strip().lower()


class PasswordResetConfirmSerializer(serializers.Serializer):
    token = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_password(self, value):
        validate_password(value)
        return value


class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField(max_length=200, allow_blank=True)
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_email(self, value):
        normalized = value.strip().lower()
        if User.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError("A user with that email already exists.")
        return normalized

    def validate_password(self, value):
        # Use Django's password validators (complexity, etc.)
        validate_password(value)
        return value
