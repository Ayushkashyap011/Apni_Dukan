import uuid
from django.db import models
from django.utils import timezone
from apps.common.models import BaseModel

class Coupon(BaseModel):
    class DiscountType(models.TextChoices):
        PERCENTAGE = 'PERCENTAGE', 'Percentage'
        FIXED = 'FIXED', 'Fixed Amount'

    code = models.CharField(max_length=50, unique=True, db_index=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField()
    usage_limit = models.PositiveIntegerField(null=True, blank=True)
    used_count = models.PositiveIntegerField(default=0)
    per_user_limit = models.PositiveIntegerField(default=1)
    is_active = models.BooleanField(default=True, db_index=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.get_discount_type_display()} - {self.discount_value})"

    def is_valid(self, subtotal, user=None):
        now = timezone.now()
        if not self.is_active:
            return False, "Coupon is inactive."
        if now < self.start_date or now > self.end_date:
            return False, "Coupon has expired or is not yet active."
        if subtotal < self.min_order_amount:
            return False, f"Minimum order amount for this coupon is ₹{self.min_order_amount}."
        if self.usage_limit and self.used_count >= self.usage_limit:
            return False, "Coupon usage limit reached."
        return True, "Coupon is valid."

    def calculate_discount(self, subtotal):
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = (subtotal * self.discount_value) / 100
            if self.max_discount and discount > self.max_discount:
                discount = self.max_discount
        else:
            discount = self.discount_value
        return min(discount, subtotal)
