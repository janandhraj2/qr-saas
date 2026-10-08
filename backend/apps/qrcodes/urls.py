from django.urls import path
from . import views

urlpatterns = [
    path('types/', views.QRTypeListView.as_view()),
    path('generate/', views.GenerateQRView.as_view()),
    path('mine/', views.MyQRListView.as_view()),
    path('<int:pk>/', views.QRDetailView.as_view()),
    path('admin/all/', views.AdminQRListView.as_view()),
]
