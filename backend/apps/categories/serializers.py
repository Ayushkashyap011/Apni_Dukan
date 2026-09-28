from rest_framework import serializers
from .models import Category, Subcategory

class SubcategorySerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Subcategory
        fields = ['id', 'category', 'category_name', 'name', 'slug', 'description', 'image', 'is_active', 'created_at']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubcategorySerializer(many=True, read_only=True)
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'image', 'is_active', 'subcategories', 'product_count', 'created_at']

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count() if hasattr(obj, 'products') else 0
