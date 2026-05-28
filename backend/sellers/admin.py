from django.contrib import admin
from .models import SellerProfile, Store


@admin.register(SellerProfile)
class SellerProfileAdmin(admin.ModelAdmin):
    list_display = ["business_name", "user", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["business_name", "user__email"]


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ["name", "seller", "is_active", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "seller__business_name"]
    prepopulated_fields = {"slug": ("name",)}

