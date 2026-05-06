from rest_framework import status
from rest_framework.test import APITestCase


class HealthCheckTests(APITestCase):
    def test_health_endpoint_is_public_and_healthy(self):
        res = self.client.get("/api/health/")
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data.get("status"), "ok")
        self.assertEqual(res.data.get("service"), "lms-backend")
