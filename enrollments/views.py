from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from accounts.permissions import IsStudent
from courses.models import Lesson

from .models import Enrollment, Progress
from .serializers import EnrollmentSerializer, ProgressSerializer


class EnrollmentViewSet(viewsets.ModelViewSet):
    serializer_class = EnrollmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    filterset_fields = ("course",)

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user).select_related("course")

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        enrollments = self.get_queryset()
        serializer = self.get_serializer(enrollments, many=True)
        recent_activity = Progress.objects.filter(
            enrollment__student=request.user, completed=True
        ).order_by("-completed_at")[:10]
        activity_data = ProgressSerializer(recent_activity, many=True).data
        return Response({"enrollments": serializer.data, "recent_activity": activity_data})


class ProgressViewSet(viewsets.ModelViewSet):
    serializer_class = ProgressSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    filterset_fields = ("enrollment", "completed")

    def get_queryset(self):
        return Progress.objects.filter(enrollment__student=self.request.user).select_related(
            "enrollment", "lesson"
        )

    @action(detail=False, methods=["post"])
    def mark_complete(self, request):
        enrollment_id = request.data.get("enrollment")
        lesson_id = request.data.get("lesson")
        if not enrollment_id or not lesson_id:
            return Response({"error": "enrollment and lesson are required"}, status=400)
        enrollment = Enrollment.objects.filter(id=enrollment_id, student=request.user).first()
        lesson = Lesson.objects.filter(id=lesson_id).first()
        if not enrollment or not lesson:
            return Response({"error": "Enrollment or lesson not found"}, status=404)
        progress, _ = Progress.objects.get_or_create(enrollment=enrollment, lesson=lesson)
        progress.completed = True
        progress.save()
        return Response(ProgressSerializer(progress).data)
