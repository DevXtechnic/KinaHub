from django.contrib import admin
from .models import Order, OrderItem, Payment


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "user",
        "status",
        "payment_method",
        "delivery_method",
        "promo_code",
        "total_price",
        "created_at",
    ]
    list_filter = ["status", "payment_method", "delivery_method"]
    search_fields = ["user__email", "shipping_address", "promo_code"]
    inlines = [OrderItemInline]


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ["order", "method", "status", "amount", "created_at"]
    list_filter = ["method", "status"]
