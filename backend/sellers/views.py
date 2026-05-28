from django.db.models import Count, DecimalField, ExpressionWrapper, F, Sum
from rest_framework.exceptions import PermissionDenied
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from orders.models import OrderItem
from products.models import Product
from .models import SellerProfile, Store
from .serializers import SellerProfileSerializer, StoreSerializer


class IsSellerOrAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and (user.effective_role in ["seller", "admin"]))


class StorePermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        user = request.user
        return bool(user and user.is_authenticated and (user.effective_role in ["seller", "admin"]))


class SellerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = SellerProfileSerializer
    permission_classes = [IsSellerOrAdmin]

    def get_queryset(self):
        queryset = SellerProfile.objects.select_related("user").prefetch_related("store")
        if self.request.user.effective_role == "admin":
            return queryset
        return queryset.filter(user=self.request.user)

    def perform_update(self, serializer):
        if self.request.user.effective_role != "admin":
            forbidden = {"status", "internal_notes"} & set(self.request.data.keys())
            if forbidden:
                raise PermissionDenied("Only admins can change seller moderation fields.")
        serializer.save()

    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        seller_profile = getattr(request.user, "seller_profile", None)
        if not seller_profile:
            return Response({"detail": "Seller profile not found."}, status=404)

        store = getattr(seller_profile, "store", None)
        products = Product.objects.filter(store=store) if store else Product.objects.none()
        order_items = OrderItem.objects.filter(product__store=store) if store else OrderItem.objects.none()
        line_total = ExpressionWrapper(F("price") * F("quantity"), output_field=DecimalField(max_digits=12, decimal_places=2))
        revenue = order_items.aggregate(total=Sum(line_total))["total"] or 0

        return Response({
            "store": StoreSerializer(store).data if store else None,
            "products": products.count(),
            "active_products": products.filter(is_active=True).count(),
            "orders": order_items.values("order").distinct().count(),
            "units_sold": order_items.aggregate(total=Sum("quantity"))["total"] or 0,
            "revenue": str(revenue),
            "top_products": list(
                products.annotate(order_count=Count("order_items"))
                .order_by("-order_count")
                .values("id", "name", "stock", "order_count")[:5]
            ),
        })


class StoreViewSet(viewsets.ModelViewSet):
    serializer_class = StoreSerializer
    permission_classes = [StorePermission]
    lookup_field = "slug"

    def get_queryset(self):
        queryset = Store.objects.filter(is_active=True).select_related("seller", "seller__user")
        if self.request.method in permissions.SAFE_METHODS:
            return queryset
        if self.request.user.effective_role == "admin":
            return Store.objects.select_related("seller", "seller__user")
        return queryset.filter(seller__user=self.request.user)

    def perform_create(self, serializer):
        seller_profile = self.request.user.seller_profile
        serializer.save(seller=seller_profile)
