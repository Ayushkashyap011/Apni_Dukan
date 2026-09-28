import uuid
from django.db import models
from django.conf import settings
from apps.common.models import BaseModel

class PaymentTransaction(BaseModel):
    class Status(models.TextChoices):
        PENDING = 'PENDING', 'Pending'
        COMPLETED = 'COMPLETED', 'Completed'
        FAILED = 'FAILED', 'Failed'
        REFUNDED = 'REFUNDED', 'Refunded'

    class PaymentMethod(models.TextChoices):
        CARD = 'CARD', 'Credit / Debit Card'
        UPI = 'UPI', 'UPI'
        NETBANKING = 'NETBANKING', 'Net Banking'
        COD = 'COD', 'Cash on Delivery'
        MOCK = 'MOCK', 'Mock Payment Gateway'

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='payments')
    order_id = models.UUIDField(db_index=True)
    transaction_id = models.CharField(max_length=100, unique=True, db_index=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default='INR')
    payment_method = models.CharField(max_length=30, choices=PaymentMethod.choices, default=PaymentMethod.MOCK)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    provider_reference = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.transaction_id} - ₹{self.amount} ({self.status})"
