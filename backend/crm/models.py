from django.conf import settings
from django.db import models


class CustomerRecord(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="crm_customer_record")
    source = models.CharField(max_length=80, default="marketplace")
    status = models.CharField(max_length=40, default="active")
    score = models.PositiveIntegerField(default=0)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.email


class SellerRecord(models.Model):
    seller = models.OneToOneField("sellers.SellerProfile", on_delete=models.CASCADE, related_name="crm_seller_record")
    status = models.CharField(max_length=40, default="onboarding")
    risk_level = models.CharField(max_length=40, default="normal")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.seller.business_name


class Lead(models.Model):
    STATUS_NEW = "new"
    STATUS_CONTACTED = "contacted"
    STATUS_QUALIFIED = "qualified"
    STATUS_CLOSED = "closed"
    STATUS_CHOICES = (
        (STATUS_NEW, "New"),
        (STATUS_CONTACTED, "Contacted"),
        (STATUS_QUALIFIED, "Qualified"),
        (STATUS_CLOSED, "Closed"),
    )

    name = models.CharField(max_length=220)
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=30, blank=True)
    source = models.CharField(max_length=100, default="website")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_NEW)
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_leads")
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Ticket(models.Model):
    STATUS_OPEN = "open"
    STATUS_PENDING = "pending"
    STATUS_RESOLVED = "resolved"
    STATUS_CHOICES = (
        (STATUS_OPEN, "Open"),
        (STATUS_PENDING, "Pending"),
        (STATUS_RESOLVED, "Resolved"),
    )

    PRIORITY_LOW = "low"
    PRIORITY_MEDIUM = "medium"
    PRIORITY_HIGH = "high"
    PRIORITY_CHOICES = (
        (PRIORITY_LOW, "Low"),
        (PRIORITY_MEDIUM, "Medium"),
        (PRIORITY_HIGH, "High"),
    )

    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="tickets")
    seller = models.ForeignKey("sellers.SellerProfile", on_delete=models.SET_NULL, null=True, blank=True, related_name="tickets")
    order = models.ForeignKey("orders.Order", on_delete=models.SET_NULL, null=True, blank=True, related_name="tickets")
    subject = models.CharField(max_length=240)
    description = models.TextField()
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default=STATUS_OPEN)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.subject


class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sent_messages")
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="received_messages")
    ticket = models.ForeignKey(Ticket, on_delete=models.SET_NULL, null=True, blank=True, related_name="messages")
    body = models.TextField()
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender_id} -> {self.recipient_id}"


class Notification(models.Model):
    TYPE_ORDER = "order"
    TYPE_MESSAGE = "message"
    TYPE_STATUS = "status"
    TYPE_CHOICES = (
        (TYPE_ORDER, "Order"),
        (TYPE_MESSAGE, "Message"),
        (TYPE_STATUS, "Status"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=180)
    body = models.TextField(blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title


class ActivityLog(models.Model):
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="activity_logs")
    verb = models.CharField(max_length=120)
    target_type = models.CharField(max_length=80, blank=True)
    target_id = models.CharField(max_length=80, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.verb

