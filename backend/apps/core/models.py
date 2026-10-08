from django.db import models


class Language(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=50)
    native_name = models.CharField(max_length=50, blank=True, default='')
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} ({self.code})"

    def save(self, *args, **kwargs):
        if self.is_default:
            Language.objects.exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)


class Translation(models.Model):
    language = models.ForeignKey(Language, on_delete=models.CASCADE, related_name='translations')
    key = models.CharField(max_length=100)
    value = models.TextField()

    class Meta:
        unique_together = ['language', 'key']

    def __str__(self):
        return f"{self.language.code}:{self.key}"


class SiteSettings(models.Model):
    site_name = models.CharField(max_length=100, default='JAR Solutions')
    tagline = models.CharField(max_length=200, default='QR Codes, Reimagined')
    logo = models.ImageField(upload_to='branding/', blank=True, null=True)
    primary_color = models.CharField(max_length=7, default='#991b1b')
    secondary_color = models.CharField(max_length=7, default='#b91c1c')
    guest_qr_limit = models.IntegerField(default=2)
    maintenance_mode = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        self.pk = 1  # singleton
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    @classmethod
    def get(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj

    def __str__(self):
        return 'Site Settings'


def guest_limit():
    return SiteSettings.get().guest_qr_limit
