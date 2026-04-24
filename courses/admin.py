from django.contrib import admin

from .models import ContentReport, Course, Lesson, Module


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("title", "instructor", "category", "status", "price")
    search_fields = ("title", "description", "instructor__username")
    list_filter = ("category", "status")


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ("title", "course", "order")


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ("title", "module", "order", "duration_minutes")


@admin.register(ContentReport)
class ContentReportAdmin(admin.ModelAdmin):
    list_display = ("course", "reporter", "status", "created_at")
