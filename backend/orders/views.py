from django.db.models import Sum
from crm.models import ActivityLog, Notification
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Order
from .serializers import OrderSerializer, OrderStatusSerializer


class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Order.objects.select_related("user", "payment").prefetch_related("items__product", "items__product__images")
        if user.effective_role == "admin":
            return queryset
        if user.effective_role == "seller":
            store = getattr(getattr(user, "seller_profile", None), "store", None)
            return queryset.filter(items__product__store=store).distinct()
        return queryset.filter(user=user)

    @action(detail=False, methods=["get"])
    def summary(self, request):
        queryset = self.get_queryset()
        return Response({
            "orders": queryset.count(),
            "pending": queryset.filter(status="pending").count(),
            "processing": queryset.filter(status="processing").count(),
            "delivered": queryset.filter(status="delivered").count(),
            "revenue": str(queryset.aggregate(total=Sum("total_price"))["total"] or 0),
        })

    @action(detail=True, methods=["patch"])
    def status(self, request, pk=None):
        user = request.user
        if user.effective_role not in ["seller", "admin"]:
            return Response({"detail": "Only sellers and admins can update order status."}, status=403)

        order = self.get_object()
        serializer = OrderStatusSerializer(order, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        old_status = order.status
        serializer.save()

        ActivityLog.objects.create(
            actor=user,
            verb="updated_order_status",
            target_type="order",
            target_id=str(order.id),
            metadata={"from": old_status, "to": order.status},
        )
        Notification.objects.create(
            user=order.user,
            notification_type="status",
            title=f"Order #{order.id} is now {order.status}",
            body="Your order status was updated.",
        )
        return Response(OrderSerializer(order, context={"request": request}).data)

    @action(detail=False, methods=["post"])
    def calculate_delivery(self, request):
        from .utils import calculate_delivery_info
        from products.models import Product
        
        shipping_address = request.data.get("shipping_address", "")
        items = request.data.get("items", [])
        product_ids = [item.get("product_id") for item in items if item.get("product_id")]
        
        products = Product.objects.filter(id__in=product_ids, is_active=True)
        fee, eta = calculate_delivery_info(shipping_address, products)
        
        return Response({
            "delivery_fee": str(fee),
            "estimated_time": eta
        })
