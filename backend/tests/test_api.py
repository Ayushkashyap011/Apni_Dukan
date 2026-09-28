import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from apps.categories.models import Category
from apps.products.models import Product, ProductVariant
from apps.accounts.models import Address
from apps.coupons.models import Coupon

User = get_user_model()

@pytest.mark.django_db
class TestApniDukanAPI:
    def setup_method(self):
        self.client = APIClient()

        # Users
        self.admin = User.objects.create_superuser('admin@test.com', 'Admin@123', role='ADMIN')
        self.customer = User.objects.create_user('customer@test.com', 'Customer@123', first_name='Test', last_name='Customer')

        # Address
        self.address = Address.objects.create(
            user=self.customer,
            full_name='Test Customer',
            phone='9876543210',
            address_line_1='123 Test Street',
            city='Mumbai',
            state='Maharashtra',
            postal_code='400001'
        )

        # Catalog
        self.category = Category.objects.create(name='Clothing', slug='clothing')
        self.product = Product.objects.create(
            name='Test Cotton T-Shirt',
            slug='test-cotton-t-shirt',
            category=self.category,
            price=Decimal('999.00'),
            discount_price=Decimal('799.00'),
            sku='TST-TSH-001',
            stock_quantity=50
        )
        self.variant = ProductVariant.objects.create(
            product=self.product,
            name='Size M / Navy',
            sku='TST-TSH-001-M-NAV',
            size='M',
            color='Navy',
            stock_quantity=20,
            price=Decimal('999.00'),
            discount_price=Decimal('799.00')
        )

        # Coupon
        from django.utils import timezone
        from datetime import timedelta
        self.coupon = Coupon.objects.create(
            code='SAVE100',
            discount_type=Coupon.DiscountType.FIXED,
            discount_value=Decimal('100.00'),
            min_order_amount=Decimal('500.00'),
            start_date=timezone.now() - timedelta(days=1),
            end_date=timezone.now() + timedelta(days=30),
            is_active=True
        )

    def test_user_registration_and_jwt_login(self):
        # Register
        reg_resp = self.client.post('/api/v1/auth/register/', {
            'email': 'newuser@test.com',
            'password': 'Password@123',
            'password_confirm': 'Password@123',
            'first_name': 'New',
            'last_name': 'User'
        })
        assert reg_resp.status_code == status.HTTP_201_CREATED
        assert 'access' in reg_resp.data

        # Login
        login_resp = self.client.post('/api/v1/auth/login/', {
            'email': 'newuser@test.com',
            'password': 'Password@123'
        })
        assert login_resp.status_code == status.HTTP_200_OK
        assert 'access' in login_resp.data

    def test_product_listing_and_detail(self):
        resp = self.client.get('/api/v1/products/')
        assert resp.status_code == status.HTTP_200_OK
        assert resp.data['count'] >= 1

        detail_resp = self.client.get(f'/api/v1/products/{self.product.slug}/')
        assert detail_resp.status_code == status.HTTP_200_OK
        assert detail_resp.data['name'] == self.product.name

    def test_cart_add_and_checkout_flow(self):
        self.client.force_authenticate(user=self.customer)

        # 1. Add item to cart
        add_resp = self.client.post('/api/v1/cart/items/', {
            'product_id': str(self.product.id),
            'variant_id': str(self.variant.id),
            'quantity': 2
        })
        assert add_resp.status_code == status.HTTP_200_OK
        assert add_resp.data['success'] is True

        # 2. Checkout order with mock payment
        checkout_resp = self.client.post('/api/v1/orders/checkout/', {
            'address_id': str(self.address.id),
            'payment_method': 'MOCK',
            'coupon_code': 'SAVE100'
        })
        assert checkout_resp.status_code == status.HTTP_201_CREATED
        order_data = checkout_resp.data['order']
        assert order_data['status'] == 'CONFIRMED'
        assert order_data['payment_status'] == 'PAID'

        # 3. Verify variant stock deducted cleanly (20 - 2 = 18)
        self.variant.refresh_from_db()
        assert self.variant.stock_quantity == 18
