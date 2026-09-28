from rest_framework import serializers
from .models import Brand, Product, ProductVariant, ProductImage
from apps.categories.serializers import CategorySerializer, SubcategorySerializer

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name', 'slug', 'logo', 'description', 'is_active']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'display_order']

class ProductVariantSerializer(serializers.ModelSerializer):
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'sku', 'size', 'color', 'price', 'discount_price', 'effective_price', 'stock_quantity', 'is_active']

class ProductListSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    category_name = serializers.ReadOnlyField(source='category.name')
    primary_image = serializers.SerializerMethodField()
    effective_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    discount_percentage = serializers.IntegerField(read_only=True)
    in_stock = serializers.BooleanField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'brand', 'category', 'category_name',
            'short_description', 'price', 'discount_price', 'effective_price',
            'discount_percentage', 'sku', 'stock_quantity', 'in_stock',
            'is_active', 'is_featured', 'rating', 'review_count',
            'primary_image', 'created_at'
        ]

    def get_primary_image(self, obj):
        image = obj.images.filter(is_primary=True).first() or obj.images.first()
        if image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(image.image.url)
            return image.image.url
        return None

class ProductDetailSerializer(ProductListSerializer):
    category = CategorySerializer(read_only=True)
    subcategory = SubcategorySerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ProductListSerializer.Meta.fields + [
            'description', 'subcategory', 'images', 'variants'
        ]

class ProductCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
