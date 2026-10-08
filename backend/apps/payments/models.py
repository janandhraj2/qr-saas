from django.db import models
from django.conf import settings


class Plan(models.Model):
    key = models.CharField(max_length=30, unique=True)
    name = models.CharField(max_length=60)
    price_inr = models.IntegerField(default=199)
    days = models.IntegerField(default=30)
    max_qrs = models.IntegerField(null=True, blank=True)  # null = unlimited
    features = models.JSONField(default=list)
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)

    def __str__(self):
        return self.name


class PaymentGateway(models.Model):
    name = models.CharField(max_length=30, unique=True)  # razorpay / upi / stripe
    display_name = models.CharField(max_length=60)
    config = models.JSONField(default=dict)  # keys, upi id etc
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return self.display_name


class Transaction(models.Model):
    STATUS = [('created', 'Created'), ('captured', 'Captured'), ('failed', 'Failed'),
              ('pending_verification', 'Awaiting Verification')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='transactions')
    plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True)
    gateway = models.ForeignKey(PaymentGateway, on_delete=models.SET_NULL, null=True)
    amount = models.IntegerField(default=0)  # rupees
    status = models.CharField(max_length=25, choices=STATUS, default='created')
    razorpay_order_id = models.CharField(max_length=100, blank=True, default='')
    razorpay_payment_id = models.CharField(max_length=100, blank=True, default='')
    upi_ref = models.CharField(max_length=50, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.amount} - {self.status}"
