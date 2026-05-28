from django.db.models import Q, DecimalField
from django.db.models.functions import Coalesce
from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
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
        store = self.request.query_params.get('store')
        featured = self.request.query_params.get('featured')
        query = self.request.query_params.get('q')
        sort = self.request.query_params.get('sort', '').lower().strip()
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
        if store:
            queryset = queryset.filter(store__slug=store)
        if featured:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query) |
                Q(brand__name__icontains=query) |
                Q(store__name__icontains=query)
            )

        is_random = self.request.query_params.get('random', 'false').lower() == 'true'
        if sort == 'price_low':
            queryset = queryset.annotate(
                effective_price=Coalesce('discount_price', 'price', output_field=DecimalField(max_digits=10, decimal_places=2))
            ).order_by('effective_price', '-created_at')
        elif sort == 'price_high':
            queryset = queryset.annotate(
                effective_price=Coalesce('discount_price', 'price', output_field=DecimalField(max_digits=10, decimal_places=2))
            ).order_by('-effective_price', '-created_at')
        elif sort == 'rating_high':
            queryset = queryset.order_by('-rating', '-created_at')
        elif sort == 'rating_low':
            queryset = queryset.order_by('rating', '-created_at')
        elif sort == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort == 'name_az':
            queryset = queryset.order_by('name', '-created_at')
        elif sort == 'name_za':
            queryset = queryset.order_by('-name', '-created_at')
        elif sort == 'featured':
            queryset = queryset.order_by('-is_featured', '-created_at')
        elif is_random:
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


class SearchSuggestionsView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        query = (request.query_params.get('q') or '').strip().lower()
        if len(query) < 2:
            return Response({'suggestions': []})

        suggestions = []

        # 1. Exact or partial category matches
        categories = Category.objects.filter(name__icontains=query).values_list('name', flat=True)[:3]
        for c in categories:
            suggestions.append(c.lower())

        # 2. Products matching query
        products = Product.objects.filter(
            is_active=True
        ).filter(
            Q(name__icontains=query) | Q(category__name__icontains=query) | Q(brand__name__icontains=query)
        ).select_related('category', 'brand')[:20]

        for p in products:
            # Suggest the product name itself
            if query in p.name.lower():
                suggestions.append(p.name.lower())

            # Suggest category + brand
            if p.brand:
                cat_brand = f"{p.category.name.lower()} {p.brand.name.lower()}"
                if query in cat_brand or query in p.category.name.lower():
                    suggestions.append(cat_brand)

        # Deduplicate and keep order
        seen = set()
        unique_suggestions = []
        for s in suggestions:
            if s not in seen:
                seen.add(s)
                unique_suggestions.append(s)

        # Return top 8
        return Response({'suggestions': unique_suggestions[:8]})
