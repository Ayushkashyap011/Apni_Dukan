from rest_framework import viewsets, permissions, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, F
from .models import Brand, Product, ProductVariant, ProductImage
from .serializers import (
    BrandSerializer,
    ProductListSerializer,
    ProductDetailSerializer,
    ProductCreateUpdateSerializer,
    ProductVariantSerializer,
    ProductImageSerializer,
)
from apps.accounts.permissions import IsStaffUserRole

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.filter(is_active=True)
    serializer_class = BrandSerializer
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsStaffUserRole()]

class ProductViewSet(viewsets.ModelViewSet):
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'brand__name', 'category__name', 'sku']
    ordering_fields = ['price', 'discount_price', 'rating', 'created_at', 'review_count']
    ordering = ['-created_at']

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('brand', 'category', 'subcategory').prefetch_related('images', 'variants')
        
        # Category filter
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(Q(category__slug=category_slug) | Q(subcategory__slug=category_slug))

        # Brand filter
        brand_slug = self.request.query_params.get('brand')
        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)

        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        # Featured filter
        featured = self.request.query_params.get('featured')
        if featured and featured.lower() == 'true':
            queryset = queryset.filter(is_featured=True)

        # In stock filter
        in_stock = self.request.query_params.get('in_stock')
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(stock_quantity__gt=0)

        # Size filter
        size = self.request.query_params.get('size')
        if size:
            queryset = queryset.filter(variants__size__iexact=size).distinct()

        # Color filter
        color = self.request.query_params.get('color')
        if color:
            queryset = queryset.filter(variants__color__iexact=color).distinct()

        # Custom Sorting
        sort_by = self.request.query_params.get('sort_by')
        if sort_by == 'price_low':
            queryset = queryset.order_by('price')
        elif sort_by == 'price_high':
            queryset = queryset.order_by('-price')
        elif sort_by == 'newest':
            queryset = queryset.order_by('-created_at')
        elif sort_by == 'rating':
            queryset = queryset.order_by('-rating')

        return queryset

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProductDetailSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return ProductCreateUpdateSerializer
        return ProductListSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsStaffUserRole()]
