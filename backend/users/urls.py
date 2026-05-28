from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import AddressViewSet, CustomerProfileViewSet, RegisterView, UserViewSet, me

router = DefaultRouter()
router.register("users", UserViewSet, basename="user")
router.register("addresses", AddressViewSet, basename="address")
router.register("customers", CustomerProfileViewSet, basename="customer-profile")

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("me/", me, name="me"),
    path("", include(router.urls)),
]
