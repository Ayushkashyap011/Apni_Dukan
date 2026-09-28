import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel
from apps.products.models import Product

class Wishlist(BaseModel):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')

    def __str__(self):
        return f"Wishlist of {self.user.email}"

class WishlistItem(BaseModel):
    wishlist = models.ForeignKey(Wishlist, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('wishlist', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.product.name} in {self.wishlist.user.email}'s wishlist"
