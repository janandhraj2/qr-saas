from rest_framework import serializers
from .models import QRCode


class QRCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QRCode
        fields = ['id', 'qr_type', 'title', 'data', 'fill_color', 'back_color', 'size',
                  'border', 'error_correction', 'scan_count', 'created_at']
