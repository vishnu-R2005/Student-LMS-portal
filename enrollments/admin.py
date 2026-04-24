from django.contrib import admin

from .models import Enrollment, Progress


@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ("student", "course", "enrolled_at", "last_accessed_at")
    search_fields = ("student__username", "course__title")


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ("enrollment", "lesson", "completed", "completed_at")
    list_filter = ("completed",)
