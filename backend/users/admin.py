from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Address, CustomerProfile, User


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (("Marketplace", {"fields": ("role", "phone", "address")}),)
    list_display = ["email", "username", "role", "is_staff", "is_active"]
    list_filter = ["role", "is_staff", "is_active"]
    search_fields = ["email", "username", "first_name", "last_name"]


@admin.register(CustomerProfile)
class CustomerProfileAdmin(admin.ModelAdmin):
    list_display = ["user", "full_name", "lifetime_value", "created_at"]
    search_fields = ["user__email", "full_name"]


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ["user", "label", "city", "country", "is_default"]
    list_filter = ["address_type", "is_default", "city"]
