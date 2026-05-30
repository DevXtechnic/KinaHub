from django.db import models
from django.conf import settings
from products.models import Product

class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('shipped', 'Shipped'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled')
    )
    
    PAYMENT_COD = "cod"
    PAYMENT_ESEWA = "esewa"
    PAYMENT_KHALTI = "khalti"
    PAYMENT_FONEPAY_QR = "fonepay_qr"
    PAYMENT_CARD = "card"
    PAYMENT_IME_PAY = "ime_pay"
    PAYMENT_CHOICES = (
        (PAYMENT_COD, "COD"),
        (PAYMENT_ESEWA, "eSewa"),
        (PAYMENT_KHALTI, "Khalti"),
        (PAYMENT_FONEPAY_QR, "Fonepay QR"),
        (PAYMENT_CARD, "Card payments"),
        (PAYMENT_IME_PAY, "IME Pay"),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method = models.CharField(max_length=50, choices=PAYMENT_CHOICES, default=PAYMENT_COD)
    delivery_eta = models.CharField(max_length=100, blank=True)
    delivery_fee = models.DecimalField(max_digits=10, decimal_places=2, default=150)
    promo_code = models.CharField(max_length=50, blank=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField(blank=True)
    customer_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Order {self.id} - {self.user.email}"

class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.PROTECT, related_name="order_items")
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2) # price at time of purchase
    
    def __str__(self):
        return f"{self.quantity} of {self.product.name}"


class Payment(models.Model):
    STATUS_PENDING = "pending"
    STATUS_AUTHORIZED = "authorized"
    STATUS_PAID = "paid"
    STATUS_FAILED = "failed"
    STATUS_REFUNDED = "refunded"
    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_AUTHORIZED, "Authorized"),
        (STATUS_PAID, "Paid"),
        (STATUS_FAILED, "Failed"),
        (STATUS_REFUNDED, "Refunded"),
    )

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method = models.CharField(max_length=50, choices=Order.PAYMENT_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider_reference = models.CharField(max_length=120, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.order_id} - {self.method} - {self.status}"
