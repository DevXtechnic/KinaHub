from django.db.models import Q
from rest_framework import viewsets, permissions
from .models import Product, Category, Brand
from .serializers import ProductSerializer, CategorySerializer, BrandSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.filter(is_active=True).prefetch_related('images', 'category', 'brand')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

    def get_queryset(self):
        queryset = super().get_queryset()

        category = self.request.query_params.get('category')
        brand = self.request.query_params.get('brand')
        featured = self.request.query_params.get('featured')
        query = self.request.query_params.get('q')

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

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [permissions.AllowAny]
