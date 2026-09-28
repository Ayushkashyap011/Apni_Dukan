from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Wishlist, WishlistItem
from .serializers import WishlistSerializer, WishlistItemSerializer
from apps.products.models import Product
from apps.cart.models import Cart, CartItem

class WishlistViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_wishlist(self, request):
        wishlist, _ = Wishlist.objects.get_or_create(user=request.user)
        return wishlist

    def list(self, request):
        wishlist = self.get_wishlist(request)
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response({'success': True, 'data': serializer.data})

    @action(detail=False, methods=['post'], url_path='toggle')
    def toggle_item(self, request):
        wishlist = self.get_wishlist(request)
        product_id = request.data.get('product_id')
        if not product_id:
            return Response({'success': False, 'message': 'Product ID is required.'}, status=status.HTTP_400_BAD_REQUEST)

        product = get_object_or_404(Product, id=product_id)
        item = WishlistItem.objects.filter(wishlist=wishlist, product=product).first()

        if item:
            item.delete()
            added = False
            msg = 'Item removed from wishlist.'
        else:
            WishlistItem.objects.create(wishlist=wishlist, product=product)
            added = True
            msg = 'Item added to wishlist.'

        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response({'success': True, 'added': added, 'message': msg, 'data': serializer.data})

    @action(detail=False, methods=['post'], url_path='move-to-cart')
    def move_to_cart(self, request):
        wishlist = self.get_wishlist(request)
        product_id = request.data.get('product_id')
        variant_id = request.data.get('variant_id')

        product = get_object_or_404(Product, id=product_id)
        item = get_object_or_404(WishlistItem, wishlist=wishlist, product=product)

        cart, _ = Cart.objects.get_or_create(user=request.user)
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant_id=variant_id,
            defaults={'quantity': 1}
        )
        if not created:
            cart_item.quantity += 1
            cart_item.save()

        item.delete()
        serializer = WishlistSerializer(wishlist, context={'request': request})
        return Response({'success': True, 'message': 'Item moved to cart.', 'data': serializer.data})
