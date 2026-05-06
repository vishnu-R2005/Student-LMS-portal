from rest_framework.throttling import AnonRateThrottle


class LoginRateThrottle(AnonRateThrottle):
    """Stricter anonymous limit for JWT obtain (brute-force protection)."""

    scope = "login"


class RegisterRateThrottle(AnonRateThrottle):
    """Rate-limit account creation attempts to reduce abuse."""

    scope = "register"


class PasswordResetRequestThrottle(AnonRateThrottle):
    """Rate-limit password reset email requests."""

    scope = "password_reset_request"


class PasswordResetConfirmThrottle(AnonRateThrottle):
    """Rate-limit password reset confirmation attempts."""

    scope = "password_reset_confirm"
