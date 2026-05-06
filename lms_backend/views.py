from django.db import connection
from django.utils import timezone
from rest_framework import permissions
from rest_framework.response import Response
from rest_framework.views import APIView


class HealthCheckView(APIView):
    """
    Lightweight readiness endpoint for deployment probes.
    Keeps auth open intentionally so orchestrators can probe availability.
    """

    permission_classes = [permissions.AllowAny]

    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()

        return Response(
            {
                "status": "ok",
                "service": "lms-backend",
                "timestamp": timezone.now().isoformat(),
            }
        )
