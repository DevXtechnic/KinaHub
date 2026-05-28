from rest_framework import serializers
from sellers.serializers import StoreSerializer
from .models import Product, Category, Brand, ProductImage, Inventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description']

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image_url', 'alt_text', 'is_primary', 'order']


class InventorySerializer(serializers.ModelSerializer):
    available_quantity = serializers.IntegerField(read_only=True)

    class Meta:
        model = Inventory
        fields = ["sku", "quantity", "low_stock_threshold", "reserved_quantity", "available_quantity", "updated_at"]
        read_only_fields = ["reserved_quantity", "available_quantity", "updated_at"]

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(source="category", queryset=Category.objects.all(), write_only=True)
    brand = BrandSerializer(read_only=True)
    brand_id = serializers.PrimaryKeyRelatedField(source="brand", queryset=Brand.objects.all(), write_only=True, required=False, allow_null=True)
    store = StoreSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    primary_image_url = serializers.URLField(write_only=True, required=False, allow_blank=True)
    inventory = InventorySerializer(read_only=True)
    specs = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'store', 'category', 'category_id', 'brand', 'brand_id',
            'description', 'specifications', 'specs',
            'price', 'discount_price', 'stock', 'rating', 
            'tag', 'images', 'primary_image_url', 'inventory', 'is_featured', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ["id", "slug", "store", "images", "inventory", "created_at", "updated_at"]

    def create(self, validated_data):
        image_url = validated_data.pop("primary_image_url", "")
        product = Product.objects.create(**validated_data)
        Inventory.objects.create(product=product, quantity=product.stock)
        if image_url:
            ProductImage.objects.create(product=product, image_url=image_url, alt_text=product.name, is_primary=True)
        return product

    def update(self, instance, validated_data):
        image_url = validated_data.pop("primary_image_url", "")
        product = super().update(instance, validated_data)
        Inventory.objects.update_or_create(product=product, defaults={"quantity": product.stock})
        if image_url:
            ProductImage.objects.update_or_create(
                product=product,
                order=0,
                defaults={"image_url": image_url, "alt_text": product.name, "is_primary": True},
            )
        return product

    def get_specs(self, obj):
        return obj.get_specs_list()
