from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    ActivityLogViewSet,
    CRMOverviewView,
    CustomerRecordViewSet,
    LeadViewSet,
    MessageViewSet,
    NotificationViewSet,
    SellerRecordViewSet,
    TicketViewSet,
)

router = DefaultRouter()
router.register("customers", CustomerRecordViewSet, basename="crm-customer")
router.register("sellers", SellerRecordViewSet, basename="crm-seller")
router.register("leads", LeadViewSet, basename="lead")
router.register("tickets", TicketViewSet, basename="ticket")
router.register("messages", MessageViewSet, basename="message")
router.register("notifications", NotificationViewSet, basename="notification")
router.register("activity", ActivityLogViewSet, basename="activity")

urlpatterns = [
    path("overview/", CRMOverviewView.as_view(), name="crm-overview"),
    path("", include(router.urls)),
]
