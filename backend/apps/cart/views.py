from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from apps.products.models import Product, ProductVariant

class CartViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_cart(self, request):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        return cart

    def list(self, request):
        cart = self.get_cart(request)
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'success': True, 'data': serializer.data})

    @action(detail=False, methods=['post'], url_path='items')
    def add_item(self, request):
        cart = self.get_cart(request)
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')
        quantity = int(request.data.get('quantity', 1))

        if quantity <= 0:
            return Response({'success': False, 'message': 'Quantity must be at least 1.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id, is_active=True)
        variant = None
        if variant_id:
            variant = get_object_or_404(ProductVariant, id=variant_id, product=product, is_active=True)

        available_stock = variant.stock_quantity if variant else product.stock_quantity
        
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={'quantity': quantity}
        )

        new_quantity = cart_item.quantity if created else cart_item.quantity + quantity
        if new_quantity > available_stock:
            return Response({
                'success': False,
                'message': f'Cannot add {quantity} item(s). Only {available_stock} item(s) available in stock.'
            }, status=status.HTTP_400_BAD_REQUEST)

        if not created:
            cart_item.quantity = new_quantity
            cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response({'success': True, 'message': 'Item added to cart.', 'data': serializer.data})

    @action(detail=False, methods=['patch'], url_path='items/(?P<item_id>[^/.]+)')
    def update_item(self, request, item_id=None):
        cart = self.get_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        quantity = int(request.data.get('quantity', cart_item.quantity))

        if quantity <= 0:
            cart_item.delete()
        else:
            available_stock = cart_item.variant.stock_quantity if cart_item.variant else cart_item.product.stock_quantity
            if quantity > available_stock:
                return Response({
                    'success': False,
                    'message': f'Requested quantity {quantity} exceeds available stock ({available_stock}).'
                }, status=status.HTTP_400_BAD_REQUEST)
            cart_item.quantity = quantity
            cart_item.save()

        serializer = CartSerializer(cart, context={'request': request})
        return Response({'success': True, 'message': 'Cart updated.', 'data': serializer.data})

    @action(detail=False, methods=['delete'], url_path='items/(?P<item_id>[^/.]+)/remove')
    def remove_item(self, request, item_id=None):
        cart = self.get_cart(request)
        cart_item = get_object_or_404(CartItem, id=item_id, cart=cart)
        cart_item.delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'success': True, 'message': 'Item removed from cart.', 'data': serializer.data})

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self.get_cart(request)
        cart.items.all().delete()
        serializer = CartSerializer(cart, context={'request': request})
        return Response({'success': True, 'message': 'Cart cleared.', 'data': serializer.data})
