from rest_framework import viewsets, permissions
from .models import InventoryTransaction
from .serializers import InventoryTransactionSerializer
from apps.accounts.permissions import IsStaffUserRole

class InventoryTransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = InventoryTransaction.objects.all().select_related('product', 'variant')
    serializer_class = InventoryTransactionSerializer
    permission_classes = [IsStaffUserRole]
