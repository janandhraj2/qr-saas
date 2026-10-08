from django.contrib import admin
from .models import QRCode

@admin.register(QRCode)
class QRCodeAdmin(admin.ModelAdmin):
    list_display = ['user', 'qr_type', 'title', 'scan_count', 'created_at']
    list_filter = ['qr_type', 'created_at']
    search_fields = ['user__username', 'title']
