from django.db.models.signals import post_save
from django.dispatch import receiver
from accounts.models import User
from accounts.tokens import create_email_verification
from accounts.utils import send_verification_email

@receiver(post_save, sender=User)
def create_verification(sender, instance, created, **kwargs):
    if created and not instance.is_active:
        v = create_email_verification(instance)
        send_verification_email(v)
