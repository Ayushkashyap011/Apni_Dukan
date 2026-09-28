import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.products.models import Product, ProductVariant

class InventoryTransaction(BaseModel):
    class TransactionType(models.TextChoices):
        PURCHASE = 'PURCHASE', 'Purchase / Restock'
        SALE = 'SALE', 'Customer Sale'
        RETURN = 'RETURN', 'Customer Return'
        ADJUSTMENT = 'ADJUSTMENT', 'Manual Adjustment'
        RESERVATION = 'RESERVATION', 'Stock Reservation'
        RELEASE = 'RELEASE', 'Reservation Release'

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='inventory_transactions')
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True, related_name='inventory_transactions')
    transaction_type = models.CharField(max_length=20, choices=TransactionType.choices)
    quantity = models.IntegerField(help_text="Positive for addition, negative for deduction.")
    reference = models.CharField(max_length=100, blank=True, null=True, help_text="e.g. Order ID or Restock Batch #")
    notes = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        target = f"{self.product.name} ({self.variant.name})" if self.variant else self.product.name
        return f"{self.transaction_type}: {self.quantity} for {target}"
