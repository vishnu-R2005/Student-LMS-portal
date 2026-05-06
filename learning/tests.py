from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import Course
from enrollments.models import Enrollment

from .models import Assignment, AssignmentSubmission

User = get_user_model()


class RBACSecurityTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username="admin_user",
            email="admin@example.com",
            password="StrongPass@123",
            role="admin",
        )
        self.instructor_1 = User.objects.create_user(
            username="inst1",
            email="inst1@example.com",
            password="StrongPass@123",
            role="instructor",
        )
        self.instructor_2 = User.objects.create_user(
            username="inst2",
            email="inst2@example.com",
            password="StrongPass@123",
            role="instructor",
        )
        self.student = User.objects.create_user(
            username="student_user",
            email="student@example.com",
            password="StrongPass@123",
            role="student",
        )

        self.course = Course.objects.create(
            title="Python Basics",
            description="Intro course",
            category="Programming",
            instructor=self.instructor_1,
            status=Course.Status.APPROVED,
            price=0,
        )
        Enrollment.objects.create(student=self.student, course=self.course)

        self.assignment = Assignment.objects.create(
            course=self.course,
            instructor=self.instructor_1,
            title="Week 1 Task",
            description="Submit a short answer.",
        )

    def test_student_cannot_create_course(self):
        self.client.force_authenticate(user=self.student)
        payload = {
            "title": "Illegal Student Course",
            "description": "Should fail",
            "category": "General",
            "price": 10,
        }
        res = self.client.post("/api/courses/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_instructor_cannot_access_admin_analytics(self):
        self.client.force_authenticate(user=self.instructor_1)
        res = self.client.get("/api/learning/analytics/admin/")
        self.assertEqual(res.status_code, status.HTTP_403_FORBIDDEN)

    def test_student_can_submit_assignment_for_enrolled_course(self):
        self.client.force_authenticate(user=self.student)
        payload = {
            "assignment": self.assignment.id,
            "content": "My submission",
        }
        res = self.client.post("/api/learning/assignment-submissions/", payload, format="json")
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(
            AssignmentSubmission.objects.filter(
                assignment=self.assignment,
                student=self.student,
            ).exists()
        )

    def test_other_instructor_cannot_grade_submission(self):
        submission = AssignmentSubmission.objects.create(
            assignment=self.assignment,
            student=self.student,
            content="Attempt",
        )
        self.client.force_authenticate(user=self.instructor_2)
        res = self.client.patch(
            f"/api/learning/assignment-submissions/{submission.id}/grade/",
            {"score": "85.00", "feedback": "Good effort"},
            format="json",
        )
        self.assertIn(res.status_code, [status.HTTP_403_FORBIDDEN, status.HTTP_404_NOT_FOUND])
