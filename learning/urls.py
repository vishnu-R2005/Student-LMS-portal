from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminAnalyticsAPIView,
    AnnouncementViewSet,
    AssignmentSubmissionViewSet,
    AssignmentViewSet,
    AttendanceRecordViewSet,
    BadgeViewSet,
    CertificateVerifyAPIView,
    CertificateViewSet,
    CourseCategoryViewSet,
    DirectMessagePartnersAPIView,
    DirectMessageViewSet,
    ForumReplyViewSet,
    ForumThreadViewSet,
    LeaderboardAPIView,
    NotificationViewSet,
    PaymentRecordViewSet,
    PlatformSettingViewSet,
    QuizAttemptViewSet,
    QuizViewSet,
    StudentWorkspaceAPIView,
    UserBadgeViewSet,
)

router = DefaultRouter()
router.register(r"categories", CourseCategoryViewSet, basename="categories")
router.register(r"announcements", AnnouncementViewSet, basename="announcements")
router.register(r"forum/threads", ForumThreadViewSet, basename="forum-threads")
router.register(r"forum/replies", ForumReplyViewSet, basename="forum-replies")
router.register(r"assignments", AssignmentViewSet, basename="assignments")
router.register(r"assignment-submissions", AssignmentSubmissionViewSet, basename="assignment-submissions")
router.register(r"quizzes", QuizViewSet, basename="quizzes")
router.register(r"quiz-attempts", QuizAttemptViewSet, basename="quiz-attempts")
router.register(r"attendance", AttendanceRecordViewSet, basename="attendance")
router.register(r"certificates", CertificateViewSet, basename="certificates")
router.register(r"notifications", NotificationViewSet, basename="notifications")
router.register(r"messages", DirectMessageViewSet, basename="messages")
router.register(r"platform-settings", PlatformSettingViewSet, basename="platform-settings")
router.register(r"payments", PaymentRecordViewSet, basename="payments")
router.register(r"badges", BadgeViewSet, basename="badges")
router.register(r"user-badges", UserBadgeViewSet, basename="user-badges")

urlpatterns = [
    path("workspace/student/", StudentWorkspaceAPIView.as_view(), name="workspace-student"),
    path("analytics/admin/", AdminAnalyticsAPIView.as_view(), name="analytics-admin"),
    path("leaderboard/", LeaderboardAPIView.as_view(), name="leaderboard"),
    path("messages/partners/", DirectMessagePartnersAPIView.as_view(), name="message-partners"),
    path("certificates/verify/<uuid:code>/", CertificateVerifyAPIView.as_view(), name="certificate-verify"),
    path("", include(router.urls)),
]
