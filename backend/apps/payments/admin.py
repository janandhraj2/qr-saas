from django.contrib import admin
from .models import Plan, PaymentGateway, Transaction

admin.site.register(Plan)
admin.site.register(PaymentGateway)


@admin.register(Transaction)
class TxnAdmin(admin.ModelAdmin):
    list_display = ['user', 'plan', 'gateway', 'amount', 'status', 'upi_ref', 'created_at']
    list_filter = ['status', 'gateway']
