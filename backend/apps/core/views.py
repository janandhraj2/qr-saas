import base64
from io import BytesIO
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from .models import Language, Translation, SiteSettings
from .serializers import LanguageSerializer, TranslationSerializer, SiteSettingsSerializer


class PublicLanguagesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        langs = Language.objects.filter(is_active=True)
        return Response(LanguageSerializer(langs, many=True).data)


class TranslationsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        code = request.GET.get('lang', 'en')
        lang = Language.objects.filter(code=code).first()
        data = {}
        if lang:
            for t in lang.translations.all():
                data[t.key] = t.value
        return Response({'lang': code, 'translations': data})


class PublicSettingsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        s = SiteSettings.get()
        return Response(SiteSettingsSerializer(s, context={'request': request}).data)


# ---------- ADMIN ----------

class AdminLanguagesView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(LanguageSerializer(Language.objects.all(), many=True).data)

    def post(self, request):
        ser = LanguageSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data, status=201)


class AdminLanguageDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        lang = Language.objects.get(pk=pk)
        ser = LanguageSerializer(lang, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.data)

    def delete(self, request, pk):
        Language.objects.get(pk=pk).delete()
        return Response({'message': 'Deleted'})


class AdminTranslationsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        qs = Translation.objects.all()
        lang = request.GET.get('lang')
        if lang:
            qs = qs.filter(language__code=lang)
        return Response(TranslationSerializer(qs, many=True).data)

    def post(self, request):
        lang = Language.objects.get(pk=request.data['language'])
        t, _ = Translation.objects.update_or_create(
            language=lang, key=request.data['key'],
            defaults={'value': request.data['value']})
        return Response(TranslationSerializer(t).data)


class AdminSettingsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        s = SiteSettings.get()
        return Response(SiteSettingsSerializer(s, context={'request': request}).data)

    def put(self, request):
        s = SiteSettings.get()
        data = request.data.copy()
        logo_b64 = data.pop('logo_base64', None)
        ser = SiteSettingsSerializer(s, data=data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        if logo_b64:
            fmt, b64 = logo_b64.split(',', 1)
            ext = 'png' if 'png' in fmt else 'jpg'
            s.logo.save(f'logo.{ext}', BytesIO(base64.b64decode(b64)), save=True)
        return Response(SiteSettingsSerializer(s, context={'request': request}).data)
