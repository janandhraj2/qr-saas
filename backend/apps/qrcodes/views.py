import base64
from io import BytesIO
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import QRCode
from .serializers import QRCodeSerializer
from .utils import build_payload, render_qr, img_to_base64


class QRTypeListView(APIView):
    def get(self, request):
        return Response([{'value': c[0], 'label': c[1]} for c in QRCode.TYPE_CHOICES])


class GenerateQRView(APIView):
    def post(self, request):
        user = request.user
        qr_type = request.data.get('qr_type', 'url')
        data = request.data.get('data', {})
        title = request.data.get('title', '')
        fill = request.data.get('fill_color', '#7f1d1d')
        back = request.data.get('back_color', '#ffffff')
        size = int(request.data.get('size', 10))
        border = int(request.data.get('border', 2))
        ec = request.data.get('error_correction', 'H')
        logo_b64 = request.data.get('logo_base64')

        valid = [c[0] for c in QRCode.TYPE_CHOICES]
        if qr_type not in valid:
            return Response({'error': 'Invalid QR type'}, status=400)

        if not user.is_pro:
            count = user.qrcodes.count()
            limit = user.qr_limit if user.qr_limit is not None else 2
            if count >= limit:
                return Response({'error': 'limit_reached',
                    'message': f'Guest limit reached ({limit} QR codes). Upgrade to Pro for unlimited!'},
                    status=403)

        payload = build_payload(qr_type, data)
        if not payload:
            return Response({'error': 'Missing QR content data'}, status=400)

        qr = QRCode.objects.create(user=user, qr_type=qr_type, title=title, data=data,
            fill_color=fill, back_color=back, size=size, border=border, error_correction=ec)

        logo_path = None
        if logo_b64:
            try:
                fmt, b64 = logo_b64.split(',', 1)
                ext = 'png' if 'png' in fmt else 'jpg'
                qr.logo.save(f'logo_{qr.id}.{ext}', BytesIO(base64.b64decode(b64)), save=True)
                logo_path = qr.logo.path
            except Exception:
                pass

        img = render_qr(payload, fill, back, size, border, ec, logo_path)
        qr.image.save(f'qr_{qr.id}.png', BytesIO(base64.b64decode(img_to_base64(img))), save=True)

        return Response({'id': qr.id, 'qr_type': qr.qr_type, 'title': qr.title,
                         'image_base64': img_to_base64(img),
                         'qr_count': user.qrcodes.count(), 'limit': user.qr_limit}, status=201)


class MyQRListView(generics.ListAPIView):
    serializer_class = QRCodeSerializer
    def get_queryset(self):
        return self.request.user.qrcodes.all()


class QRDetailView(APIView):
    def get(self, request, pk):
        try:
            qr = request.user.qrcodes.get(pk=pk)
        except QRCode.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        payload = build_payload(qr.qr_type, qr.data)
        img = render_qr(payload, qr.fill_color, qr.back_color, qr.size,
                        qr.border, qr.error_correction, qr.logo.path if qr.logo else None)
        return Response({'id': qr.id, 'qr_type': qr.qr_type, 'title': qr.title,
                         'data': qr.data, 'scan_count': qr.scan_count,
                         'image_base64': img_to_base64(img)})

    def delete(self, request, pk):
        try:
            request.user.qrcodes.get(pk=pk).delete()
        except QRCode.DoesNotExist:
            return Response({'error': 'Not found'}, status=404)
        return Response({'message': 'Deleted'})


class AdminQRListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        data = [{'id': q.id, 'user': q.user.username, 'qr_type': q.qr_type,
                 'title': q.title, 'scan_count': q.scan_count, 'created_at': q.created_at}
                for q in QRCode.objects.select_related('user').all()[:500]]
        return Response(data)

    def delete(self, request, pk):
        QRCode.objects.filter(pk=pk).delete()
        return Response({'message': 'Deleted'})
