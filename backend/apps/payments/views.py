import razorpay
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from .models import Plan, PaymentGateway, Transaction
from .utils import upgrade_user


def rz_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class PublicPlansView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plans = Plan.objects.filter(is_active=True)
        return Response({'plans': [{
            'key': p.key, 'name': p.name, 'price_inr': p.price_inr, 'days': p.days,
            'max_qrs': p.max_qrs, 'features': p.features, 'is_popular': p.is_popular,
        } for p in plans]})


class PublicGatewaysView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        gws = PaymentGateway.objects.filter(is_active=True)
        return Response([{'name': g.name, 'display_name': g.display_name} for g in gws])


class CreateOrderView(APIView):
    def post(self, request):
        plan = Plan.objects.filter(key=request.data.get('plan_key'), is_active=True).first()
        if not plan:
            return Response({'error': 'Invalid plan'}, status=400)
        gw = PaymentGateway.objects.filter(is_default=True, is_active=True).first()
        if not gw:
            gw = PaymentGateway.objects.filter(is_active=True).first()
        if not gw:
            return Response({'error': 'No payment gateway configured'}, status=400)

        txn = Transaction.objects.create(user=request.user, plan=plan, gateway=gw,
                                         amount=plan.price_inr, status='created')

        if gw.name == 'razorpay':
            order = rz_client().order.create({
                'amount': plan.price_inr * 100, 'currency': 'INR',
                'receipt': f'jar_{request.user.id}_{plan.key}',
                'notes': {'txn_id': txn.id}})
            txn.razorpay_order_id = order['id']
            txn.save()
            return Response({'gateway': 'razorpay', 'order_id': order['id'],
                             'amount': plan.price_inr * 100,
                             'razorpay_key_id': settings.RAZORPAY_KEY_ID, 'txn_id': txn.id})

        if gw.name == 'upi':
            upi_id = gw.config.get('upi_id', '')
            if not upi_id:
                return Response({'error': 'UPI ID not configured by admin'}, status=400)
            from apps.qrcodes.utils import render_qr, img_to_base64
            upi_string = f"upi://pay?pa={upi_id}&pn=JAR Solutions&am={plan.price_inr}&cu=INR&tn=JAR-{plan.key}"
            qr_b64 = img_to_base64(render_qr(upi_string, '#7f1d1d', '#ffffff'))
            return Response({'gateway': 'upi', 'txn_id': txn.id, 'upi_string': upi_string,
                             'upi_qr': qr_b64, 'amount': plan.price_inr})

        return Response({'error': f'Gateway {gw.name} not configured yet'}, status=400)


class VerifyPaymentView(APIView):
    def post(self, request):
        gw = PaymentGateway.objects.filter(name='razorpay').first()
        if not gw or not gw.is_active:
            return Response({'error': 'Razorpay disabled'}, status=400)
        try:
            rz_client().utility.verify_payment_signature({
                'razorpay_order_id': request.data.get('razorpay_order_id'),
                'razorpay_payment_id': request.data.get('razorpay_payment_id'),
                'razorpay_signature': request.data.get('razorpay_signature')})
        except Exception:
            return Response({'error': 'Verification failed'}, status=400)
        txn = Transaction.objects.get(razorpay_order_id=request.data.get('razorpay_order_id'))
        txn.status = 'captured'
        txn.razorpay_payment_id = request.data.get('razorpay_payment_id')
        txn.save()
        upgrade_user(txn.user, txn.plan)
        return Response({'success': True, 'message': 'Welcome to Pro! Unlimited QR unlocked.'})


class SubmitUPIRefView(APIView):
    def post(self, request):
        txn = Transaction.objects.get(pk=request.data.get('txn_id'), user=request.user)
        txn.upi_ref = request.data.get('upi_ref', '')
        txn.status = 'pending_verification'
        txn.save()
        return Response({'message': 'Payment submitted! Admin will verify and activate your Pro account shortly.'})


class RazorpayWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        if request.data.get('event') == 'payment.captured':
            entity = request.data.get('payload', {}).get('payment', {}).get('entity', {})
            txn = Transaction.objects.filter(razorpay_order_id=entity.get('order_id')).first()
            if txn and txn.status != 'captured':
                txn.status = 'captured'
                txn.razorpay_payment_id = entity.get('id', '')
                txn.save()
                upgrade_user(txn.user, txn.plan)
        return Response({'status': 'ok'})


# ---------- ADMIN ----------
class AdminPlansView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([{'id': p.id, 'key': p.key, 'name': p.name, 'price_inr': p.price_inr,
                          'days': p.days, 'max_qrs': p.max_qrs, 'features': p.features,
                          'is_active': p.is_active, 'is_popular': p.is_popular}
                         for p in Plan.objects.all()])

    def post(self, request):
        p = Plan.objects.create(key=request.data['key'], name=request.data['name'],
            price_inr=request.data.get('price_inr', 199), days=request.data.get('days', 30),
            max_qrs=request.data.get('max_qrs'), features=request.data.get('features', []))
        return Response({'id': p.id}, status=201)


class AdminPlanDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        p = Plan.objects.get(pk=pk)
        for field in ['name', 'price_inr', 'days', 'max_qrs', 'features', 'is_active', 'is_popular']:
            if field in request.data:
                setattr(p, field, request.data[field])
        p.save()
        return Response({'message': 'Updated'})

    def delete(self, request, pk):
        Plan.objects.get(pk=pk).delete()
        return Response({'message': 'Deleted'})


class AdminGatewaysView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([{'id': g.id, 'name': g.name, 'display_name': g.display_name,
                          'config': g.config, 'is_active': g.is_active, 'is_default': g.is_default}
                         for g in PaymentGateway.objects.all()])

    def patch(self, request, pk):
        g = PaymentGateway.objects.get(pk=pk)
        for field in ['display_name', 'config', 'is_active']:
            if field in request.data:
                setattr(g, field, request.data[field])
        if request.data.get('is_default'):
            PaymentGateway.objects.exclude(pk=pk).update(is_default=False)
            g.is_default = True
        g.save()
        return Response({'message': 'Updated'})


class AdminTransactionsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response([{'id': t.id, 'user': t.user.username, 'plan': t.plan.name if t.plan else '-',
                          'gateway': t.gateway.display_name if t.gateway else '-',
                          'amount': t.amount, 'status': t.status, 'upi_ref': t.upi_ref,
                          'created_at': t.created_at} for t in Transaction.objects.select_related('user', 'plan', 'gateway')[:300]])


class AdminApproveTransactionView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        txn = Transaction.objects.get(pk=pk)
        txn.status = 'captured'
        txn.save()
        upgrade_user(txn.user, txn.plan)
        return Response({'message': f'{txn.user.username} upgraded to Pro'})
