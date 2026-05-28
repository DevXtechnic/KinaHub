from django.db import transaction
from rest_framework import serializers
from crm.models import ActivityLog, Notification
from products.models import Product
from products.serializers import ProductSerializer
from .models import Order, OrderItem, Payment


class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(source="product", queryset=Product.objects.filter(is_active=True), write_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_id", "quantity", "price"]
        read_only_fields = ["id", "product", "price"]


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "method", "status", "amount", "provider_reference", "created_at", "updated_at"]
        read_only_fields = ["id", "status", "amount", "provider_reference", "created_at", "updated_at"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True)
    payment = PaymentSerializer(read_only=True)
    customer_email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer_email", "status", "payment_method", "total_price",
            "shipping_address", "customer_note", "items", "payment", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "customer_email", "status", "total_price", "payment", "created_at", "updated_at"]

    def validate_items(self, items):
        if not items:
            raise serializers.ValidationError("Order must contain at least one item.")
        for item in items:
            product = item["product"]
            quantity = item["quantity"]
            if quantity < 1:
                raise serializers.ValidationError("Quantity must be at least 1.")
            if product.stock < quantity:
                raise serializers.ValidationError(f"{product.name} only has {product.stock} units available.")
        return items

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user
        total = sum(item["product"].current_price * item["quantity"] for item in items_data)
        order = Order.objects.create(user=user, total_price=total, **validated_data)

        order_items = []
        for item in items_data:
            product = item["product"]
            quantity = item["quantity"]
            order_items.append(OrderItem(order=order, product=product, quantity=quantity, price=product.current_price))
            product.stock = max(product.stock - quantity, 0)
            product.save(update_fields=["stock"])
            if hasattr(product, "inventory"):
                product.inventory.quantity = product.stock
                product.inventory.save(update_fields=["quantity", "updated_at"])

        OrderItem.objects.bulk_create(order_items)
        Payment.objects.create(order=order, method=order.payment_method, amount=total)
        ActivityLog.objects.create(
            actor=user,
            verb="created_order",
            target_type="order",
            target_id=str(order.id),
            metadata={"payment_method": order.payment_method, "total": str(total)},
        )
        Notification.objects.create(
            user=user,
            notification_type="order",
            title=f"Order #{order.id} placed",
            body=f"Your order total is Rs. {total}.",
        )

        seller_users = {
            item["product"].store.seller.user
            for item in items_data
            if item["product"].store and item["product"].store.seller
        }
        for seller_user in seller_users:
            Notification.objects.create(
                user=seller_user,
                notification_type="order",
                title=f"New order #{order.id}",
                body="A customer placed an order containing your products.",
            )
        return order


class OrderStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ["status"]
