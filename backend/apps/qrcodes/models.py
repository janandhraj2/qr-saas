from django.db import models
from django.conf import settings


class QRCode(models.Model):
    TYPE_CHOICES = [
        ('url', 'Website URL'), ('text', 'Plain Text'), ('wifi', 'WiFi Network'),
        ('vcard', 'Contact Card'), ('email', 'Email'), ('sms', 'SMS'),
        ('whatsapp', 'WhatsApp'), ('phone', 'Phone Number'), ('event', 'Event / Calendar'),
        ('app', 'App Download'), ('social', 'Social Media'),
    ]
    EC_CHOICES = [('L', 'L - 7%'), ('M', 'M - 15%'), ('Q', 'Q - 25%'), ('H', 'H - 30% (best for logos)')]
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='qrcodes')
    qr_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='url')
    title = models.CharField(max_length=100, blank=True, default='')
    data = models.JSONField(default=dict)
    fill_color = models.CharField(max_length=7, default='#7f1d1d')
    back_color = models.CharField(max_length=7, default='#ffffff')
    size = models.IntegerField(default=10)
    border = models.IntegerField(default=2)
    error_correction = models.CharField(max_length=1, choices=EC_CHOICES, default='H')
    logo = models.ImageField(upload_to='qr_logos/', blank=True, null=True)
    image = models.ImageField(upload_to='qrs/', blank=True, null=True)
    scan_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.qr_type}"
