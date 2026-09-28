from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Review
from .serializers import ReviewSerializer
from apps.products.models import Product
from apps.orders.models import OrderItem

class ReviewViewSet(viewsets.ModelViewSet):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        product_id = self.request.query_params.get('product_id')
        queryset = Review.objects.filter(is_approved=True).select_related('user')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def create(self, request, *args, **kwargs):
        product_id = request.data.get('product')
        product = get_object_or_404(Product, id=product_id)

        # Check if user already reviewed
        if Review.objects.filter(user=request.user, product=product).exists():
            return Response({'success': False, 'message': 'You have already reviewed this product.'}, status=status.HTTP_400_BAD_REQUEST)

        # Check verified purchase
        is_verified = OrderItem.objects.filter(order__user=request.user, order__status='DELIVERED', product=product).exists()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user, is_verified_purchase=is_verified)
        return Response({'success': True, 'message': 'Review submitted successfully!', 'data': serializer.data}, status=status.HTTP_201_CREATED)
