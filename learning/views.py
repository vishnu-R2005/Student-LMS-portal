"""REST viewsets for LMS extensions (announcements, assignments, quizzes, etc.)."""

from django.contrib.auth import get_user_model
from django.db.models import Count, Q, Sum
from django.utils import timezone
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import IsAdmin, IsInstructor, IsStudent
from courses.models import ContentReport, Course
from enrollments.models import Enrollment

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
from .serializers import (
    AnnouncementSerializer,
    AssignmentSerializer,
    AssignmentSubmissionSerializer,
    AttendanceRecordSerializer,
    BadgeSerializer,
    CertificateSerializer,
    CourseCategorySerializer,
    DirectMessageSerializer,
    ForumReplySerializer,
    ForumThreadSerializer,
    NotificationSerializer,
    PaymentRecordSerializer,
    PlatformSettingSerializer,
    QuizAttemptSerializer,
    QuizSerializer,
    QuizStudentSerializer,
    UserBadgeSerializer,
)

User = get_user_model()


def _owns_course(user, course) -> bool:
    if getattr(user, "role", None) == "admin":
        return True
    return course.instructor_id == user.id


def _student_enrolled(user, course_id) -> bool:
    return Enrollment.objects.filter(student=user, course_id=course_id).exists()


def _can_view_course_content(user, course_id) -> bool:
    """Student enrolled, instructor/owner, or approved public catalog rules handled at course API."""
    role = getattr(user, "role", None)
    if role in ("admin", "instructor"):
        c = Course.objects.filter(pk=course_id).first()
        if not c:
            return False
        if role == "admin":
            return True
        return c.instructor_id == user.id
    return _student_enrolled(user, course_id)


def _notify_users(user_ids, title, body, link_url=""):
    rows = [
        Notification(user_id=uid, title=title, body=body, link_url=link_url)
        for uid in user_ids
    ]
    Notification.objects.bulk_create(rows)


def _score_quiz_attempt(quiz: Quiz, answers: list):
    questions = quiz.questions or []
    if not isinstance(answers, list):
        raise ValidationError({"answers": "Must be a list of chosen indices."})
    if len(answers) != len(questions):
        raise ValidationError({"answers": "Answer count must match question count."})
    correct = 0
    for i, q in enumerate(questions):
        ci = q.get("correct_index")
        if answers[i] == ci:
            correct += 1
    total = len(questions) or 1
    pct = round((correct / total) * 100, 2)
    passed = pct >= quiz.pass_score_percent
    return pct, passed


class CourseCategoryViewSet(viewsets.ModelViewSet):
    queryset = CourseCategory.objects.all()
    serializer_class = CourseCategorySerializer
    lookup_field = "pk"

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsAdmin()]


class AnnouncementViewSet(viewsets.ModelViewSet):
    serializer_class = AnnouncementSerializer

    def get_queryset(self):
        user = self.request.user
        qs = Announcement.objects.select_related("author", "course").all()
        course = self.request.query_params.get("course")
        if course:
            qs = qs.filter(Q(course_id=course) | Q(course__isnull=True))

        if not user.is_authenticated:
            return qs.none()
        if getattr(user, "role", None) == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(Q(course__instructor=user) | Q(course__isnull=True))
        enrolled_ids = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
        return qs.filter(Q(course_id__in=enrolled_ids) | Q(course__isnull=True))

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsInstructor()]

    def perform_create(self, serializer):
        user = self.request.user
        course = serializer.validated_data.get("course")
        if course and not _owns_course(user, course) and user.role != "admin":
            raise PermissionDenied("You can only post announcements for your own courses.")
        if not course and user.role != "admin":
            raise PermissionDenied("Only admins can post platform-wide announcements.")
        ann = serializer.save(author=user)
        if ann.course_id:
            student_ids = Enrollment.objects.filter(course=ann.course).values_list(
                "student_id", flat=True
            )
            _notify_users(
                list(student_ids),
                f"New announcement: {ann.title}",
                ann.body[:200],
                link_url=f"/courses/{ann.course_id}",
            )


class ForumThreadViewSet(viewsets.ModelViewSet):
    serializer_class = ForumThreadSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ("course",)

    def get_queryset(self):
        user = self.request.user
        qs = ForumThread.objects.select_related("author", "course").prefetch_related("replies")
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(course__instructor=user)
        enrolled = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
        return qs.filter(course_id__in=enrolled)

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if not _can_view_course_content(self.request.user, course.id):
            raise PermissionDenied("You cannot start a thread in this course.")
        serializer.save(author=self.request.user)


