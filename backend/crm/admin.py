from django.contrib import admin
from .models import ActivityLog, CustomerRecord, Lead, Message, Notification, SellerRecord, Ticket


for model in [ActivityLog, CustomerRecord, Lead, Message, Notification, SellerRecord, Ticket]:
    admin.site.register(model)

