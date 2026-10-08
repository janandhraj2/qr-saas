from rest_framework import serializers
from .models import Language, Translation, SiteSettings


class LanguageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Language
        fields = ['id', 'code', 'name', 'native_name', 'is_active', 'is_default']


class TranslationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Translation
        fields = ['id', 'language', 'key', 'value']


class SiteSettingsSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = ['site_name', 'tagline', 'logo', 'logo_url', 'primary_color',
                  'secondary_color', 'guest_qr_limit', 'maintenance_mode']

    def get_logo_url(self, obj):
        if obj.logo:
            request = self.context.get('request')
            url = obj.logo.url
            return request.build_absolute_uri(url) if request else url
        return ''
