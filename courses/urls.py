from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ContentReportViewSet, CourseViewSet, LessonViewSet, ModuleViewSet

router = DefaultRouter()
router.register("courses", CourseViewSet, basename="courses")
router.register("modules", ModuleViewSet, basename="modules")
router.register("lessons", LessonViewSet, basename="lessons")
router.register("reports", ContentReportViewSet, basename="reports")

urlpatterns = [path("", include(router.urls))]
