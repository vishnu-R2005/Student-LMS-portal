from django.contrib import admin

from .models import (
    Announcement,
    Assignment,
    AssignmentSubmission,
    AttendanceRecord,
    Badge,
    Certificate,
    CourseCategory,
    DirectMessage,
    ForumReply,
    ForumThread,
    Notification,
    PaymentRecord,
    PlatformSetting,
    Quiz,
    QuizAttempt,
    UserBadge,
)


@admin.register(CourseCategory)
class CourseCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "created_at")
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Announcement)
admin.site.register(ForumThread)
admin.site.register(ForumReply)
admin.site.register(Assignment)
admin.site.register(AssignmentSubmission)
admin.site.register(Quiz)
admin.site.register(QuizAttempt)
admin.site.register(AttendanceRecord)
admin.site.register(Certificate)
admin.site.register(Notification)
admin.site.register(DirectMessage)
admin.site.register(PlatformSetting)
admin.site.register(PaymentRecord)
admin.site.register(Badge)
admin.site.register(UserBadge)
