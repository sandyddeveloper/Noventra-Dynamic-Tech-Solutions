from django.contrib import admin
from accounts.models import User, RefreshToken, InviteToken, EmailVerificationToken, PasswordResetToken

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email","full_name","role","is_active","is_staff","created_at")
    search_fields = ("email","full_name","role")

@admin.register(RefreshToken)
class RefreshTokenAdmin(admin.ModelAdmin):
    list_display = ("jti","user","created_at","expires_at","revoked")
    search_fields = ("jti","user__email")
