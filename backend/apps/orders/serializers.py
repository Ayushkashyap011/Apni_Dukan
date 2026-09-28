from rest_framework import serializers
from .models import Order, OrderItem
from apps.products.serializers import ProductListSerializer, ProductVariantSerializer

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'variant', 'product_name', 'variant_name', 'product_sku', 'unit_price', 'quantity', 'total_price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'id', 'order_number', 'user', 'status', 'payment_status', 'payment_method',
            'shipping_full_name', 'shipping_phone', 'shipping_address_line_1', 'shipping_address_line_2',
            'shipping_city', 'shipping_state', 'shipping_postal_code', 'shipping_country',
            'subtotal', 'discount_amount', 'coupon_code', 'shipping_fee', 'tax_amount', 'grand_total',
            'notes', 'items', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'order_number', 'user', 'created_at', 'updated_at']

class CheckoutCreateSerializer(serializers.Serializer):
    address_id = serializers.UUIDField(required=True)
    payment_method = serializers.ChoiceField(choices=Order.PaymentMethod.choices, default=Order.PaymentMethod.MOCK)
    coupon_code = serializers.CharField(max_length=50, required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
