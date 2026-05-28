from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from .models import Product, Category, Brand
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer

class ProductAccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user.effective_role in ["seller", "admin"])

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).select_related('store', 'category', 'brand').prefetch_related('images')
    serializer_class = ProductSerializer
    permission_classes = [ProductAccessPermission]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')
        featured = self.request.query_params.get('featured')
        query = self.request.query_params.get('q')
        mine = self.request.query_params.get('mine', 'false').lower() == 'true'

        if mine:
            if not self.request.user.is_authenticated:
                return queryset.none()
            if self.request.user.effective_role == "seller":
                store = getattr(getattr(self.request.user, "seller_profile", None), "store", None)
                return Product.objects.filter(store=store).select_related('store', 'category', 'brand').prefetch_related('images')
            if self.request.user.effective_role == "admin":
                return Product.objects.all().select_related('store', 'category', 'brand').prefetch_related('images')

        if category:
            queryset = queryset.filter(category__slug=category)
        if brand:
            queryset = queryset.filter(brand__slug=brand)
        if featured:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query) |
                Q(brand__name__icontains=query)
            )

        # Handle random ordering if requested
        is_random = self.request.query_params.get('random', 'false').lower() == 'true'
        if is_random:
            # Note: order_by('?') is expensive on large datasets, but for small-mid size tech site it's fine.
            # Alternately we could fetch all IDs and shuffle them in memory if needed.
            return queryset.order_by('?')
            
        return queryset

    def perform_create(self, serializer):
        if self.request.user.effective_role == "admin":
            serializer.save()
            return
        seller_profile = getattr(self.request.user, "seller_profile", None)
        store = getattr(seller_profile, "store", None)
        if not store:
            raise ValidationError({"store": "Complete seller onboarding before adding products."})
        serializer.save(store=store)

    def perform_update(self, serializer):
        product = self.get_object()
        if self.request.user.effective_role == "admin":
            serializer.save()
            return
        store = getattr(getattr(self.request.user, "seller_profile", None), "store", None)
        if product.store_id != getattr(store, "id", None):
            raise PermissionDenied("You can only manage your own store products.")
        serializer.save(store=store)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
