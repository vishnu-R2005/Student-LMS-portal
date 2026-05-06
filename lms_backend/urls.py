from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from accounts.tokens import LMSJWTTokenSerializer
from lms_backend.throttles import LoginRateThrottle
from lms_backend.views import HealthCheckView


class JWTPairWithRole(TokenObtainPairView):
    """Login endpoint with role embedded in access token."""

    serializer_class = LMSJWTTokenSerializer
    throttle_classes = [LoginRateThrottle]


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("accounts.urls")),
    path("api/", include("courses.urls")),
    path("api/", include("enrollments.urls")),
    path("api/learning/", include("learning.urls")),
    path("api/health/", HealthCheckView.as_view(), name="health_check"),
    path("api/token/", JWTPairWithRole.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
