from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, CheckoutCreateSerializer
from .services import OrderService
from apps.accounts.permissions import IsStaffUserRole

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff_role:
            return Order.objects.all().prefetch_related('items')
        return Order.objects.filter(user=user).prefetch_related('items')

    @action(detail=False, methods=['post'], url_path='checkout')
    def checkout(self, request):
        serializer = CheckoutCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        address_id = serializer.validated_data['address_id']
        payment_method = serializer.validated_data.get('payment_method', 'MOCK')
        coupon_code = serializer.validated_data.get('coupon_code')
        notes = serializer.validated_data.get('notes')

        try:
            order = OrderService.create_order_from_cart(
                user=request.user,
                address_id=address_id,
                payment_method=payment_method,
                coupon_code=coupon_code,
                notes=notes
            )
            order_data = OrderSerializer(order, context={'request': request}).data
            return Response({
                'success': True,
                'message': 'Order placed successfully!',
                'order': order_data
            }, status=status.HTTP_201_CREATED)
        except ValueError as e:
            return Response({'success': False, 'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], permission_classes=[IsStaffUserRole], url_path='update-status')
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get('status')
        new_payment_status = request.data.get('payment_status')

        if new_status and new_status in Order.OrderStatus.values:
            order.status = new_status
        if new_payment_status and new_payment_status in Order.PaymentStatus.values:
            order.payment_status = new_payment_status

        order.save()
        return Response({
            'success': True,
            'message': f"Order status updated to {order.status}.",
            'order': OrderSerializer(order).data
        })
