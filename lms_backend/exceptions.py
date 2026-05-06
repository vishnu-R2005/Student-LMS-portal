import logging

from rest_framework import status
from rest_framework.exceptions import AuthenticationFailed, NotAuthenticated, PermissionDenied
from rest_framework.views import exception_handler

logger = logging.getLogger("lms.security")


def lms_exception_handler(exc, context):
    """
    Centralized API exception handler with security audit logging for auth/RBAC failures.
    Response payload shape is kept backward compatible.
    """

    response = exception_handler(exc, context)
    if response is None:
        return response

    if isinstance(exc, (PermissionDenied, NotAuthenticated, AuthenticationFailed)):
        request = context.get("request")
        view = context.get("view")
        user = getattr(request, "user", None)
        logger.warning(
            "authz_denied status=%s method=%s path=%s user_id=%s role=%s view=%s",
            response.status_code,
            getattr(request, "method", "-"),
            getattr(request, "path", "-"),
            getattr(user, "id", None),
            getattr(user, "role", None),
            view.__class__.__name__ if view else "-",
        )

    # Standardize auth errors where detail is a single string.
    if response.status_code in (status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN):
        if isinstance(response.data, dict) and "detail" in response.data and len(response.data) == 1:
            response.data = {"detail": response.data["detail"]}

    return response
