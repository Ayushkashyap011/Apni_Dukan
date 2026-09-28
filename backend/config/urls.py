from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from apps.common.analytics import AdminDashboardAnalyticsView

api_v1_patterns = [
    path('', include('apps.accounts.urls')),
    path('', include('apps.categories.urls')),
    path('', include('apps.products.urls')),
    path('', include('apps.cart.urls')),
    path('', include('apps.wishlist.urls')),
    path('', include('apps.coupons.urls')),
    path('', include('apps.orders.urls')),
    path('', include('apps.reviews.urls')),
    path('', include('apps.notifications.urls')),
    path('admin/analytics/', AdminDashboardAnalyticsView.as_view(), name='admin_analytics'),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include((api_v1_patterns, 'v1'))),
    
    # OpenAPI Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
