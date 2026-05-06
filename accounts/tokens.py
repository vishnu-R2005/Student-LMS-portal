from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class LMSJWTTokenSerializer(TokenObtainPairSerializer):
    """Embed role/username in JWT for gateways and client hints (authorization still enforced server-side)."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = getattr(user, "role", "")
        token["username"] = user.username
        token["is_staff"] = user.is_staff
        return token
