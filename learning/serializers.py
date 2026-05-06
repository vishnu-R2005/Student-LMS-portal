from django.contrib.auth import get_user_model
from rest_framework import serializers

from courses.models import Course

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

User = get_user_model()


class CourseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseCategory
        fields = ("id", "name", "slug", "description", "created_at")


class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Announcement
        fields = (
            "id",
            "course",
            "author",
            "author_name",
            "title",
            "body",
            "audience",
            "pinned",
            "created_at",
        )
        read_only_fields = ("author",)


class ForumReplySerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = ForumReply
        fields = ("id", "thread", "author", "author_name", "body", "parent", "created_at")
        read_only_fields = ("author",)


class ForumThreadSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)
    replies = ForumReplySerializer(many=True, read_only=True)
    reply_count = serializers.SerializerMethodField()

    class Meta:
        model = ForumThread
        fields = (
            "id",
            "course",
            "author",
            "author_name",
            "title",
            "body",
            "pinned",
            "locked",
            "created_at",
            "updated_at",
            "replies",
            "reply_count",
        )
        read_only_fields = ("author",)

    def get_reply_count(self, obj):
        return obj.replies.count()


class AssignmentSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Assignment
        fields = (
            "id",
            "course",
            "course_title",
            "lesson",
            "instructor",
            "title",
            "description",
            "due_at",
            "max_points",
            "created_at",
        )
        read_only_fields = ("instructor",)


class AssignmentSubmissionSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)
    assignment_title = serializers.CharField(source="assignment.title", read_only=True)

    class Meta:
        model = AssignmentSubmission
        fields = (
            "id",
            "assignment",
            "assignment_title",
            "student",
            "student_name",
            "content",
            "attachment_url",
            "status",
            "submitted_at",
            "score",
            "feedback",
            "graded_at",
        )
        read_only_fields = ("student", "graded_at", "status")


class QuizSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Quiz
        fields = (
            "id",
            "course",
            "course_title",
            "lesson",
            "title",
            "pass_score_percent",
            "questions",
            "created_at",
        )


class QuizStudentSerializer(serializers.ModelSerializer):
    """Quiz payload for learners — omits correct answers from each question."""

    course_title = serializers.CharField(source="course.title", read_only=True)

    class Meta:
        model = Quiz
        fields = (
            "id",
            "course",
            "course_title",
            "lesson",
            "title",
            "pass_score_percent",
            "questions",
            "created_at",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        safe = []
        for q in data.get("questions") or []:
            if isinstance(q, dict):
                safe.append({k: v for k, v in q.items() if k != "correct_index"})
            else:
                safe.append(q)
        data["questions"] = safe
        return data


class QuizAttemptSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuizAttempt
        fields = ("id", "quiz", "student", "score_percent", "passed", "answers", "created_at")
        read_only_fields = ("student", "score_percent", "passed")


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = (
            "id",
            "course",
            "student",
            "student_name",
            "session_date",
            "present",
            "marked_by",
            "notes",
            "created_at",
        )
        read_only_fields = ("marked_by",)


class CertificateSerializer(serializers.ModelSerializer):
    course_title = serializers.CharField(source="course.title", read_only=True)
    student_name = serializers.CharField(source="student.username", read_only=True)

    class Meta:
        model = Certificate
        fields = (
            "id",
            "student",
            "student_name",
            "course",
            "course_title",
            "verification_code",
            "issued_at",
        )
        read_only_fields = ("student", "verification_code", "issued_at")


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ("id", "title", "body", "link_url", "read", "created_at")
        read_only_fields = ("title", "body", "link_url", "created_at")


class DirectMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source="sender.username", read_only=True)

    class Meta:
        model = DirectMessage
        fields = ("id", "sender", "sender_name", "recipient", "body", "read_at", "created_at")
        read_only_fields = ("sender", "read_at")


class PlatformSettingSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlatformSetting
        fields = ("id", "key", "value", "updated_at")


class PaymentRecordSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = PaymentRecord
        fields = (
            "id",
            "user",
            "username",
            "course",
            "amount",
            "currency",
            "provider",
            "external_id",
            "status",
            "meta",
            "created_at",
        )


class BadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Badge
        fields = ("id", "name", "description", "icon_key")


class UserBadgeSerializer(serializers.ModelSerializer):
    badge_detail = BadgeSerializer(source="badge", read_only=True)

    class Meta:
        model = UserBadge
        fields = ("id", "user", "badge", "badge_detail", "awarded_at")
        read_only_fields = ("user",)
