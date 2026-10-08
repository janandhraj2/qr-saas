from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from apps.core.models import guest_limit, Language


class User(AbstractUser):
    PLAN_GUEST = 'guest'
    PLAN_PAID = 'paid'
    plan = models.CharField(max_length=10, choices=[(PLAN_GUEST, 'Guest'), (PLAN_PAID, 'Paid')], default=PLAN_GUEST)
    subscription_end = models.DateTimeField(null=True, blank=True)
    phone = models.CharField(max_length=20, blank=True, default='')
    company = models.CharField(max_length=100, blank=True, default='')
    language = models.ForeignKey(Language, null=True, blank=True, on_delete=models.SET_NULL)

    @property
    def is_pro(self):
        return self.plan == self.PLAN_PAID and self.subscription_end and self.subscription_end > timezone.now()

    @property
    def qr_limit(self):
        return None if self.is_pro else guest_limit()

    def __str__(self):
        return self.username
