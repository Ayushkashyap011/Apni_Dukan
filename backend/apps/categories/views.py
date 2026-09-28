from rest_framework import viewsets, permissions
from .models import Category, Subcategory
from .serializers import CategorySerializer, SubcategorySerializer
from apps.accounts.permissions import IsStaffUserRole

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.filter(is_active=True).prefetch_related('subcategories')
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsStaffUserRole()]

class SubcategoryViewSet(viewsets.ModelViewSet):
    queryset = Subcategory.objects.filter(is_active=True).select_related('category')
    serializer_class = SubcategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsStaffUserRole()]
