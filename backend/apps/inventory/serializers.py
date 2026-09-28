from rest_framework import serializers
from .models import InventoryTransaction

class InventoryTransactionSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    variant_name = serializers.ReadOnlyField(source='variant.name')

    class Meta:
        model = InventoryTransaction
        fields = ['id', 'product', 'product_name', 'variant', 'variant_name', 'transaction_type', 'quantity', 'reference', 'notes', 'created_by', 'created_at']
