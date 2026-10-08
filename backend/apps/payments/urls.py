from django.urls import path
from . import views

urlpatterns = [
    path('plans/', views.PublicPlansView.as_view()),
    path('gateways/', views.PublicGatewaysView.as_view()),
    path('create-order/', views.CreateOrderView.as_view()),
    path('verify/', views.VerifyPaymentView.as_view()),
    path('upi-submit/', views.SubmitUPIRefView.as_view()),
    path('webhook/', views.RazorpayWebhookView.as_view()),
    path('admin/plans/', views.AdminPlansView.as_view()),
    path('admin/plans/<int:pk>/', views.AdminPlanDetailView.as_view()),
    path('admin/gateways/', views.AdminGatewaysView.as_view()),
    path('admin/gateways/<int:pk>/', views.AdminGatewaysView.as_view()),
    path('admin/transactions/', views.AdminTransactionsView.as_view()),
    path('admin/transactions/<int:pk>/approve/', views.AdminApproveTransactionView.as_view()),
]
