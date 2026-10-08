from django.urls import path
from . import views

urlpatterns = [
    path('languages/', views.PublicLanguagesView.as_view()),
    path('translations/', views.TranslationsView.as_view()),
    path('settings/', views.PublicSettingsView.as_view()),
    path('admin/languages/', views.AdminLanguagesView.as_view()),
    path('admin/languages/<int:pk>/', views.AdminLanguageDetailView.as_view()),
    path('admin/translations/', views.AdminTranslationsView.as_view()),
    path('admin/settings/', views.AdminSettingsView.as_view()),
]
