from rest_framework import serializers
from .models import Cart, CartItem
from apps.products.serializers import ProductListSerializer, ProductVariantSerializer

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.UUIDField(write_only=True)
    variant = ProductVariantSerializer(read_only=True)
    variant_id = serializers.UUIDField(write_only=True, required=False, allow_null=True)
    unit_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'product', 'product_id', 'variant', 'variant_id', 'quantity', 'unit_price', 'total_price', 'created_at']

class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_items = serializers.IntegerField(read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    shipping_fee = serializers.SerializerMethodField()
    grand_total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'user', 'items', 'total_items', 'subtotal', 'shipping_fee', 'grand_total', 'updated_at']

    def get_shipping_fee(self, obj):
        # Free shipping above ₹999, else ₹99
        return 0.00 if obj.subtotal >= 999 else (99.00 if obj.subtotal > 0 else 0.00)

    def get_grand_total(self, obj):
        shipping = self.get_shipping_fee(obj)
        return float(obj.subtotal) + shipping