class ForumReplyViewSet(viewsets.ModelViewSet):
    serializer_class = ForumReplySerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ("thread",)

    def get_queryset(self):
        user = self.request.user
        qs = ForumReply.objects.select_related("author", "thread", "thread__course")
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(thread__course__instructor=user)
        enrolled = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
        return qs.filter(thread__course_id__in=enrolled)

    def perform_create(self, serializer):
        thread = serializer.validated_data["thread"]
        if thread.locked and self.request.user.role not in ("admin", "instructor"):
            raise PermissionDenied("Thread is locked.")
        if not _can_view_course_content(self.request.user, thread.course_id):
            raise PermissionDenied("You cannot reply here.")
        serializer.save(author=self.request.user)


class AssignmentViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSerializer
    filterset_fields = ("course",)

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsInstructor()]

    def get_queryset(self):
        user = self.request.user
        qs = Assignment.objects.select_related("course", "instructor")
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(course__instructor=user)
        course_ids = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
        return qs.filter(course_id__in=course_ids)

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if not _owns_course(self.request.user, course):
            raise PermissionDenied("You can only create assignments for your courses.")
        serializer.save(instructor=self.request.user)


class AssignmentSubmissionViewSet(viewsets.ModelViewSet):
    serializer_class = AssignmentSubmissionSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ("assignment", "student")

    def get_queryset(self):
        user = self.request.user
        qs = AssignmentSubmission.objects.select_related(
            "assignment", "assignment__course", "student"
        )
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(assignment__course__instructor=user)
        return qs.filter(student=user)

    def get_permissions(self):
        if self.action == "create":
            return [permissions.IsAuthenticated(), IsStudent()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        assignment_id = request.data.get("assignment")
        if not assignment_id:
            return Response({"assignment": ["This field is required."]}, status=400)
        assignment = Assignment.objects.filter(pk=assignment_id).first()
        if not assignment:
            return Response({"error": "Assignment not found"}, status=404)
        if not _student_enrolled(request.user, assignment.course_id):
            raise PermissionDenied("Enroll in the course to submit.")
        submission, created = AssignmentSubmission.objects.get_or_create(
            assignment=assignment,
            student=request.user,
            defaults={
                "content": request.data.get("content", ""),
                "attachment_url": request.data.get("attachment_url", ""),
            },
        )
        if not created:
            submission.content = request.data.get("content", submission.content)
            submission.attachment_url = request.data.get(
                "attachment_url", submission.attachment_url
            )
            submission.save()
        serializer = self.get_serializer(submission)
        return Response(serializer.data, status=201 if created else 200)

    @action(detail=True, methods=["patch"], permission_classes=[permissions.IsAuthenticated])
    def grade(self, request, pk=None):
        submission = self.get_object()
        user = request.user
        course = submission.assignment.course
        if user.role not in ("admin", "instructor") or (
            user.role == "instructor" and course.instructor_id != user.id
        ):
            raise PermissionDenied()
        score = request.data.get("score")
        feedback = request.data.get("feedback", "")
        if score is None:
            return Response({"error": "score is required"}, status=400)
        submission.score = score
        submission.feedback = feedback
        submission.status = AssignmentSubmission.Status.GRADED
        submission.graded_at = timezone.now()
        submission.save()
        _notify_users(
            [submission.student_id],
            f"Graded: {submission.assignment.title}",
            feedback[:200] or "Your submission has been graded.",
            "",
        )
        return Response(AssignmentSubmissionSerializer(submission).data)


class QuizViewSet(viewsets.ModelViewSet):
    filterset_fields = ("course",)

    def get_serializer_class(self):
        if self.action in ("list", "retrieve") and getattr(self.request.user, "role", None) == "student":
            return QuizStudentSerializer
        return QuizSerializer

    def get_permissions(self):
        if self.action in ["list", "retrieve"]:
            return [permissions.IsAuthenticated()]
        return [permissions.IsAuthenticated(), IsInstructor()]

    def get_queryset(self):
        user = self.request.user
        qs = Quiz.objects.select_related("course")
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(course__instructor=user)
        course_ids = Enrollment.objects.filter(student=user).values_list("course_id", flat=True)
        return qs.filter(course_id__in=course_ids)

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if not _owns_course(self.request.user, course):
            raise PermissionDenied()
        serializer.save()


class QuizAttemptViewSet(viewsets.ModelViewSet):
    serializer_class = QuizAttemptSerializer
    permission_classes = [permissions.IsAuthenticated, IsStudent]
    filterset_fields = ("quiz",)
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        return QuizAttempt.objects.filter(student=self.request.user)

    def create(self, request, *args, **kwargs):
        quiz_id = request.data.get("quiz")
        answers = request.data.get("answers")
        quiz = Quiz.objects.filter(pk=quiz_id).first()
        if not quiz:
            return Response({"error": "Quiz not found"}, status=404)
        if not _student_enrolled(request.user, quiz.course_id):
            raise PermissionDenied("Enroll before taking quizzes.")
        try:
            pct, passed = _score_quiz_attempt(quiz, answers)
        except ValidationError as e:
            return Response(e.detail, status=400)
        attempt = QuizAttempt.objects.create(
            quiz=quiz,
            student=request.user,
            score_percent=pct,
            passed=passed,
            answers=answers or [],
        )
        return Response(QuizAttemptSerializer(attempt).data, status=201)


class AttendanceRecordViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsInstructor]
    filterset_fields = ("course", "student", "session_date")

    def get_queryset(self):
        user = self.request.user
        qs = AttendanceRecord.objects.select_related("course", "student", "marked_by")
        if user.role == "admin":
            return qs
        return qs.filter(course__instructor=user)

    def perform_create(self, serializer):
        course = serializer.validated_data["course"]
        if not _owns_course(self.request.user, course):
            raise PermissionDenied()
        serializer.save(marked_by=self.request.user)


class CertificateViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CertificateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Certificate.objects.select_related("course", "student")
        if user.role == "admin":
            return qs
        if user.role == "instructor":
            return qs.filter(course__instructor=user)
        return qs.filter(student=user)

    @action(detail=False, methods=["post"], permission_classes=[permissions.IsAuthenticated, IsInstructor])
    def issue(self, request):
        student_id = request.data.get("student")
        course_id = request.data.get("course")
        if not student_id or not course_id:
            return Response({"error": "student and course required"}, status=400)
        course = Course.objects.filter(pk=course_id).first()
        if not course:
            return Response({"error": "Course not found"}, status=404)
        if not _owns_course(request.user, course):
            raise PermissionDenied()
        if not Enrollment.objects.filter(student_id=student_id, course_id=course_id).exists():
            return Response({"error": "Student is not enrolled"}, status=400)
        cert, _ = Certificate.objects.get_or_create(student_id=student_id, course_id=course_id)
        return Response(CertificateSerializer(cert).data, status=201)


class NotificationViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user)

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        n = self.get_object()
        if n.user_id != request.user.id:
            raise PermissionDenied()
        n.read = True
        n.save(update_fields=["read"])
        return Response({"status": "ok"})


class DirectMessagePartnersAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        ids = (
            DirectMessage.objects.filter(Q(sender=user) | Q(recipient=user))
            .values_list("sender_id", "recipient_id")
        )
        partners = set()
        for sid, rid in ids:
            if sid == user.id:
                partners.add(rid)
            else:
                partners.add(sid)
        partners.discard(user.id)
        return Response({"partner_ids": list(partners)})


class DirectMessageViewSet(viewsets.ModelViewSet):
    serializer_class = DirectMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        partner = self.request.query_params.get("partner")
        qs = DirectMessage.objects.filter(Q(sender=user) | Q(recipient=user))
        if partner:
            qs = qs.filter(Q(sender_id=partner, recipient=user) | Q(recipient_id=partner, sender=user))
        return qs.select_related("sender", "recipient").order_by("created_at")

    def perform_create(self, serializer):
        recipient_id = serializer.validated_data["recipient"].id
        # Students message instructors of enrolled courses; instructors reply; admins any
        user = self.request.user
        recipient = serializer.validated_data["recipient"]
        allowed = user.role == "admin" or recipient.role == "admin"
        if user.role == "student":
            taught = Course.objects.filter(instructor=recipient, enrollments__student=user).exists()
            allowed = allowed or taught
        if user.role == "instructor":
            enrolled = Enrollment.objects.filter(student=recipient, course__instructor=user).exists()
            allowed = allowed or enrolled
        if not allowed:
            raise PermissionDenied("Messaging is limited to your instructors or students.")
        msg = serializer.save(sender=user)
        _notify_users(
            [recipient_id],
            f"Message from {user.username}",
            msg.body[:160],
            "",
        )


