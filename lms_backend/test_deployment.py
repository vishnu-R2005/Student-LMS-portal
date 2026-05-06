from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

User = get_user_model()


class DeploymentSmokeTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="deploy_admin",
            email="deploy_admin@example.com",
            password="StrongPass@123",
            role="admin",
        )
        self.student = User.objects.create_user(
            username="deploy_student",
            email="deploy_student@example.com",
            password="StrongPass@123",
            role="student",
        )

    def test_health_endpoint(self):
        res = self.client.get("/api/health/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("status"), "ok")

    def test_jwt_login_and_refresh_flow(self):
        login = self.client.post(
            "/api/token/",
            {"username": self.student.username, "password": "StrongPass@123"},
            format="json",
        )
        self.assertEqual(login.status_code, status.HTTP_200_OK)
        self.assertIn("access", login.data)
        self.assertIn("refresh", login.data)

        refresh = self.client.post(
            "/api/token/refresh/",
            {"refresh": login.data["refresh"]},
            format="json",
        )
        self.assertEqual(refresh.status_code, status.HTTP_200_OK)
        self.assertIn("access", refresh.data)

    def test_admin_analytics_requires_admin_role(self):
        self.client.force_authenticate(user=self.student)
        denied = self.client.get("/api/learning/analytics/admin/")
        self.assertEqual(denied.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        allowed = self.client.get("/api/learning/analytics/admin/")
        self.assertEqual(allowed.status_code, status.HTTP_200_OK)
