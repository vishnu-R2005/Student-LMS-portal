from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import EnrollmentViewSet, ProgressViewSet

router = DefaultRouter()
router.register("enrollments", EnrollmentViewSet, basename="enrollments")
router.register("progress", ProgressViewSet, basename="progress")

urlpatterns = [path("", include(router.urls))]
