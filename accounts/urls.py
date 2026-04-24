from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import AuthViewSet, UserManagementViewSet

router = DefaultRouter()
router.register("auth", AuthViewSet, basename="auth")
router.register("users", UserManagementViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
]
