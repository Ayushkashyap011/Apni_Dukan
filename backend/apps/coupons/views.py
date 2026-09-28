from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Coupon
from .serializers import CouponSerializer, CouponValidateSerializer
from apps.accounts.permissions import IsStaffUserRole

class CouponViewSet(viewsets.ModelViewSet):
    queryset = Coupon.objects.all()
    serializer_class = CouponSerializer

    def get_permissions(self):
        if self.action in ['validate_coupon']:
            return [permissions.IsAuthenticated()]
        return [IsStaffUserRole()]

    @action(detail=False, methods=['post'], url_path='validate')
    def validate_coupon(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        code = serializer.validated_data['code'].strip().upper()
        subtotal = serializer.validated_data['subtotal']

        coupon = Coupon.objects.filter(code__iexact=code).first()
        if not coupon:
            return Response({'success': False, 'message': 'Invalid coupon code.'}, status=status.HTTP_404_NOT_FOUND)

        is_valid, msg = coupon.is_valid(subtotal, user=request.user)
        if not is_valid:
            return Response({'success': False, 'message': msg}, status=status.HTTP_400_BAD_REQUEST)

        discount_amount = coupon.calculate_discount(subtotal)
        return Response({
            'success': True,
            'message': 'Coupon applied successfully.',
            'coupon': {
                'code': coupon.code,
                'discount_type': coupon.discount_type,
                'discount_value': str(coupon.discount_value),
                'discount_amount': str(discount_amount),
            }
        })
