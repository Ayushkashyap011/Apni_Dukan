import os
import sys
import django
from decimal import Decimal
from django.utils import timezone
from datetime import timedelta

# Set up Django environment
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'apps')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth import get_user_model
from apps.accounts.models import Address
from apps.categories.models import Category, Subcategory
from apps.products.models import Brand, Product, ProductVariant, ProductImage
from apps.coupons.models import Coupon
from apps.reviews.models import Review

User = get_user_model()

def seed():
    print("[*] Seeding APNI DUKAN database...")

    # 1. Users
    admin_user, _ = User.objects.get_or_create(
        email='admin@apnidukan.com',
        defaults={
            'username': 'admin@apnidukan.com',
            'first_name': 'Apni',
            'last_name': 'Admin',
            'role': User.Role.ADMIN,
            'is_staff': True,
            'is_superuser': True,
            'phone': '+91 9876543210'
        }
    )
    admin_user.set_password('Admin@123')
    admin_user.save()
    print("  [OK] Admin User created: admin@apnidukan.com / Admin@123")

    customer_user, _ = User.objects.get_or_create(
        email='customer@apnidukan.com',
        defaults={
            'username': 'customer@apnidukan.com',
            'first_name': 'Rahul',
            'last_name': 'Sharma',
            'role': User.Role.CUSTOMER,
            'phone': '+91 9123456789'
        }
    )
    customer_user.set_password('Customer@123')
    customer_user.save()
    print("  [OK] Customer User created: customer@apnidukan.com / Customer@123")

    # Address
    Address.objects.get_or_create(
        user=customer_user,
        full_name='Rahul Sharma',
        phone='+91 9123456789',
        address_line_1='402, Sunshine Apartments, Bandra West',
        address_line_2='Near Linking Road',
        city='Mumbai',
        state='Maharashtra',
        postal_code='400050',
        country='India',
        is_default=True
    )
    print("  [OK] Customer Address created")

    # 2. Categories & Subcategories
    cat_clothing, _ = Category.objects.get_or_create(
        slug='clothing',
        defaults={'name': 'Clothing', 'description': 'Trending fashion wear for men and women'}
    )
    cat_accessories, _ = Category.objects.get_or_create(
        slug='accessories',
        defaults={'name': 'Accessories', 'description': 'Watches, bags, wallets, sunglasses and footwear'}
    )

    sub_tshirts, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='t-shirts', defaults={'name': 'T-Shirts'})
    sub_shirts, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='shirts', defaults={'name': 'Shirts'})
    sub_jeans, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='jeans', defaults={'name': 'Jeans'})
    sub_hoodies, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='hoodies', defaults={'name': 'Hoodies & Jackets'})
    sub_kurtas, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='kurtas', defaults={'name': 'Kurtas & Ethnic Wear'})

    sub_watches, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='watches', defaults={'name': 'Watches'})
    sub_bags, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='bags', defaults={'name': 'Bags & Backpacks'})
    sub_shoes, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='shoes', defaults={'name': 'Footwear & Sneakers'})
    sub_sunglasses, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='sunglasses', defaults={'name': 'Sunglasses'})

    print("  [OK] Categories & Subcategories created")

    # 3. Brands
    brands_data = [
        ('Roadster', 'roadster'),
        ('Levis', 'levis'),
        ('Raymond', 'raymond'),
        ('Allen Solly', 'allen-solly'),
        ('Titan', 'titan'),
        ('Puma', 'puma'),
        ('Nike', 'nike'),
        ('Manyavar', 'manyavar'),
        ('Urban Style', 'urban-style'),
    ]
    brand_objs = {}
    for name, slug in brands_data:
        b, _ = Brand.objects.get_or_create(slug=slug, defaults={'name': name})
        brand_objs[slug] = b
    print("  [OK] Brands created")

    # 4. Products Data
    products_data = [
        {
            'name': 'Premium Oversized Crew Neck T-Shirt',
            'slug': 'premium-oversized-crew-neck-tshirt',
            'brand': brand_objs['urban-style'],
            'category': cat_clothing,
            'subcategory': sub_tshirts,
            'price': Decimal('1499.00'),
            'discount_price': Decimal('799.00'),
            'sku': 'TS-OVS-001',
            'short_description': '100% Heavyweight combed cotton graphic t-shirt with modern relaxed fit.',
            'description': 'Elevate your street fashion with this premium oversized crew neck t-shirt. Crafted from 240 GSM bio-washed cotton, offering breathability and unmatched comfort.',
            'is_featured': True,
            'stock_quantity': 45,
            'sizes': ['S', 'M', 'L', 'XL'],
            'colors': ['Black', 'White', 'Olive Green']
        },
        {
            'name': 'Slim Fit Checked Casual Cotton Shirt',
            'slug': 'slim-fit-checked-casual-cotton-shirt',
            'brand': brand_objs['roadster'],
            'category': cat_clothing,
            'subcategory': sub_shirts,
            'price': Decimal('2499.00'),
            'discount_price': Decimal('1299.00'),
            'sku': 'SH-CHK-002',
            'short_description': 'Classic plaid casual shirt crafted from soft breathable pure cotton fabric.',
            'description': 'Designed for versatile styling, this casual button-down shirt transitions seamlessly from weekend hangouts to smart-casual office days.',
            'is_featured': True,
            'stock_quantity': 30,
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Navy Blue', 'Maroon']
        },
        {
            'name': '501 Original Fit Dark Indigo Jeans',
            'slug': '501-original-fit-dark-indigo-jeans',
            'brand': brand_objs['levis'],
            'category': cat_clothing,
            'subcategory': sub_jeans,
            'price': Decimal('3999.00'),
            'discount_price': Decimal('2799.00'),
            'sku': 'JN-LEV-501',
            'short_description': 'Timeless dark indigo denim jeans with classic straight leg and button fly.',
            'description': 'The original blue jean since 1873. Features durable heavy denim with authentic copper rivets and subtle stretch for all-day comfort.',
            'is_featured': True,
            'stock_quantity': 25,
            'sizes': ['30', '32', '34', '36'],
            'colors': ['Dark Indigo', 'Washed Black']
        },
        {
            'name': 'Fleece Lined Pullover Streetwear Hoodie',
            'slug': 'fleece-lined-pullover-streetwear-hoodie',
            'brand': brand_objs['puma'],
            'category': cat_clothing,
            'subcategory': sub_hoodies,
            'price': Decimal('3499.00'),
            'discount_price': Decimal('1999.00'),
            'sku': 'HD-PUM-004',
            'short_description': 'Cozy fleece hoodie featuring kangaroo pocket and ribbed cuffs.',
            'description': 'Stay warm in bold urban style with this fleece lined pullover hoodie. Features an adjustable drawstring hood and durable ribbing.',
            'is_featured': True,
            'stock_quantity': 20,
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Charcoal Grey', 'Jet Black']
        },
        {
            'name': 'Designer Embroidered Cotton Silk Kurta',
            'slug': 'designer-embroidered-cotton-silk-kurta',
            'brand': brand_objs['manyavar'],
            'category': cat_clothing,
            'subcategory': sub_kurtas,
            'price': Decimal('4999.00'),
            'discount_price': Decimal('3499.00'),
            'sku': 'KR-MAN-005',
            'short_description': 'Rich cotton silk ethnic kurta with delicate neck embroidery for festive occasions.',
            'description': 'Embrace traditional elegance with this royal embroidered silk blend kurta. Paired effortlessly with churidars or denim.',
            'is_featured': True,
            'stock_quantity': 15,
            'sizes': ['M', 'L', 'XL', 'XXL'],
            'colors': ['Royal Blue', 'Cream Silk']
        },
        {
            'name': 'Minimalist Chronograph Leather Watch',
            'slug': 'minimalist-chronograph-leather-watch',
            'brand': brand_objs['titan'],
            'category': cat_accessories,
            'subcategory': sub_watches,
            'price': Decimal('6995.00'),
            'discount_price': Decimal('4495.00'),
            'sku': 'WT-TTN-006',
            'short_description': 'Sleek stainless steel quartz watch with genuine brown leather strap.',
            'description': 'Features a mineral glass crystal dial, 50m water resistance, and Japanese quartz movement for sophisticated timekeeping.',
            'is_featured': True,
            'stock_quantity': 12,
            'sizes': ['Free Size'],
            'colors': ['Tan Brown / Silver Dial']
        },
        {
            'name': 'Air Max Retro Running Sneakers',
            'slug': 'air-max-retro-running-sneakers',
            'brand': brand_objs['nike'],
            'category': cat_accessories,
            'subcategory': sub_shoes,
            'price': Decimal('8995.00'),
            'discount_price': Decimal('6495.00'),
            'sku': 'SNK-NKE-007',
            'short_description': 'High-cushion responsive running shoes with breathable mesh upper.',
            'description': 'Experience responsive cushioning with every stride. Engineered mesh upper keeps feet cool during workout and casual wear.',
            'is_featured': True,
            'stock_quantity': 18,
            'sizes': ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
            'colors': ['White / Cobalt Blue', 'Black / Metallic Grey']
        },
        {
            'name': 'Urban Utility Canvas Laptop Backpack',
            'slug': 'urban-utility-canvas-laptop-backpack',
            'brand': brand_objs['roadster'],
            'category': cat_accessories,
            'subcategory': sub_bags,
            'price': Decimal('2999.00'),
            'discount_price': Decimal('1499.00'),
            'sku': 'BG-RDS-008',
            'short_description': 'Durable water-resistant 25L canvas backpack with padded 15.6" laptop sleeve.',
            'description': 'Built for commuters and travelers alike. Features multiple organizational pockets and ergonomic padded shoulder straps.',
            'is_featured': False,
            'stock_quantity': 40,
            'sizes': ['25 Liters'],
            'colors': ['Olive Drab', 'Midnight Navy']
        }
    ]

    for p_data in products_data:
        sizes = p_data.pop('sizes')
        colors = p_data.pop('colors')

        product, created = Product.objects.get_or_create(
            slug=p_data['slug'],
            defaults=p_data
        )

        if created:
            # Create Variants
            for sz in sizes:
                for clr in colors:
                    v_sku = f"{product.sku}-{sz}-{clr[:3].upper()}"
                    ProductVariant.objects.get_or_create(
                        product=product,
                        sku=v_sku,
                        defaults={
                            'name': f"Size {sz} / {clr}",
                            'size': sz,
                            'color': clr,
                            'stock_quantity': 10,
                            'price': product.price,
                            'discount_price': product.discount_price
                        }
                    )

    print("  [OK] Products & Variants created")

    # 5. Coupons
    now = timezone.now()
    Coupon.objects.get_or_create(
        code='WELCOME10',
        defaults={
            'discount_type': Coupon.DiscountType.PERCENTAGE,
            'discount_value': Decimal('10.00'),
            'min_order_amount': Decimal('500.00'),
            'start_date': now - timedelta(days=10),
            'end_date': now + timedelta(days=365),
            'usage_limit': 1000,
            'per_user_limit': 1,
            'is_active': True
        }
    )
    Coupon.objects.get_or_create(
        code='FASHION500',
        defaults={
            'discount_type': Coupon.DiscountType.FIXED,
            'discount_value': Decimal('500.00'),
            'min_order_amount': Decimal('1999.00'),
            'start_date': now - timedelta(days=10),
            'end_date': now + timedelta(days=180),
            'usage_limit': 500,
            'per_user_limit': 1,
            'is_active': True
        }
    )
    print("  [OK] Coupons created (WELCOME10, FASHION500)")

    # 6. Sample Product Review
    first_product = Product.objects.first()
    if first_product:
        Review.objects.get_or_create(
            user=customer_user,
            product=first_product,
            defaults={
                'rating': 5,
                'title': 'Outstanding quality and fit!',
                'comment': 'The fabric feels premium, true to size and fast delivery! Highly recommended.',
                'is_verified_purchase': True,
                'is_approved': True
            }
        )
        print("  [OK] Sample Product Review created")

    print("[DONE] Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
