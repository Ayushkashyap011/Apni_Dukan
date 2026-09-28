from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count, Q
from django.contrib.auth import get_user_model
from apps.orders.models import Order, OrderItem
from apps.products.models import Product, ProductVariant
from apps.accounts.permissions import IsStaffUserRole

User = get_user_model()

class AdminDashboardAnalyticsView(APIView):
    permission_classes = [IsStaffUserRole]

    def get(self, request):
        # Total Revenue
        revenue = Order.objects.filter(
            Q(status=Order.OrderStatus.DELIVERED) | Q(payment_status=Order.PaymentStatus.PAID)
        ).aggregate(total=Sum('grand_total'))['total'] or 0.00

        # Total Orders & Pending Orders
        total_orders = Order.objects.count()
        pending_orders = Order.objects.filter(status__in=[Order.OrderStatus.PENDING, Order.OrderStatus.CONFIRMED, Order.OrderStatus.PROCESSING]).count()

        # Total Customers & Products
        total_customers = User.objects.filter(role=User.Role.CUSTOMER).count()
        total_products = Product.objects.filter(is_active=True).count()

        # Low Stock Alerts (Stock <= 5)
        low_stock_products = Product.objects.filter(is_active=True, stock_quantity__lte=5).values('id', 'name', 'sku', 'stock_quantity')[:10]

        # Recent 5 Orders
        recent_orders = Order.objects.all().order_by('-created_at')[:5].values(
            'id', 'order_number', 'shipping_full_name', 'grand_total', 'status', 'payment_status', 'created_at'
        )

        # Top 5 Best Selling Products
        top_products = OrderItem.objects.values('product_name').annotate(
            total_sold=Sum('quantity'),
            total_revenue=Sum('total_price')
        ).order_by('-total_sold')[:5]

        return Response({
            'success': True,
            'data': {
                'total_revenue': float(revenue),
                'total_orders': total_orders,
                'pending_orders': pending_orders,
                'total_customers': total_customers,
                'total_products': total_products,
                'low_stock_alerts': list(low_stock_products),
                'recent_orders': list(recent_orders),
                'top_products': list(top_products),
            }
        })
