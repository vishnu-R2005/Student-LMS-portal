from django.conf import settings
from django.contrib.auth import get_user_model
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from rest_framework import permissions, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from lms_backend.throttles import PasswordResetConfirmThrottle, PasswordResetRequestThrottle, RegisterRateThrottle

from .permissions import IsAdmin
from .serializers import (
    ChangePasswordSerializer,
    PasswordResetConfirmSerializer,
    RegisterSerializer,
    UserAdminSerializer,
    UserSerializer,
)

User = get_user_model()


class AuthViewSet(viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"], throttle_classes=[RegisterRateThrottle])
    def register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    @action(detail=False, methods=["get", "patch"], permission_classes=[permissions.IsAuthenticated])
    def profile(self, request):
        if request.method == "PATCH":
            serializer = UserSerializer(request.user, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def change_password(self, request):
        ser = ChangePasswordSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        if not request.user.check_password(ser.validated_data["old_password"]):
            return Response({"old_password": ["Incorrect password."]}, status=400)
        request.user.set_password(ser.validated_data["new_password"])
        request.user.save()
        return Response({"detail": "Password updated successfully."})

    @action(detail=False, methods=["post"], throttle_classes=[PasswordResetRequestThrottle])
    def password_reset_request(self, request):
        email = request.data.get("email", "").strip()
        if not email:
            return Response({"email": ["This field is required."]}, status=400)

        user = User.objects.filter(email__iexact=email).first()
        # Always respond the same message to avoid leaking which emails exist
        generic = {"detail": "If an account exists for this email, reset instructions were sent."}

        if user and user.email:
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            base = getattr(
                settings,
                "PASSWORD_RESET_FRONTEND_URL",
                "http://localhost:5173/reset-password",
            )
            sep = "&" if "?" in base else "?"
            link = f"{base}{sep}uid={uid}&token={token}"

            subject = getattr(settings, "PASSWORD_RESET_EMAIL_SUBJECT", "[LMS] Password reset")
            body = (
                "You requested a password reset.\n\n"
                f"Open this link in your browser:\n{link}\n\n"
                "If you did not request this, you can ignore this email."
            )
            send_mail(
                subject,
                body,
                getattr(settings, "DEFAULT_FROM_EMAIL", "webmaster@localhost"),
                [user.email],
                fail_silently=not getattr(settings, "PASSWORD_RESET_FAIL_SILENT", True),
            )

        return Response(generic)

    @action(detail=False, methods=["post"], throttle_classes=[PasswordResetConfirmThrottle])
    def password_reset_confirm(self, request):
        ser = PasswordResetConfirmSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        uid = ser.validated_data["uid"]
        token = ser.validated_data["token"]
        password = ser.validated_data["new_password"]

        try:
            uid_int = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_int)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({"detail": ["Invalid reset link."]}, status=400)

        if not default_token_generator.check_token(user, token):
            return Response({"detail": ["Invalid or expired reset link."]}, status=400)

        user.set_password(password)
        user.save()
        return Response({"detail": "Password has been reset. You can sign in now."})


class UserManagementViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserAdminSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    search_fields = ("username", "email", "first_name", "last_name")
    filterset_fields = ("role", "is_active")

    http_method_names = ["get", "patch", "head", "options"]
