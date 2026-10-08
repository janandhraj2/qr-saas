from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ['username', 'email', 'plan', 'is_pro', 'subscription_end', 'is_staff']
    list_filter = ['plan', 'is_staff']
    fieldsets = UserAdmin.fieldsets + (
        ('JAR SaaS', {'fields': ('plan', 'subscription_end', 'phone', 'company', 'language')}),
    )
