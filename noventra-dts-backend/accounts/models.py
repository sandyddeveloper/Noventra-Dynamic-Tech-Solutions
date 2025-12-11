from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.utils import timezone
import uuid

# ------------------------
# User + Manager
# ------------------------
class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)
        return self.create_user(email, password, **extra_fields)


ROLE_CHOICES = [
    ("SUPER_ADMIN", "Super Admin"),
    ("ADMIN", "Admin"),
    ("HR", "HR"),
    ("TEAM_LEAD", "Team Lead"),
    ("EMPLOYEE", "Employee"),
    ("CLIENT", "Client"),
]


from django.contrib.auth.models import Group, Permission

class User(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True, db_index=True)
    full_name = models.CharField(max_length=200, blank=True)
    role = models.CharField(max_length=32, choices=ROLE_CHOICES, default="EMPLOYEE")
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    # override reverse related_names to avoid clashes with auth.User
    groups = models.ManyToManyField(
        Group,
        related_name="accounts_user_set",
        blank=True,
        help_text="The groups this user belongs to.",
        verbose_name="groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="accounts_user_set_permissions",
        blank=True,
        help_text="Specific permissions for this user.",
        verbose_name="user permissions",
    )

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "accounts_user"
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.email}"



# ------------------------
# Refresh token (server-tracked)
# ------------------------
class RefreshToken(models.Model):
    """
    Server-side record for refresh tokens. We store jti (unique identifier from JWT).
    Optionally token_str can store the full JWT — if you do, **encrypt** it in production.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    jti = models.CharField(max_length=255, unique=True, db_index=True)  # jti from JWT
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="refresh_tokens")
    token_str = models.TextField(null=True, blank=True)  # optional: store the full JWT (ENCRYPT in prod!)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    revoked = models.BooleanField(default=False)
    revoked_reason = models.CharField(max_length=255, null=True, blank=True)
    replaced_by_jti = models.CharField(max_length=255, null=True, blank=True)
    last_active = models.DateTimeField(null=True, blank=True)
    device = models.CharField(max_length=255, blank=True, null=True)       # e.g. "Chrome on Windows"
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "accounts_refreshtoken"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["user"]),
            models.Index(fields=["jti"]),
        ]

    def __str__(self):
        return f"RT {self.jti} user={self.user.email} revoked={self.revoked}"

    def revoke(self, reason: str = "revoked"):
        self.revoked = True
        self.revoked_reason = reason
        # do not clear replaced_by_jti here — rotation flow sets that explicitly
        self.save(update_fields=["revoked", "revoked_reason"])

    def mark_replaced(self, new_jti: str):
        """Set this token as rotated/replaced by new_jti and mark revoked."""
        self.replaced_by_jti = new_jti
        self.revoked = True
        self.revoked_reason = "rotated"
        self.save(update_fields=["replaced_by_jti", "revoked", "revoked_reason"])


# ------------------------
# Invite / Email verification / Password reset tokens
# ------------------------
class InviteToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(db_index=True)
    token = models.CharField(max_length=255, unique=True)
    invited_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "accounts_invitetoken"
        ordering = ("-created_at",)

    def __str__(self):
        return f"Invite {self.email} used={self.used}"


class EmailVerificationToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "accounts_emailverificationtoken"
        ordering = ("-created_at",)

    def __str__(self):
        return f"EmailVerif user={self.user.email} used={self.used}"


class PasswordResetToken(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=255, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    used = models.BooleanField(default=False)

    class Meta:
        db_table = "accounts_passwordresettoken"
        ordering = ("-created_at",)

    def __str__(self):
        return f"PwdReset user={self.user.email} used={self.used}"


# ------------------------
# Optional Session model (convenience view or persisted table)
# ------------------------
class Session(models.Model):
    """
    Convenience session view for quick session queries.
    By default this model is NOT managed (you can set managed=True if you want the ORM to create the table).
    Option A: Keep managed=False and create a DB view joining RefreshToken -> User
    Option B: Make managed=True, create migrations, and update fields with signal handlers when tokens created/rotated.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    refresh_token = models.OneToOneField(RefreshToken, on_delete=models.CASCADE)
    started_at = models.DateTimeField()
    last_active_at = models.DateTimeField()
    terminated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        managed = False
        db_table = "accounts_session"

    def __str__(self):
        return f"Session user={self.user.email} started={self.started_at}"
