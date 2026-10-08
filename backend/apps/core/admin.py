from django.contrib import admin
from .models import Language, Translation, SiteSettings

admin.site.register(Language)
admin.site.register(Translation)
admin.site.register(SiteSettings)
