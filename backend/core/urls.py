from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('', RedirectView.as_view(url='/api/products/')),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/sellers/', include('sellers.urls')),
    path('api/', include('orders.urls')),
    path('api/crm/', include('crm.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
