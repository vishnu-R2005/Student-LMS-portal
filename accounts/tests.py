from django.contrib.auth import get_user_model
from django.core import mail
from django.core.cache import cache
from django.test import override_settings
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


@override_settings(
    EMAIL_BACKEND="django.core.mail.backends.locmem.EmailBackend",
    REST_FRAMEWORK={
        "DEFAULT_AUTHENTICATION_CLASSES": (
            "rest_framework_simplejwt.authentication.JWTAuthentication",
        ),
        "DEFAULT_PERMISSION_CLASSES": ("rest_framework.permissions.IsAuthenticatedOrReadOnly",),
        "DEFAULT_THROTTLE_CLASSES": (
            "rest_framework.throttling.AnonRateThrottle",
            "rest_framework.throttling.UserRateThrottle",
        ),
        "DEFAULT_THROTTLE_RATES": {
            "anon": "120/hour",
            "user": "8000/day",
            "login": "35/hour",
            "burst": "75/min",
            "register": "2/min",
            "password_reset_request": "2/min",
            "password_reset_confirm": "2/min",
        },
    },
)
class AuthFlowTests(APITestCase):
    def setUp(self):
        cache.clear()

    def tearDown(self):
        cache.clear()

    def test_register_rejects_weak_password(self):
        payload = {
            "username": "student1",
            "email": "student1@example.com",
            "password": "12345678",
            "role": "student",
        }
        res = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("password", res.data)

    def test_password_reset_request_returns_generic_response(self):
        User.objects.create_user(
            username="student2",
            email="student2@example.com",
            password="StrongPass@123",
            role="student",
        )
        res = self.client.post(
            "/api/auth/password_reset_request/",
            {"email": "student2@example.com"},
            format="json",
        )
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("detail", res.data)
        self.assertEqual(len(mail.outbox), 1)

    def test_register_creates_user_with_allowed_role(self):
        payload = {
            "username": "new_student",
            "email": "new_student@example.com",
            "password": "StrongPass@123",
            "role": "student",
        }
        res = self.client.post("/api/auth/register/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username="new_student", role="student").exists())
