# backend/apps/accounts/utils.py
from django.conf import settings
from django.core.mail import send_mail

def extract_request_meta(request):
    """
    Return small dict with metadata used by token/session helpers.
    Keep it small to avoid passing full request.
    """
    return {
        "ip": request.META.get("REMOTE_ADDR"),
        "user_agent": request.META.get("HTTP_USER_AGENT", "")[:1000],
        "device": request.data.get("device") if hasattr(request, "data") else None
    }

def send_invite_email(invite_obj, request=None):
    frontend = getattr(settings, "FRONTEND_URL", "")
    link = f"{frontend}/auth/accept-invite?token={invite_obj.token}"
    subject = "You're invited"
    body = f"You were invited. Accept: {link}"
    send_mail(subject, body, settings.DEFAULT_FROM_EMAIL, [invite_obj.email])

def send_verification_email(verification_obj, request=None):
    frontend = getattr(settings, "FRONTEND_URL", "")
    link = f"{frontend}/auth/verify-email?token={verification_obj.token}"
    send_mail("Verify email", f"Verify: {link}", settings.DEFAULT_FROM_EMAIL, [verification_obj.user.email])

def send_password_reset_email(reset_obj, request=None):
    frontend = getattr(settings, "FRONTEND_URL", "")
    link = f"{frontend}/auth/reset-password?token={reset_obj.token}"
    send_mail("Reset password", f"Reset: {link}", settings.DEFAULT_FROM_EMAIL, [reset_obj.user.email])

# Audit hook - call asynchronously in production (Celery)
def audit_log(actor, action, entity_type=None, entity_id=None, meta=None):
    """
    Minimal stub. Replace with real audit service or Celery task.
    """
    # ex: enqueue celery task here
    pass
