from django.contrib import admin
from .models import Category, Brand, Inventory, Product, ProductImage, Review

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'order']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug']
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['name', 'store', 'category', 'brand', 'price', 'discount_price', 'stock', 'is_featured', 'is_active']
    list_filter = ['store', 'category', 'brand', 'is_featured', 'is_active']
    search_fields = ['name', 'description', 'store__name']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]


@admin.register(Inventory)
class InventoryAdmin(admin.ModelAdmin):
    list_display = ["product", "sku", "quantity", "reserved_quantity", "low_stock_threshold", "updated_at"]
    search_fields = ["product__name", "sku"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "name", "rating", "is_verified_purchase", "created_at"]
    list_filter = ["rating", "is_verified_purchase", "created_at"]
    search_fields = ["product__name", "name", "title", "comment"]
