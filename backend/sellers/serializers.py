from rest_framework import serializers
from .models import SellerProfile, Store


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = [
            "id", "name", "slug", "description", "logo_url", "banner_url",
            "address", "area", "map_url",
            "support_email", "support_phone", "is_active", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "slug", "created_at", "updated_at"]


class SellerProfileSerializer(serializers.ModelSerializer):
    store = StoreSerializer(read_only=True)
    user_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = SellerProfile
        fields = [
            "id", "user", "user_email", "business_name", "phone", "tax_id",
            "status", "internal_notes", "store", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "user", "user_email", "created_at", "updated_at"]
