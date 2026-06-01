from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CategoryViewSet, BrandViewSet, SearchSuggestionsView, ReviewViewSet

router = DefaultRouter()
router.register(r'items', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'reviews', ReviewViewSet)

urlpatterns = [
    path('suggestions/', SearchSuggestionsView.as_view()),
    path('', include(router.urls)),
]
