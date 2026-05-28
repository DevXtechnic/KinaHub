from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import SellerProfileViewSet, StoreViewSet

router = DefaultRouter()
router.register("profiles", SellerProfileViewSet, basename="seller-profile")
router.register("stores", StoreViewSet, basename="store")

urlpatterns = [
    path("", include(router.urls)),
]
