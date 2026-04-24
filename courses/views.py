from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from accounts.permissions import IsAdmin, IsInstructor

from .models import ContentReport, Course, Lesson, Module
from .serializers import ContentReportSerializer, CourseSerializer, LessonSerializer, ModuleSerializer


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.select_related("instructor").prefetch_related("modules__lessons").all()
    serializer_class = CourseSerializer
    search_fields = ("title", "description", "category")
    filterset_fields = ("category", "status")
    ordering_fields = ("created_at", "price", "title")

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy", "my_courses"]:
            return [permissions.IsAuthenticated(), IsInstructor()]
        if self.action in ["approve"]:
            return [permissions.IsAuthenticated(), IsAdmin()]
        return [permissions.AllowAny()]

    def get_queryset(self):
        queryset = super().get_queryset()
        if self.action in ["list", "retrieve"] and not (
            self.request.user.is_authenticated
            and getattr(self.request.user, "role", None) in ["admin", "instructor"]
        ):
            return queryset.filter(status=Course.Status.APPROVED)
        return queryset

    def perform_create(self, serializer):
        serializer.save(instructor=self.request.user, status=Course.Status.PENDING)

    def perform_destroy(self, instance):
        # Instructors can remove their own courses, admins can remove any.
        if (
            self.request.user.role == "instructor"
            and instance.instructor_id != self.request.user.id
        ):
            raise PermissionDenied("You can only delete your own courses.")
        instance.delete()

    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        course = self.get_object()
        course.status = Course.Status.APPROVED
        course.save(update_fields=["status"])
        return Response({"message": "Course approved successfully"})

    @action(detail=False, methods=["get"])
    def my_courses(self, request):
        queryset = Course.objects.filter(instructor=request.user)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def report(self, request, pk=None):
        course = self.get_object()
        serializer = ContentReportSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(reporter=request.user, course=course)
        return Response(serializer.data, status=201)


class ModuleViewSet(viewsets.ModelViewSet):
    queryset = Module.objects.select_related("course").all()
    serializer_class = ModuleSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    filterset_fields = ("course",)


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.select_related("module", "module__course").all()
    serializer_class = LessonSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    filterset_fields = ("module",)


class ContentReportViewSet(viewsets.ModelViewSet):
    queryset = ContentReport.objects.select_related("course", "reporter").all()
    serializer_class = ContentReportSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    filterset_fields = ("status",)
