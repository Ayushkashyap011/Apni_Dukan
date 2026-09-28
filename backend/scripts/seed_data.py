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
    print("[*] Re-seeding APNI DUKAN database with perfectly matched product names and images...")

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

    # 2. Main Categories
    cat_clothing, _ = Category.objects.get_or_create(
        slug='clothing',
        defaults={'name': 'Clothing', 'description': 'Trending shirts, t-shirts, jeans, hoodies, jackets & kurtas'}
    )
    cat_watches, _ = Category.objects.get_or_create(
        slug='watches',
        defaults={'name': 'Watches', 'description': 'Luxury chronographs, minimalist quartz & smartwatches'}
    )
    cat_accessories, _ = Category.objects.get_or_create(
        slug='accessories',
        defaults={'name': 'Accessories', 'description': 'Wallets, belts, backpacks & travel duffle bags'}
    )
    cat_footwear, _ = Category.objects.get_or_create(
        slug='footwear',
        defaults={'name': 'Footwear', 'description': 'Sneakers, formal oxfords, loafers & sport shoes'}
    )
    cat_eyewear, _ = Category.objects.get_or_create(
        slug='eyewear',
        defaults={'name': 'Eyewear & Sunglasses', 'description': 'Aviators, wayfarers, clubmasters & sport shield sunglasses'}
    )

    # Subcategories
    sub_tshirts, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='t-shirts', defaults={'name': 'T-Shirts'})
    sub_shirts, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='shirts', defaults={'name': 'Shirts'})
    sub_jeans, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='jeans', defaults={'name': 'Jeans'})
    sub_hoodies, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='hoodies', defaults={'name': 'Hoodies & Jackets'})
    sub_kurtas, _ = Subcategory.objects.get_or_create(category=cat_clothing, slug='kurtas', defaults={'name': 'Kurtas & Ethnic'})

    sub_chronograph, _ = Subcategory.objects.get_or_create(category=cat_watches, slug='chronograph', defaults={'name': 'Chronograph Watches'})
    sub_smartwatches, _ = Subcategory.objects.get_or_create(category=cat_watches, slug='smartwatches', defaults={'name': 'Smartwatches'})
    sub_minimalist, _ = Subcategory.objects.get_or_create(category=cat_watches, slug='minimalist-watches', defaults={'name': 'Minimalist Watches'})

    sub_wallets, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='wallets', defaults={'name': 'Wallets & Cardholders'})
    sub_belts, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='belts', defaults={'name': 'Leather Belts'})
    sub_bags, _ = Subcategory.objects.get_or_create(category=cat_accessories, slug='bags', defaults={'name': 'Backpacks & Duffles'})

    sub_sneakers, _ = Subcategory.objects.get_or_create(category=cat_footwear, slug='sneakers', defaults={'name': 'Sneakers'})
    sub_formals, _ = Subcategory.objects.get_or_create(category=cat_footwear, slug='formals', defaults={'name': 'Formal & Oxfords'})
    sub_loafers, _ = Subcategory.objects.get_or_create(category=cat_footwear, slug='loafers', defaults={'name': 'Casual Loafers'})

    sub_aviators, _ = Subcategory.objects.get_or_create(category=cat_eyewear, slug='aviators', defaults={'name': 'Aviators'})
    sub_wayfarers, _ = Subcategory.objects.get_or_create(category=cat_eyewear, slug='wayfarers', defaults={'name': 'Wayfarers'})

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
        ('Fossil', 'fossil'),
        ('Adidas', 'adidas'),
    ]
    brand_objs = {}
    for name, slug in brands_data:
        b, _ = Brand.objects.get_or_create(slug=slug, defaults={'name': name})
        brand_objs[slug] = b

    # 4. Products Data - 28 Products with ACCURATE 1-to-1 matched Unsplash images
    Product.objects.all().delete()
    products_data = [
        # DOMAIN 1: CLOTHING (8 items)
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
            'images': ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
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
            'images': ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800'],
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
            'images': ['https://images.unsplash.com/photo-1542272604-780c36856842?w=800'],
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
            'description': 'Stay warm in bold urban style with this fleece lined pullover hoodie.',
            'is_featured': True,
            'stock_quantity': 20,
            'images': ['https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800'],
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
            'description': 'Embrace traditional elegance with this royal embroidered silk blend ethnic kurta.',
            'is_featured': True,
            'stock_quantity': 15,
            'images': ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800'],
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
            'images': ['https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800'],
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Matte Black', 'Navy Blue']
        },
        {
            'name': 'Vintage Trucker Denim Jacket',
            'slug': 'vintage-trucker-denim-jacket',
            'brand': brand_objs['levis'],
            'category': cat_clothing,
            'subcategory': sub_hoodies,
            'price': Decimal('4499.00'),
            'discount_price': Decimal('2999.00'),
            'sku': 'JKT-LEV-007',
            'short_description': 'Rugged vintage washed blue denim trucker jacket.',
            'description': 'A staple jacket with chest flap pockets, button closures, and timeless rugged appeal.',
            'is_featured': False,
            'stock_quantity': 22,
            'images': ['https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=800'],
            'sizes': ['M', 'L', 'XL'],
            'colors': ['Washed Blue']
        },
        {
            'name': 'Slim Fit Stretch Chino Trousers',
            'slug': 'slim-fit-stretch-chino-trousers',
            'brand': brand_objs['allen-solly'],
            'category': cat_clothing,
            'subcategory': sub_jeans,
            'price': Decimal('2799.00'),
            'discount_price': Decimal('1699.00'),
            'sku': 'TR-ALL-008',
            'short_description': 'Tailored stretch cotton chinos for formal & smart casual wear.',
            'description': 'Features flat front styling, slant pockets, and comfortable flex cotton fabric.',
            'is_featured': False,
            'stock_quantity': 35,
            'images': ['https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800'],
            'sizes': ['30', '32', '34', '36'],
            'colors': ['Beige', 'Navy Blue']
        },

        # DOMAIN 2: WATCHES (5 items)
        {
            'name': 'Minimalist Quartz Leather Chronograph Watch',
            'slug': 'minimalist-quartz-chronograph-leather-watch',
            'brand': brand_objs['titan'],
            'category': cat_watches,
            'subcategory': sub_chronograph,
            'price': Decimal('6995.00'),
            'discount_price': Decimal('4495.00'),
            'sku': 'WT-TTN-001',
            'short_description': 'Stainless steel quartz watch with genuine leather strap.',
            'description': 'Features a mineral glass crystal dial, 50m water resistance, and Japanese quartz movement.',
            'is_featured': True,
            'stock_quantity': 12,
            'images': ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Tan Brown / Silver Dial']
        },
        {
            'name': 'Titan Smartwatch Pro AMOLED Display',
            'slug': 'titan-smartwatch-pro-amoled-display',
            'brand': brand_objs['titan'],
            'category': cat_watches,
            'subcategory': sub_smartwatches,
            'price': Decimal('8999.00'),
            'discount_price': Decimal('5999.00'),
            'sku': 'WT-SMT-002',
            'short_description': '1.43 inch AMOLED display with Bluetooth calling & SpO2 tracking.',
            'description': 'Advanced health monitoring, 100+ sports modes, aluminum alloy bezel, and 7-day battery life.',
            'is_featured': True,
            'stock_quantity': 25,
            'images': ['https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Midnight Black', 'Space Grey']
        },
        {
            'name': 'Classic White Dial Minimalist Mesh Watch',
            'slug': 'classic-white-dial-minimalist-mesh-watch',
            'brand': brand_objs['fossil'],
            'category': cat_watches,
            'subcategory': sub_minimalist,
            'price': Decimal('5495.00'),
            'discount_price': Decimal('3795.00'),
            'sku': 'WT-FOS-003',
            'short_description': 'Ultra-thin stainless steel mesh watch with sapphire crystal glass.',
            'description': 'Sleek Scandinavian design featuring scratch-resistant sapphire glass and quick-release mesh band.',
            'is_featured': True,
            'stock_quantity': 18,
            'images': ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Silver Mesh', 'Black Stainless']
        },
        {
            'name': 'Executive Stainless Steel Sports Chronometer',
            'slug': 'executive-stainless-steel-sports-chronometer',
            'brand': brand_objs['fossil'],
            'category': cat_watches,
            'subcategory': sub_chronograph,
            'price': Decimal('11995.00'),
            'discount_price': Decimal('7995.00'),
            'sku': 'WT-FOS-004',
            'short_description': '100m water resistant chronograph with tachymeter bezel.',
            'description': 'Precision sports timekeeper with date window, luminous hands, and solid stainless steel bracelet.',
            'is_featured': False,
            'stock_quantity': 14,
            'images': ['https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Steel Silver / Navy Dial']
        },
        {
            'name': 'Rose Gold Elegant Crystal Women Dress Watch',
            'slug': 'rose-gold-elegant-crystal-women-dress-watch',
            'brand': brand_objs['titan'],
            'category': cat_watches,
            'subcategory': sub_minimalist,
            'price': Decimal('7495.00'),
            'discount_price': Decimal('4995.00'),
            'sku': 'WT-TTN-005',
            'short_description': 'Rose gold plated watch studded with Swarovski crystal accents.',
            'description': 'Exquisite formal watch for women with mother-of-pearl dial and jewelry clasp mechanism.',
            'is_featured': False,
            'stock_quantity': 16,
            'images': ['https://images.unsplash.com/photo-1539185441755-769473a23570?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Rose Gold']
        },

        # DOMAIN 3: ACCESSORIES & WALLETS (5 items)
        {
            'name': 'Premium Genuine Leather Bifold Wallet',
            'slug': 'premium-genuine-leather-bifold-wallet',
            'brand': brand_objs['roadster'],
            'category': cat_accessories,
            'subcategory': sub_wallets,
            'price': Decimal('1999.00'),
            'discount_price': Decimal('999.00'),
            'sku': 'WLT-RDS-001',
            'short_description': 'Full-grain RFID blocking leather wallet with coin pocket.',
            'description': 'Handcrafted from 100% genuine top-grain leather with dedicated card slots and RFID protection.',
            'is_featured': True,
            'stock_quantity': 35,
            'images': ['https://images.unsplash.com/photo-1627123424574-724758594e93?w=800'],
            'sizes': ['Standard'],
            'colors': ['Vintage Brown', 'Classic Black']
        },
        {
            'name': 'Classic Reversible Italian Leather Belt',
            'slug': 'classic-reversible-italian-leather-belt',
            'brand': brand_objs['allen-solly'],
            'category': cat_accessories,
            'subcategory': sub_belts,
            'price': Decimal('2299.00'),
            'discount_price': Decimal('1199.00'),
            'sku': 'BLT-ALL-002',
            'short_description': 'Dual-sided black & tan leather belt with swivel metal buckle.',
            'description': 'Twist-buckle mechanism allows easy switching between formal black and casual tan leather sides.',
            'is_featured': False,
            'stock_quantity': 28,
            'images': ['https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800'],
            'sizes': ['32', '34', '36', '38'],
            'colors': ['Black & Tan Dual']
        },
        {
            'name': 'Urban Utility Canvas Laptop Backpack',
            'slug': 'urban-utility-canvas-laptop-backpack',
            'brand': brand_objs['wildcraft'],
            'category': cat_accessories,
            'subcategory': sub_bags,
            'price': Decimal('2999.00'),
            'discount_price': Decimal('1499.00'),
            'sku': 'BG-WLD-003',
            'short_description': '25L water-resistant backpack with padded 15.6" laptop compartment.',
            'description': 'Built for commuters and outdoor enthusiasts. Features rain cover and ergonomic back padding.',
            'is_featured': True,
            'stock_quantity': 40,
            'images': ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800'],
            'sizes': ['25 Liters'],
            'colors': ['Olive Drab', 'Charcoal Black']
        },
        {
            'name': 'Vintage Leather Travel Duffle Bag',
            'slug': 'vintage-leather-travel-duffle-bag',
            'brand': brand_objs['roadster'],
            'category': cat_accessories,
            'subcategory': sub_bags,
            'price': Decimal('6999.00'),
            'discount_price': Decimal('4499.00'),
            'sku': 'BG-RDS-004',
            'short_description': 'Spacious 45L handcrafted leather weekender duffle bag.',
            'description': 'Perfect for short trips and gym sessions. Made of heavy duty full-grain leather with padded shoulder strap.',
            'is_featured': False,
            'stock_quantity': 15,
            'images': ['https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800'],
            'sizes': ['45 Liters'],
            'colors': ['Tan Brown']
        },
        {
            'name': 'RFID Blocking Slim Metal & Leather Cardholder',
            'slug': 'rfid-blocking-slim-metal-leather-cardholder',
            'brand': brand_objs['urban-style'],
            'category': cat_accessories,
            'subcategory': sub_wallets,
            'price': Decimal('1499.00'),
            'discount_price': Decimal('799.00'),
            'sku': 'WLT-URB-005',
            'short_description': 'Pop-up aluminum credit card ejector case wrapped in leather.',
            'description': 'Holds up to 6 cards with instant quick-eject lever mechanism and money clip.',
            'is_featured': False,
            'stock_quantity': 50,
            'images': ['https://images.unsplash.com/photo-1606503825008-909a67e72390?w=800'],
            'sizes': ['Slim'],
            'colors': ['Matte Black', 'Carbon Fiber']
        },

        # DOMAIN 4: FOOTWEAR (5 items)
        {
            'name': 'Air Cushion Retro Running Sneakers',
            'slug': 'air-cushion-retro-running-sneakers',
            'brand': brand_objs['nike'],
            'category': cat_footwear,
            'subcategory': sub_sneakers,
            'price': Decimal('8995.00'),
            'discount_price': Decimal('6495.00'),
            'sku': 'SNK-NKE-001',
            'short_description': 'Responsive running sneakers with breathable knit mesh upper.',
            'description': 'Delivers exceptional impact absorption and retro streetwear design for all-day comfort.',
            'is_featured': True,
            'stock_quantity': 18,
            'images': ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'],
            'sizes': ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
            'colors': ['Red / Black', 'White / Grey']
        },
        {
            'name': 'Handcrafted Leather Oxford Formal Shoes',
            'slug': 'handcrafted-leather-oxford-formal-shoes',
            'brand': brand_objs['allen-solly'],
            'category': cat_footwear,
            'subcategory': sub_formals,
            'price': Decimal('5999.00'),
            'discount_price': Decimal('3999.00'),
            'sku': 'SH-ALL-002',
            'short_description': '100% genuine leather formal oxford shoes with cushioned footbed.',
            'description': 'Polished cap-toe formal oxfords built for business meetings, weddings, and formal occasions.',
            'is_featured': True,
            'stock_quantity': 20,
            'images': ['https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800'],
            'sizes': ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
            'colors': ['Cognac Brown', 'Classic Black']
        },
        {
            'name': 'Casual Genuine Suede Leather Loafers',
            'slug': 'casual-genuine-suede-leather-loafers',
            'brand': brand_objs['roadster'],
            'category': cat_footwear,
            'subcategory': sub_loafers,
            'price': Decimal('3999.00'),
            'discount_price': Decimal('2499.00'),
            'sku': 'SH-RDS-003',
            'short_description': 'Slip-on suede loafers with flexible TPR rubber driver sole.',
            'description': 'Ultra-lightweight loafers for effortless everyday smart-casual styling.',
            'is_featured': False,
            'stock_quantity': 25,
            'images': ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800'],
            'sizes': ['UK 8', 'UK 9', 'UK 10'],
            'colors': ['Navy Suede', 'Tan Suede']
        },
        {
            'name': 'High-Top Canvas Streetwear Sneakers',
            'slug': 'high-top-canvas-streetwear-sneakers',
            'brand': brand_objs['puma'],
            'category': cat_footwear,
            'subcategory': sub_sneakers,
            'price': Decimal('4499.00'),
            'discount_price': Decimal('2799.00'),
            'sku': 'SNK-PUM-004',
            'short_description': 'Durable canvas high-top sneakers with vulcanized rubber sole.',
            'description': 'Classic high-top silhouette with rubber toe cap and side brand patch.',
            'is_featured': False,
            'stock_quantity': 30,
            'images': ['https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800'],
            'sizes': ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
            'colors': ['Off-White Canvas', 'Black']
        },
        {
            'name': 'Performance Cushion Sport Running Shoes',
            'slug': 'performance-cushion-sport-running-shoes',
            'brand': brand_objs['adidas'],
            'category': cat_footwear,
            'subcategory': sub_sneakers,
            'price': Decimal('7999.00'),
            'discount_price': Decimal('5299.00'),
            'sku': 'SNK-ADI-005',
            'short_description': 'Boost midsole running shoes for endurance & marathon training.',
            'description': 'Features energizing cushioning return and durable Continental rubber outsole.',
            'is_featured': False,
            'stock_quantity': 22,
            'images': ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'],
            'sizes': ['UK 8', 'UK 9', 'UK 10'],
            'colors': ['Multicolor Sport']
        },

        # DOMAIN 5: EYEWEAR & SUNGLASSES (5 items)
        {
            'name': 'Aviator UV400 Polarized Metal Sunglasses',
            'slug': 'aviator-uv400-polarized-metal-sunglasses',
            'brand': brand_objs['ray-ban'],
            'category': cat_eyewear,
            'subcategory': sub_aviators,
            'price': Decimal('5490.00'),
            'discount_price': Decimal('3490.00'),
            'sku': 'SUN-RAY-001',
            'short_description': 'Classic metal frame aviators with G-15 green polarized lenses.',
            'description': 'Protect your eyes with 100% UV400 anti-glare polarized lenses set in a lightweight metal frame.',
            'is_featured': True,
            'stock_quantity': 22,
            'images': ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800'],
            'sizes': ['Medium'],
            'colors': ['Gold Frame / Green Lens']
        },
        {
            'name': 'Classic Matte Black Wayfarer Sunglasses',
            'slug': 'classic-matte-black-wayfarer-sunglasses',
            'brand': brand_objs['ray-ban'],
            'category': cat_eyewear,
            'subcategory': sub_wayfarers,
            'price': Decimal('4990.00'),
            'discount_price': Decimal('3190.00'),
            'sku': 'SUN-RAY-002',
            'short_description': 'Iconic wayfarer shape with acetate frame & polarized gray lenses.',
            'description': 'The standard of coolness since 1952. Durable acetate frame with scratch resistant lenses.',
            'is_featured': True,
            'stock_quantity': 28,
            'images': ['https://images.unsplash.com/photo-1508296695146-257a814070b4?w=800'],
            'sizes': ['Medium'],
            'colors': ['Matte Black / Dark Grey Lens']
        },
        {
            'name': 'Retro Clubmaster Vintage Semi-Rimless Sunglasses',
            'slug': 'retro-clubmaster-vintage-semi-rimless-sunglasses',
            'brand': brand_objs['ray-ban'],
            'category': cat_eyewear,
            'subcategory': sub_wayfarers,
            'price': Decimal('5990.00'),
            'discount_price': Decimal('3890.00'),
            'sku': 'SUN-RAY-003',
            'short_description': 'Intellectual retro browline frame with gold metal accents.',
            'description': 'Inspired by 1950s style, featuring browline acetate upper and sleek lower metal wire rim.',
            'is_featured': False,
            'stock_quantity': 16,
            'images': ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800'],
            'sizes': ['Standard'],
            'colors': ['Tortoise Shell / Gold']
        },
        {
            'name': 'Geometric Gold Wire Frame Clear Tint Glasses',
            'slug': 'geometric-gold-wire-frame-clear-tint-glasses',
            'brand': brand_objs['urban-style'],
            'category': cat_eyewear,
            'subcategory': sub_aviators,
            'price': Decimal('2499.00'),
            'discount_price': Decimal('1299.00'),
            'sku': 'SUN-URB-004',
            'short_description': 'Blue light blocking clear lens optical glasses with gold frame.',
            'description': 'Protects eyes from digital screen fatigue while giving a trendy hipster aesthetic.',
            'is_featured': False,
            'stock_quantity': 35,
            'images': ['https://images.unsplash.com/photo-1577803645773-f96470509666?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Polished Gold']
        },
        {
            'name': 'Polarized Sport Shield Wrap-Around Sunglasses',
            'slug': 'polarized-sport-shield-wrap-around-sunglasses',
            'brand': brand_objs['nike'],
            'category': cat_eyewear,
            'subcategory': sub_aviators,
            'price': Decimal('3999.00'),
            'discount_price': Decimal('2299.00'),
            'sku': 'SUN-NKE-005',
            'short_description': 'Windproof wrap-around shield sunglasses for cycling & athletics.',
            'description': 'Features rubberized nose pads and rimless shield lens for max field of vision.',
            'is_featured': False,
            'stock_quantity': 20,
            'images': ['https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800'],
            'sizes': ['Free Size'],
            'colors': ['Mirror Red / Black Frame']
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

        # Update product fields if product already exists
        if not created:
            for k, v in p_data.items():
                setattr(product, k, v)
            product.save()

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

    print("  [OK] 28 Products re-seeded with 100% accurate visual image matches!")

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

    print("[DONE] Database re-seeding completed successfully!")

if __name__ == '__main__':
    seed()
