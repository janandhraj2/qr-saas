from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

api_patterns = [
    path('jar-admin/', admin.site.urls),
    path('api/auth/', include('apps.accounts.urls')),
    path('api/core/', include('apps.core.urls')),
    path('api/qr/', include('apps.qrcodes.urls')),
    path('api/payments/', include('apps.payments.urls')),
]

# Vercel's service rewrite forwards the full /api/backend/... path without
# stripping the prefix, so we serve the same routes under both prefixes.
urlpatterns = api_patterns + [
    path('api/backend/', include(api_patterns)),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
