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
        if featured:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        if query:
            queryset = queryset.filter(
                Q(name__icontains=query) |
                Q(description__icontains=query) |
                Q(category__name__icontains=query) |
                Q(brand__name__icontains=query)
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
        query = (request.query_params.get('q') or '').strip()
        if len(query) < 2:
            return Response({'query': query, 'categories': [], 'brands': [], 'products': []})

        category_matches = list(
            Category.objects.filter(Q(name__icontains=query) | Q(description__icontains=query)).order_by('order', 'name')[:6]
        )
        brand_matches = list(Brand.objects.filter(name__icontains=query).order_by('name')[:6])

        products_qs = (
            Product.objects.filter(
                is_active=True
            )
            .filter(
                Q(name__icontains=query)
                | Q(description__icontains=query)
                | Q(category__name__icontains=query)
                | Q(brand__name__icontains=query)
            )
            .select_related('category', 'brand')
            .prefetch_related('images')
        )

        seen_ids = set()
        products = []
        for product in products_qs.distinct().order_by('-is_featured', '-rating', '-created_at')[:8]:
            if product.id in seen_ids:
                continue
            seen_ids.add(product.id)
            primary_image = next((image.image_url for image in product.images.all() if image.image_url), '')
            products.append({
                'id': product.id,
                'slug': product.slug,
                'name': product.name,
                'category': product.category.name,
                'brand': product.brand.name if product.brand else '',
                'image': primary_image,
                'href': f'/product/{product.slug}',
            })

        categories = [
            {
                'id': category.id,
                'slug': category.slug,
                'name': category.name,
                'description': category.description,
                'href': f'/products?category={category.slug}',
            }
            for category in category_matches
        ]

        brands = [
            {
                'id': brand.id,
                'slug': brand.slug,
                'name': brand.name,
                'href': f'/products?brand={brand.slug}',
            }
            for brand in brand_matches
        ]

        return Response({'query': query, 'categories': categories, 'brands': brands, 'products': products})
