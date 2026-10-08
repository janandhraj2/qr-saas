from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone']

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserSerializer(serializers.ModelSerializer):
    qr_count = serializers.SerializerMethodField()
    qr_limit = serializers.ReadOnlyField()
    is_pro = serializers.ReadOnlyField()
    language_code = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'phone', 'plan',
                  'is_pro', 'qr_limit', 'qr_count', 'subscription_end', 'is_staff',
                  'language_code', 'date_joined']

    def get_qr_count(self, obj):
        return obj.qrcodes.count()

    def get_language_code(self, obj):
        return obj.language.code if obj.language else 'en'
