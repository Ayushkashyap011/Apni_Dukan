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
    print("[*] Seeding APNI DUKAN database with original product images & accessories...")

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
        defaults={'name': 'Accessories', 'description': 'Watches, bags, wallets, sunglasses, belts, caps & footwear'}
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
    sub_wallets, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='wallets-belts', defaults={'name': 'Wallets & Belts'})
    sub_caps, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='caps-jewelry', defaults={'name': 'Caps & Jewelry'})

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
        ('Wildcraft', 'wildcraft'),
        ('Ray-Ban', 'ray-ban'),
    ]
    brand_objs = {}
    for name, slug in brands_data:
        b, _ = Brand.objects.get_or_create(slug=slug, defaults={'name': name})
        brand_objs[slug] = b
    print("  [OK] Brands created")

    # 4. Products Data with Original Image URLs
    Product.objects.all().delete()
    products_data = [
        # Clothing
        {
            'name': 'Premium Heavyweight Graphic Oversized T-Shirt',
            'slug': 'premium-heavyweight-graphic-oversized-tshirt',
            'brand': brand_objs['urban-style'],
            'category': cat_clothing,
            'subcategory': sub_tshirts,
            'price': Decimal('1499.00'),
            'discount_price': Decimal('799.00'),
            'sku': 'TS-OVS-001',
            'short_description': '240 GSM bio-washed heavyweight combed cotton graphic t-shirt.',
            'description': 'Elevate your street fashion with this premium oversized crew neck t-shirt. Crafted from heavyweight combed cotton offering breathability and unmatched comfort.',
            'is_featured': True,
            'stock_quantity': 45,
            'images': [
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800',
                'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'
            ],
            'sizes': ['S', 'M', 'L', 'XL'],
            'colors': ['Black', 'White', 'Olive Green']
        },
        {
            'name': 'Slim Fit Oxford Cotton Casual Shirt',
            'slug': 'slim-fit-oxford-cotton-casual-shirt',
            'brand': brand_objs['roadster'],
            'category': cat_clothing,
            'subcategory': sub_shirts,
            'price': Decimal('2499.00'),
            'discount_price': Decimal('1299.00'),
            'sku': 'SH-CHK-002',
            'short_description': 'Classic Oxford weave casual button-down shirt.',
            'description': 'Designed for versatile styling, this casual Oxford shirt transitions seamlessly from weekend hangouts to smart-casual office days.',
            'is_featured': True,
            'stock_quantity': 30,
            'images': [
                'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
                'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'
            ],
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Sky Blue', 'White']
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
            'short_description': 'Timeless dark indigo denim jeans with classic straight leg.',
            'description': 'The original blue jean since 1873. Features durable heavy denim with authentic copper rivets and subtle stretch for all-day comfort.',
            'is_featured': True,
            'stock_quantity': 25,
            'images': [
                'https://images.unsplash.com/photo-1542272604-780c36856842?w=800',
                'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800'
            ],
            'sizes': ['30', '32', '34', '36'],
            'colors': ['Dark Indigo', 'Washed Black']
        },
        {
            'name': 'Streetwear Fleece Pullover Hoodie',
            'slug': 'streetwear-fleece-pullover-hoodie',
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
            'images': [
                'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800',
                'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800'
            ],
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
            'short_description': 'Rich cotton silk ethnic kurta with neck embroidery.',
            'description': 'Embrace traditional elegance with this royal embroidered silk blend kurta. Paired effortlessly with churidars or denim.',
            'is_featured': True,
            'stock_quantity': 15,
            'images': [
                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
                'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800'
            ],
            'sizes': ['M', 'L', 'XL', 'XXL'],
            'colors': ['Royal Blue', 'Cream Silk']
        },
        {
            'name': 'Waterproof Insulated Puffer Winter Jacket',
            'slug': 'waterproof-insulated-puffer-winter-jacket',
            'brand': brand_objs['puma'],
            'category': cat_clothing,
            'subcategory': sub_hoodies,
            'price': Decimal('5999.00'),
            'discount_price': Decimal('3999.00'),
            'sku': 'JKT-PUM-006',
            'short_description': 'Windproof down insulated puffer jacket with detachable hood.',
            'description': 'Beat the winter cold with high-loft insulation and water-repellent shell material.',
            'is_featured': False,
            'stock_quantity': 18,
            'images': [
                'https://images.unsplash.com/photo-1544441893-675973e31985?w=800',
                'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'
            ],
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Matte Black', 'Navy Blue']
        },

        # Accessories
        {
            'name': 'Minimalist Quartz Chronograph Leather Watch',
            'slug': 'minimalist-quartz-chronograph-leather-watch',
            'brand': brand_objs['titan'],
            'category': cat_accessories,
            'subcategory': sub_watches,
            'price': Decimal('6995.00'),
            'discount_price': Decimal('4495.00'),
            'sku': 'WT-TTN-007',
            'short_description': 'Stainless steel quartz watch with genuine leather strap.',
            'description': 'Features a mineral glass crystal dial, 50m water resistance, and Japanese quartz movement for sophisticated timekeeping.',
            'is_featured': True,
            'stock_quantity': 12,
            'images': [
                'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800',
                'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=800'
            ],
            'sizes': ['Free Size'],
            'colors': ['Tan Brown / Silver Dial']
        },
        {
            'name': 'Premium Genuine Leather Bifold Wallet',
            'slug': 'premium-genuine-leather-bifold-wallet',
            'brand': brand_objs['roadster'],
            'category': cat_accessories,
            'subcategory': sub_wallets,
            'price': Decimal('1999.00'),
            'discount_price': Decimal('999.00'),
            'sku': 'WLT-RDS-008',
            'short_description': 'Full-grain RFID blocking leather wallet with coin pocket.',
            'description': 'Handcrafted from 100% genuine top-grain leather with dedicated card slots and RFID protection.',
            'is_featured': True,
            'stock_quantity': 35,
            'images': [
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
                'https://images.unsplash.com/photo-1606503825008-909a67e72390?w=800'
            ],
            'sizes': ['Standard'],
            'colors': ['Vintage Brown', 'Classic Black']
        },
        {
            'name': 'Classic Reversible Italian Leather Belt',
            'slug': 'classic-reversible-italian-leather-belt',
            'brand': brand_objs['allen-solly'],
            'category': cat_accessories,
            'subcategory': sub_wallets,
            'price': Decimal('2299.00'),
            'discount_price': Decimal('1199.00'),
            'sku': 'BLT-ALL-009',
            'short_description': 'Dual-sided black & tan leather belt with swivel metal buckle.',
            'description': 'Twist-buckle mechanism allows easy switching between formal black and casual tan leather sides.',
            'is_featured': False,
            'stock_quantity': 28,
            'images': [
                'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800',
                'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800'
            ],
            'sizes': ['32', '34', '36', '38'],
            'colors': ['Black & Tan Dual']
        },
        {
            'name': 'Aviator UV400 Polarized Sunglasses',
            'slug': 'aviator-uv400-polarized-sunglasses',
            'brand': brand_objs['ray-ban'],
            'category': cat_accessories,
            'subcategory': sub_sunglasses,
            'price': Decimal('5490.00'),
            'discount_price': Decimal('3490.00'),
            'sku': 'SUN-RAY-010',
            'short_description': 'Classic metal frame aviators with G-15 green polarized lenses.',
            'description': 'Protect your eyes with 100% UV400 anti-glare polarized lenses set in a lightweight metal frame.',
            'is_featured': True,
            'stock_quantity': 22,
            'images': [
                'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800',
                'https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'
            ],
            'sizes': ['Medium'],
            'colors': ['Gold Frame / Green Lens']
        },
        {
            'name': 'Urban Utility Canvas Laptop Backpack',
            'slug': 'urban-utility-canvas-laptop-backpack',
            'brand': brand_objs['wildcraft'],
            'category': cat_accessories,
            'subcategory': sub_bags,
            'price': Decimal('2999.00'),
            'discount_price': Decimal('1499.00'),
            'sku': 'BG-WLD-011',
            'short_description': '25L water-resistant backpack with padded 15.6" laptop compartment.',
            'description': 'Built for commuters and outdoor enthusiasts. Features rain cover and ergonomic back padding.',
            'is_featured': False,
            'stock_quantity': 40,
            'images': [
                'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800',
                'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800'
            ],
            'sizes': ['25 Liters'],
            'colors': ['Olive Drab', 'Charcoal Black']
        },
        {
            'name': 'Air Cushion Retro Running Sneakers',
            'slug': 'air-cushion-retro-running-sneakers',
            'brand': brand_objs['nike'],
            'category': cat_accessories,
            'subcategory': sub_shoes,
            'price': Decimal('8995.00'),
            'discount_price': Decimal('6495.00'),
            'sku': 'SNK-NKE-012',
            'short_description': 'Responsive running sneakers with breathable knit mesh upper.',
            'description': 'Delivers exceptional impact absorption and retro streetwear design for all-day comfort.',
            'is_featured': True,
            'stock_quantity': 18,
            'images': [
                'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800',
                'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800'
            ],
            'sizes': ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
            'colors': ['White / Cobalt Blue', 'Black / Metallic Grey']
        },
        {
            'name': 'Embroidered Cotton Athletic Cap',
            'slug': 'embroidered-cotton-athletic-cap',
            'brand': brand_objs['puma'],
            'category': cat_accessories,
            'subcategory': sub_caps,
            'price': Decimal('1299.00'),
            'discount_price': Decimal('699.00'),
            'sku': 'CAP-PUM-013',
            'short_description': 'Adjustable 6-panel cotton twill sports baseball cap.',
            'description': 'Features 3D embroidered logo, moisture-wicking sweatband, and adjustable metal strap closure.',
            'is_featured': False,
            'stock_quantity': 50,
            'images': [
                'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800',
                'https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?w=800'
            ],
            'sizes': ['Adjustable Free Size'],
            'colors': ['Navy Blue', 'Jet Black']
        },
        {
            'name': 'Minimalist Stainless Steel Chain Bracelet',
            'slug': 'minimalist-stainless-steel-chain-bracelet',
            'brand': brand_objs['urban-style'],
            'category': cat_accessories,
            'subcategory': sub_caps,
            'price': Decimal('1499.00'),
            'discount_price': Decimal('799.00'),
            'sku': 'JWL-URB-014',
            'short_description': 'Hypoallergenic Cuban link stainless steel bracelet.',
            'description': 'Tarnish-free 316L stainless steel chain link bracelet designed for daily wear.',
            'is_featured': False,
            'stock_quantity': 30,
            'images': [
                'https://images.unsplash.com/photo-1611591475777-233ca732222e?w=800',
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800'
            ],
            'sizes': ['8 Inches'],
            'colors': ['Polished Silver']
        }
    ]

    for p_data in products_data:
        images_list = p_data.pop('images')
        sizes = p_data.pop('sizes')
        colors = p_data.pop('colors')

        product, created = Product.objects.get_or_create(
            slug=p_data['slug'],
            defaults=p_data
        )

        # Update images and variants
        ProductImage.objects.filter(product=product).delete()
        for idx, img_url in enumerate(images_list):
            ProductImage.objects.create(
                product=product,
                image=img_url,
                is_primary=(idx == 0),
                display_order=idx
            )

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

    print("  [OK] Products, Gallery Images & Variants created")

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
