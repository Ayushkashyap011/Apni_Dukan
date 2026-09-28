import uuid
from decimal import Decimal
from django.db import transaction
from django.utils import timezone
from apps.orders.models import Order, OrderItem
from apps.cart.models import Cart
from apps.accounts.models import Address
from apps.coupons.models import Coupon
from apps.inventory.models import InventoryTransaction
from apps.payments.models import PaymentTransaction
from apps.payments.services import PaymentService

class OrderService:
    @staticmethod
    @transaction.atomic
    def create_order_from_cart(user, address_id, payment_method='MOCK', coupon_code=None, notes=None):
        cart = Cart.objects.filter(user=user).prefetch_related('items__product', 'items__variant').first()
        if not cart or cart.items.count() == 0:
            raise ValueError("Your cart is empty.")

        address = Address.objects.filter(id=address_id, user=user).first()
        if not address:
            raise ValueError("Invalid shipping address selected.")

        # 1. Validate Stock & Lock Records
        items_to_create = []
        subtotal = Decimal('0.00')

        for cart_item in cart.items.all():
            product = cart_item.product
            variant = cart_item.variant
            qty = cart_item.quantity

            if not product.is_active:
                raise ValueError(f"Product '{product.name}' is no longer available.")

            available_stock = variant.stock_quantity if variant else product.stock_quantity
            if available_stock < qty:
                item_name = f"{product.name} ({variant.name})" if variant else product.name
                raise ValueError(f"Insufficient stock for '{item_name}'. Only {available_stock} item(s) remaining.")

            unit_price = variant.effective_price if variant else product.effective_price
            item_total = unit_price * qty
            subtotal += item_total

            items_to_create.append({
                'product': product,
                'variant': variant,
                'product_name': product.name,
                'variant_name': variant.name if variant else '',
                'product_sku': variant.sku if variant else product.sku,
                'unit_price': unit_price,
                'quantity': qty,
                'total_price': item_total
            })

        # 2. Apply Coupon
        discount_amount = Decimal('0.00')
        applied_coupon = None
        if coupon_code:
            applied_coupon = Coupon.objects.filter(code__iexact=coupon_code.strip()).first()
            if applied_coupon:
                is_valid, msg = applied_coupon.is_valid(subtotal, user=user)
                if not is_valid:
                    raise ValueError(msg)
                discount_amount = applied_coupon.calculate_discount(subtotal)
                applied_coupon.used_count += 1
                applied_coupon.save()

        # 3. Shipping & Taxes
        shipping_fee = Decimal('0.00') if subtotal >= 999 else Decimal('99.00')
        tax_amount = Decimal('0.00') # Included in product prices
        grand_total = (subtotal - discount_amount) + shipping_fee + tax_amount

        # 4. Generate Order Number
        order_number = f"AD-{timezone.now().strftime('%Y%m%d')}-{uuid.uuid4().hex[:6].upper()}"

        # 5. Create Order Record
        order = Order.objects.create(
            order_number=order_number,
            user=user,
            status=Order.OrderStatus.PENDING,
            payment_status=Order.PaymentStatus.PENDING,
            payment_method=payment_method,
            shipping_full_name=address.full_name,
            shipping_phone=address.phone,
            shipping_address_line_1=address.address_line_1,
            shipping_address_line_2=address.address_line_2 or '',
            shipping_city=address.city,
            shipping_state=address.state,
            shipping_postal_code=address.postal_code,
            shipping_country=address.country,
            subtotal=subtotal,
            discount_amount=discount_amount,
            coupon_code=coupon_code.upper() if coupon_code else None,
            shipping_fee=shipping_fee,
            tax_amount=tax_amount,
            grand_total=grand_total,
            notes=notes
        )

        # 6. Create Order Items & Deduct Stock
        for item_data in items_to_create:
            OrderItem.objects.create(order=order, **item_data)
            
            product = item_data['product']
            variant = item_data['variant']
            qty = item_data['quantity']

            if variant:
                variant.stock_quantity -= qty
                variant.save()
            else:
                product.stock_quantity -= qty
                product.save()

            # Log Inventory Transaction
            InventoryTransaction.objects.create(
                product=product,
                variant=variant,
                transaction_type=InventoryTransaction.TransactionType.SALE,
                quantity=-qty,
                reference=f"Order {order.order_number}",
                created_by=user
            )

        # 7. Process Payment
        if payment_method == 'COD':
            order.status = Order.OrderStatus.CONFIRMED
            order.save()
        else:
            provider = PaymentService.get_provider(payment_method)
            pay_result = provider.process_payment(
                amount=float(grand_total),
                currency='INR',
                metadata={'payment_method': payment_method, 'order_number': order.order_number}
            )

            txn_id = pay_result['transaction_id']
            if pay_result['success']:
                order.payment_status = Order.PaymentStatus.PAID
                order.status = Order.OrderStatus.CONFIRMED
                order.save()

                PaymentTransaction.objects.create(
                    user=user,
                    order_id=order.id,
                    transaction_id=txn_id,
                    amount=grand_total,
                    payment_method=payment_method,
                    status=PaymentTransaction.Status.COMPLETED,
                    provider_reference=pay_result.get('provider_reference')
                )
            else:
                order.payment_status = Order.PaymentStatus.FAILED
                order.save()
                PaymentTransaction.objects.create(
                    user=user,
                    order_id=order.id,
                    transaction_id=txn_id,
                    amount=grand_total,
                    payment_method=payment_method,
                    status=PaymentTransaction.Status.FAILED
                )
                raise ValueError(pay_result['message'])

        # 8. Clear Cart
        cart.items.all().delete()

        return order
