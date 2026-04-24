from rest_framework import serializers

from enrollments.models import Enrollment

from .models import ContentReport, Course, Lesson, Module


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = "__all__"


class ModuleSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)

    class Meta:
        model = Module
        fields = "__all__"


class CourseSerializer(serializers.ModelSerializer):
    instructor_name = serializers.CharField(source="instructor.username", read_only=True)
    modules = ModuleSerializer(many=True, read_only=True)
    enrolled_students = serializers.SerializerMethodField()

    class Meta:
        model = Course
        fields = "__all__"
        read_only_fields = ("instructor",)

    def get_enrolled_students(self, obj):
        return Enrollment.objects.filter(course=obj).count()


class ContentReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContentReport
        fields = "__all__"
        read_only_fields = ("reporter", "status")
