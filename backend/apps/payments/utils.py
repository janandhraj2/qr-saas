from django.utils import timezone
from datetime import timedelta


def upgrade_user(user, plan):
    if not plan:
        return
    base = user.subscription_end if user.subscription_end and user.subscription_end > timezone.now() else timezone.now()
    user.subscription_end = base + timedelta(days=plan.days)
    user.plan = 'paid'
    user.save()
