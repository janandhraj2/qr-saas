from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User
from .serializers import RegisterSerializer, UserSerializer
from apps.payments.models import Transaction


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=response.data['username'])
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data}, status=201)


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if not user:
            return Response({'error': 'Invalid credentials'}, status=400)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({'token': token.key, 'user': UserSerializer(user).data})


class MeView(APIView):
    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        user = request.user
        lang_code = request.data.get('language')
        if lang_code:
            from apps.core.models import Language
            lang = Language.objects.filter(code=lang_code).first()
            if lang:
                user.language = lang
        for field in ['first_name', 'last_name', 'phone', 'email']:
            if field in request.data:
                setattr(user, field, request.data[field])
        user.save()
        return Response(UserSerializer(user).data)


class AdminStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from apps.qrcodes.models import QRCode
        total_users = User.objects.count()
        paid_users = User.objects.filter(plan='paid').count()
        revenue = sum(t.amount for t in Transaction.objects.filter(status='captured'))
        return Response({
            'total_users': total_users,
            'paid_users': paid_users,
            'guest_users': total_users - paid_users,
            'total_qrs': QRCode.objects.count(),
            'pending_payments': Transaction.objects.filter(status='pending_verification').count(),
            'revenue_inr': revenue,
        })


class AdminUserListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(UserSerializer(User.objects.all().order_by('-date_joined'), many=True).data)


class AdminUserDetailView(APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        user = User.objects.get(pk=pk)
        action = request.data.get('action')
        if action == 'make_pro':
            days = int(request.data.get('days', 365))
            base = user.subscription_end if user.subscription_end and user.subscription_end > timezone.now() else timezone.now()
            user.subscription_end = base + timedelta(days=days)
            user.plan = 'paid'
        elif action == 'make_guest':
            user.plan = 'guest'
            user.subscription_end = None
        elif action == 'toggle_staff':
            user.is_staff = not user.is_staff
        user.save()
        return Response(UserSerializer(user).data)