class PlatformSettingViewSet(viewsets.ModelViewSet):
    queryset = PlatformSetting.objects.all()
    serializer_class = PlatformSettingSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class PaymentRecordViewSet(viewsets.ModelViewSet):
    queryset = PaymentRecord.objects.select_related("user", "course").all()
    serializer_class = PaymentRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]


class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Badge.objects.all()
    serializer_class = BadgeSerializer
    permission_classes = [permissions.IsAuthenticated]


class UserBadgeViewSet(viewsets.ModelViewSet):
    serializer_class = UserBadgeSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdmin]
    queryset = UserBadge.objects.select_related("user", "badge").all()


class StudentWorkspaceAPIView(APIView):
    """Aggregated student home data (dashboard widgets)."""

    permission_classes = [permissions.IsAuthenticated, IsStudent]

    def get(self, request):
        user = request.user
        enrollments = Enrollment.objects.filter(student=user).select_related("course")
        course_ids = list(enrollments.values_list("course_id", flat=True))

        announcements = Announcement.objects.filter(
            Q(course_id__in=course_ids) | Q(course__isnull=True)
        ).order_by("-pinned", "-created_at")[:15]

        now = timezone.now()
        assignments = Assignment.objects.filter(course_id__in=course_ids).order_by("due_at")[:20]
        upcoming = []
        for a in assignments:
            if a.due_at and a.due_at < now:
                continue
            sub = AssignmentSubmission.objects.filter(assignment=a, student=user).first()
            upcoming.append(
                {
                    "id": a.id,
                    "title": a.title,
                    "course": a.course_id,
                    "course_title": a.course.title,
                    "due_at": a.due_at,
                    "submitted": sub is not None,
                }
            )

        recent_quiz = (
            QuizAttempt.objects.filter(student=user).order_by("-created_at")[:5]
        )

        unread_notifications = Notification.objects.filter(user=user, read=False).count()

        return Response(
            {
                "announcements": AnnouncementSerializer(announcements, many=True).data,
                "upcoming_assignments": upcoming,
                "recent_quiz_attempts": QuizAttemptSerializer(recent_quiz, many=True).data,
                "unread_notifications": unread_notifications,
            }
        )


class CertificateVerifyAPIView(APIView):
    """Public certificate lookup by verification UUID."""

    permission_classes = [permissions.AllowAny]

    def get(self, request, code):
        cert = Certificate.objects.filter(verification_code=code).select_related(
            "course", "student"
        ).first()
        if not cert:
            return Response({"valid": False}, status=404)
        data = CertificateSerializer(cert).data
        data["valid"] = True
        return Response(data)


class AdminAnalyticsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get(self, request):
        user_counts = User.objects.values("role").annotate(c=Count("id"))
        pending_courses = Course.objects.filter(status=Course.Status.PENDING).count()
        approved_courses = Course.objects.filter(status=Course.Status.APPROVED).count()
        open_reports = ContentReport.objects.filter(status=ContentReport.Status.OPEN).count()
        total_enrollments = Enrollment.objects.count()
        revenue = PaymentRecord.objects.filter(status=PaymentRecord.Status.PAID).aggregate(
            total=Sum("amount")
        )["total"] or 0

        return Response(
            {
                "users_by_role": {row["role"]: row["c"] for row in user_counts},
                "pending_courses": pending_courses,
                "approved_courses": approved_courses,
                "open_reports": open_reports,
                "total_enrollments": total_enrollments,
                "paid_revenue_total": str(revenue),
            }
        )


class LeaderboardAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        rows = (
            QuizAttempt.objects.values("student", "student__username")
            .annotate(total_score=Sum("score_percent"), attempts=Count("id"))
            .order_by("-total_score")[:25]
        )
        return Response(
            [
                {
                    "student_id": r["student"],
                    "username": r["student__username"],
                    "total_score": r["total_score"],
                    "attempts": r["attempts"],
                }
                for r in rows
            ]
        )
