from django.utils import timezone
from rest_framework import serializers

from courses.models import Lesson

from .models import Enrollment, Progress


class EnrollmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    student_name = serializers.CharField(source="student.username", read_only=True)
    progress_percentage = serializers.SerializerMethodField()

    class Meta:
        model = Enrollment
        fields = "__all__"
        read_only_fields = ("student",)

    def get_progress_percentage(self, obj):
        total_lessons = Lesson.objects.filter(module__course=obj.course).count()
        completed_lessons = Progress.objects.filter(
            enrollment=obj,
            completed=True,
        ).count()
        if total_lessons == 0:
            return 0
        return round((completed_lessons / total_lessons) * 100, 2)


class ProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Progress
        fields = "__all__"

    def update(self, instance, validated_data):
        completed = validated_data.get("completed", instance.completed)
        if completed and not instance.completed:
            validated_data["completed_at"] = timezone.now()
        return super().update(instance, validated_data)
