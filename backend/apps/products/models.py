import uuid
from django.db import models
from apps.common.models import BaseModel
from apps.categories.models import Category, Subcategory

class Brand(BaseModel):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True, db_index=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

class Product(BaseModel):
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=280, unique=True, db_index=True)
    brand = models.ForeignKey(Brand, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    subcategory = models.ForeignKey(Subcategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    short_description = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2, db_index=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True, db_index=True)
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)
    is_featured = models.BooleanField(default=False, db_index=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0.0, db_index=True)
    review_count = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.sku})"

    @property
    def effective_price(self):
        return self.discount_price if self.discount_price and self.discount_price < self.price else self.price

    @property
    def discount_percentage(self):
        if self.discount_price and self.discount_price < self.price:
            return round(((self.price - self.discount_price) / self.price) * 100)
        return 0

    @property
    def in_stock(self):
        return self.stock_quantity > 0

class ProductVariant(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    name = models.CharField(max_length=150, help_text="e.g. Size M / Black")
    sku = models.CharField(max_length=100, unique=True, db_index=True)
    size = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    color = models.CharField(max_length=50, blank=True, null=True, db_index=True)
    price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['size', 'color']

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    @property
    def effective_price(self):
        if self.price:
            return self.discount_price if self.discount_price and self.discount_price < self.price else self.price
        return self.product.effective_price

class ProductImage(BaseModel):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='products/')
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    is_primary = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['display_order', '-is_primary', '-created_at']

    def __str__(self):
        return f"Image for {self.product.name}"
