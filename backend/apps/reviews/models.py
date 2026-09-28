import uuid
from django.db import models
from django.conf import settings
from django.db.models import Avg
from apps.common.models import BaseModel
from apps.products.models import Product

class Review(BaseModel):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    title = models.CharField(max_length=200)
    comment = models.TextField()
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True, db_index=True)

    class Meta:
        unique_together = ('user', 'product')
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.rating}★ by {self.user.email} on {self.product.name}"

    def update_product_rating(self):
        approved_reviews = Review.objects.filter(product=self.product, is_approved=True)
        count = approved_reviews.count()
        avg_rating = approved_reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0
        
        self.product.review_count = count
        self.product.rating = round(avg_rating, 2)
        self.product.save(update_fields=['review_count', 'rating'])

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        self.update_product_rating()

    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        approved_reviews = Review.objects.filter(product=product, is_approved=True)
        count = approved_reviews.count()
        avg_rating = approved_reviews.aggregate(Avg('rating'))['rating__avg'] or 0.0
        product.review_count = count
        product.rating = round(avg_rating, 2)
        product.save(update_fields=['review_count', 'rating'])
