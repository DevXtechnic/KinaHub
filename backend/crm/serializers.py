from rest_framework import serializers
from .models import ActivityLog, CustomerRecord, Lead, Message, Notification, SellerRecord, Ticket


class CustomerRecordSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = CustomerRecord
        fields = ["id", "user", "email", "source", "status", "score", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class SellerRecordSerializer(serializers.ModelSerializer):
    business_name = serializers.CharField(source="seller.business_name", read_only=True)

    class Meta:
        model = SellerRecord
        fields = ["id", "seller", "business_name", "status", "risk_level", "notes", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at"]


class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = "__all__"
        read_only_fields = ["id", "created_at"]


class TicketSerializer(serializers.ModelSerializer):
    customer_email = serializers.EmailField(source="customer.email", read_only=True)

    class Meta:
        model = Ticket
        fields = ["id", "customer", "customer_email", "seller", "order", "subject", "description", "status", "priority", "created_at", "updated_at"]
        read_only_fields = ["id", "customer", "customer_email", "created_at", "updated_at"]


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["id", "sender", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = "__all__"
        read_only_fields = ["id", "user", "created_at"]


class ActivityLogSerializer(serializers.ModelSerializer):
    actor_email = serializers.EmailField(source="actor.email", read_only=True)

    class Meta:
        model = ActivityLog
        fields = ["id", "actor", "actor_email", "verb", "target_type", "target_id", "metadata", "created_at"]
        read_only_fields = ["id", "actor", "actor_email", "created_at"]

