import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.products.models import Product, ProductVariant

class Cart(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='cart')

    def __str__(self):
        return f"Cart of {self.user.email}"

    @property
    def total_items(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def subtotal(self):
        return sum(item.total_price for item in self.items.all())

class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)

    class Meta:
        unique_together = ('cart', 'product', 'variant')

    def __str__(self):
        variant_str = f" ({self.variant.name})" if self.variant else ""
        return f"{self.quantity}x {self.product.name}{variant_str}"

    @property
    def unit_price(self):
        if self.variant and self.variant.effective_price:
            return self.variant.effective_price
        return self.product.effective_price

    @property
    def total_price(self):
        return self.unit_price * self.quantity
