"""Seed script - run with: python manage.py shell < seed_dukan.py"""
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from django.contrib.auth import get_user_model
from crm.models import CustomerRecord, SellerRecord, Ticket, Notification
from products.models import Category, Brand, Inventory, Product, ProductImage
from sellers.models import SellerProfile, Store
from users.models import Address, CustomerProfile

User = get_user_model()

admin = User.objects.filter(username="admin").first() or User.objects.filter(email="admin@dukan.local").first()
if admin:
    changed = False
    if admin.email != "admin@dukan.local":
        admin.email = "admin@dukan.local"
        changed = True
    if not admin.is_staff or not admin.is_superuser:
        admin.is_staff = True
        admin.is_superuser = True
        changed = True
    if changed:
        admin.save(update_fields=["email", "is_staff", "is_superuser"])
    print("Superuser ready: admin@dukan.local / existing password")
else:
    User.objects.create_superuser("admin", "admin@dukan.local", "admin")
    print("Superuser created: admin@dukan.local / admin")

User.objects.filter(email="admin@dukan.local").update(role="admin")

customer, _ = User.objects.update_or_create(
    email="customer@dukan.local",
    defaults={
        "username": "customer@dukan.local",
        "first_name": "Demo",
        "last_name": "Customer",
        "role": "customer",
        "is_active": True,
    },
)
customer.set_password("customer123")
customer.save()
CustomerProfile.objects.update_or_create(user=customer, defaults={"full_name": "Demo Customer"})
CustomerRecord.objects.update_or_create(user=customer, defaults={"source": "seed", "status": "active", "score": 25})
Address.objects.update_or_create(
    user=customer,
    label="Home",
    defaults={
        "full_name": "Demo Customer",
        "phone": "9800000000",
        "line1": "Lazimpat",
        "city": "Kathmandu",
        "country": "Nepal",
        "is_default": True,
    },
)

seller_user, _ = User.objects.update_or_create(
    email="seller@dukan.local",
    defaults={
        "username": "seller@dukan.local",
        "first_name": "Demo",
        "last_name": "Seller",
        "role": "seller",
        "is_active": True,
    },
)
seller_user.set_password("seller123")
seller_user.save()
seller_profile, _ = SellerProfile.objects.update_or_create(
    user=seller_user,
    defaults={"business_name": "Dukan Demo Store", "phone": "9811111111", "status": "verified"},
)
demo_store, _ = Store.objects.update_or_create(
    seller=seller_profile,
    defaults={
        "name": "Dukan Demo Store",
        "description": "General marketplace seller with demo products.",
        "support_email": "seller@dukan.local",
        "support_phone": "9811111111",
        "is_active": True,
    },
)
SellerRecord.objects.update_or_create(seller=seller_profile, defaults={"status": "verified", "risk_level": "normal"})
Ticket.objects.get_or_create(
    customer=customer,
    seller=seller_profile,
    subject="Demo delivery question",
    defaults={"description": "Customer asked about delivery timeline.", "priority": "medium"},
)
Notification.objects.get_or_create(
    user=seller_user,
    title="New seller dashboard ready",
    defaults={"notification_type": "status", "body": "Your demo store has CRM and product tools enabled."},
)
print("Demo accounts ready: customer@dukan.local/customer123, seller@dukan.local/seller123, admin@dukan.local/admin")

category_rows = [
    ("Mobiles", "Phones, chargers, cases, and wearable tech"),
    ("Laptops", "Work, school, creator, and gaming machines"),
    ("Accessories", "Keyboards, storage, chargers, hubs, and desk gear"),
    ("Audio", "Earbuds, headphones, speakers, and sound gear"),
    ("Fashion", "Everyday wear, sneakers, bags, and accessories"),
    ("Home", "Kitchen, room, cleaning, and living essentials"),
    ("Beauty", "Skin care, grooming, and personal care"),
    ("Groceries", "Daily household food and pantry items"),
    ("Gaming", "Consoles, peripherals, and setup gear"),
    ("Networking", "Routers, mesh WiFi, switches, and connectivity gear"),
    ("Appliances", "Useful electronics for home and hostel rooms"),
    ("Sports", "Fitness, outdoor, and training products"),
    ("Books", "Study, fiction, business, and stationery"),
]

cats = {}
for order, (name, description) in enumerate(category_rows):
    category, _ = Category.objects.update_or_create(
        name=name,
        defaults={"description": description, "order": order},
    )
    cats[name] = category
print(f"{len(cats)} categories ready")

Category.objects.filter(name="Smartphones").delete()

brand_names = [
    "Apple", "Samsung", "Dell", "Lenovo", "Sony", "Razer", "Logitech",
    "Xiaomi", "HP", "Ubiquiti", "TP-Link", "Corsair", "Anker", "SanDisk",
    "Keychron", "CalDigit", "Nike", "Puma", "The Ordinary", "CG", "Philips",
    "Goldstar", "Bhat-Bhateni", "Penguin", "Himalayan Java", "Dukan Basics",
]

brands = {}
for name in brand_names:
    brand, _ = Brand.objects.get_or_create(name=name)
    brands[name] = brand
print(f"{len(brands)} brands ready")

products_data = [
    {
        "name": "iPhone 16 Pro Max",
        "category": "Mobiles",
        "brand": "Apple",
        "price": 199999,
        "discount_price": 189999,
        "stock": 14,
        "rating": 4.8,
        "tag": "Hot",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
        "description": "A18 Pro, titanium body, 48MP camera system, and excellent battery life.",
        "specifications": "Storage: 256GB\nDisplay: 6.9 inch Super Retina XDR\nWarranty: 1 year\nDelivery: Kathmandu valley 1-2 days",
    },
    {
        "name": "Samsung Galaxy S25 Ultra",
        "category": "Mobiles",
        "brand": "Samsung",
        "price": 164999,
        "discount_price": 154999,
        "stock": 18,
        "rating": 4.7,
        "tag": "Deal",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
        "description": "Flagship Android phone with bright AMOLED display, S Pen, and pro cameras.",
        "specifications": "Storage: 256GB\nRAM: 12GB\nCamera: 200MP main\nPayment: Cash on Delivery available",
    },
    {
        "name": "MacBook Air M3",
        "category": "Laptops",
        "brand": "Apple",
        "price": 189999,
        "discount_price": 174999,
        "stock": 10,
        "rating": 4.9,
        "tag": "Featured",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
        "description": "Thin, silent, fast laptop for school, work, and travel.",
        "specifications": "Processor: Apple M3\nRAM: 16GB\nStorage: 512GB SSD\nBattery: Up to 18 hours",
    },
    {
        "name": "Dell XPS 15 Creator",
        "category": "Laptops",
        "brand": "Dell",
        "price": 175999,
        "discount_price": 159999,
        "stock": 7,
        "rating": 4.6,
        "tag": "Creator",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
        "description": "OLED laptop with strong performance for design, editing, and coding.",
        "specifications": "Processor: Intel Core i7\nRAM: 16GB\nGPU: RTX 4050\nDisplay: 15.6 inch OLED",
    },
    {
        "name": "Lenovo IdeaPad Slim 5",
        "category": "Laptops",
        "brand": "Lenovo",
        "price": 92999,
        "discount_price": 84999,
        "stock": 21,
        "rating": 4.4,
        "tag": "Student",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&w=900&q=80",
        "description": "Good daily laptop for college, office, browsing, and light creative work.",
        "specifications": "Processor: Ryzen 7\nRAM: 16GB\nStorage: 512GB SSD\nWeight: 1.46 kg",
    },
    {
        "name": "Nike Court Vision Low",
        "category": "Fashion",
        "brand": "Nike",
        "price": 10499,
        "discount_price": 8999,
        "stock": 34,
        "rating": 4.5,
        "tag": "New",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
        "description": "Clean low-top sneakers for daily wear.",
        "specifications": "Material: Synthetic leather\nSizes: 39-44\nColor: White\nReturn: 7 days",
    },
    {
        "name": "Puma Everyday Hoodie",
        "category": "Fashion",
        "brand": "Puma",
        "price": 5999,
        "discount_price": 4499,
        "stock": 40,
        "rating": 4.3,
        "tag": "Sale",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=80",
        "description": "Soft fleece hoodie for winter mornings and casual days.",
        "specifications": "Fit: Regular\nFabric: Cotton blend\nSizes: S-XL\nWash: Machine washable",
    },
    {
        "name": "Goldstar Classic Sneakers",
        "category": "Fashion",
        "brand": "Goldstar",
        "price": 2199,
        "discount_price": 1899,
        "stock": 65,
        "rating": 4.2,
        "tag": "Local",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80",
        "description": "Affordable Nepali everyday sneakers with solid grip.",
        "specifications": "Origin: Nepal\nSizes: 38-44\nUse: Daily wear\nReturn: 7 days",
    },
    {
        "name": "Philips Air Fryer 4.1L",
        "category": "Home",
        "brand": "Philips",
        "price": 24999,
        "discount_price": 21499,
        "stock": 19,
        "rating": 4.6,
        "tag": "Kitchen",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80",
        "description": "Compact air fryer for fast snacks and low-oil cooking.",
        "specifications": "Capacity: 4.1L\nPower: 1400W\nWarranty: 1 year\nUse: Kitchen",
    },
    {
        "name": "Dukan Basics Cotton Bedsheet",
        "category": "Home",
        "brand": "Dukan Basics",
        "price": 2499,
        "discount_price": 1999,
        "stock": 55,
        "rating": 4.1,
        "tag": "Home",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=900&q=80",
        "description": "Soft double-bed cotton bedsheet with pillow covers.",
        "specifications": "Size: Double\nMaterial: Cotton\nIncludes: 2 pillow covers\nWash: Machine washable",
    },
    {
        "name": "The Ordinary Niacinamide 10%",
        "category": "Beauty",
        "brand": "The Ordinary",
        "price": 2499,
        "discount_price": 2199,
        "stock": 42,
        "rating": 4.5,
        "tag": "Beauty",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80",
        "description": "Daily serum for oil control and smoother-looking skin.",
        "specifications": "Volume: 30ml\nSkin type: Oily and combination\nUse: Daily\nAuthenticity: Verified stock",
    },
    {
        "name": "Philips Beard Trimmer",
        "category": "Beauty",
        "brand": "Philips",
        "price": 4999,
        "discount_price": 3999,
        "stock": 36,
        "rating": 4.4,
        "tag": "Grooming",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=900&q=80",
        "description": "Cordless trimmer with multiple length settings.",
        "specifications": "Battery: 60 minutes\nSettings: 20 lengths\nWarranty: 1 year\nCharging: USB",
    },
    {
        "name": "Bhat-Bhateni Basmati Rice 5kg",
        "category": "Groceries",
        "brand": "Bhat-Bhateni",
        "price": 1199,
        "discount_price": 1099,
        "stock": 120,
        "rating": 4.3,
        "tag": "Daily",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=80",
        "description": "Long grain basmati rice for daily meals.",
        "specifications": "Weight: 5kg\nType: Basmati\nDelivery: Same-day in selected areas\nPayment: COD",
    },
    {
        "name": "Himalayan Java Coffee Beans",
        "category": "Groceries",
        "brand": "Himalayan Java",
        "price": 899,
        "discount_price": 799,
        "stock": 80,
        "rating": 4.7,
        "tag": "Fresh",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=80",
        "description": "Roasted coffee beans for home brewing.",
        "specifications": "Weight: 250g\nRoast: Medium\nOrigin: Nepal\nUse: Espresso or filter",
    },
    {
        "name": "Razer DeathAdder V3",
        "category": "Gaming",
        "brand": "Razer",
        "price": 8999,
        "discount_price": 7499,
        "stock": 28,
        "rating": 4.6,
        "tag": "Esports",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=900&q=80",
        "description": "Lightweight gaming mouse with fast optical switches.",
        "specifications": "Sensor: 30K DPI\nWeight: 63g\nConnection: Wired\nWarranty: 1 year",
    },
    {
        "name": "Logitech G435 Wireless Headset",
        "category": "Gaming",
        "brand": "Logitech",
        "price": 10999,
        "discount_price": 9299,
        "stock": 24,
        "rating": 4.4,
        "tag": "Audio",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=900&q=80",
        "description": "Light wireless headset for PC, console, and phone gaming.",
        "specifications": "Connection: Bluetooth and Lightspeed\nBattery: 18 hours\nWeight: 165g\nMic: Dual beamforming",
    },
    {
        "name": "Dell XPS 15",
        "category": "Laptops",
        "brand": "Dell",
        "price": 175999,
        "discount_price": 159999,
        "stock": 8,
        "rating": 4.6,
        "tag": "Creator",
        "is_featured": True,
        "image_url": "/product-media/dell_xps_15.png",
        "description": "Stunning InfinityEdge display in a compact design. Perfect for creators and professionals.",
        "specifications": "Processor: Intel Core i7-13700H\nRAM: 16GB DDR5\nStorage: 512GB NVMe SSD\nDisplay: 15.6 inch OLED 3.5K\nGPU: NVIDIA RTX 4050\nWeight: 1.86 kg",
    },
    {
        "name": "AirPods Pro 3",
        "category": "Audio",
        "brand": "Apple",
        "price": 34999,
        "discount_price": 31999,
        "stock": 50,
        "rating": 4.7,
        "tag": "ANC",
        "is_featured": True,
        "image_url": "/product-media/airpods_pro_3.png",
        "description": "Active Noise Cancellation, Adaptive Transparency, and Personalized Spatial Audio with head tracking.",
        "specifications": "Driver: Custom high-excursion\nANC: Active Noise Cancellation\nBattery: 6 hours, 30 with case\nConnectivity: Bluetooth 5.3\nWater Resistance: IPX4",
    },
    {
        "name": "Sony WH-1000XM6",
        "category": "Audio",
        "brand": "Sony",
        "price": 44999,
        "discount_price": 39999,
        "stock": 25,
        "rating": 4.8,
        "tag": "Premium",
        "is_featured": True,
        "image_url": "/product-media/sony_wh1000xm6.png",
        "description": "Industry-leading noise cancellation with exceptional sound quality and long battery life.",
        "specifications": "Driver: 40mm\nANC: Adaptive\nBattery: 40 hours\nCodecs: LDAC, AAC, SBC\nWeight: 252g\nFolding: Yes",
    },
    {
        "name": "Xiaomi Pad 7 Pro",
        "category": "Accessories",
        "brand": "Xiaomi",
        "price": 42999,
        "discount_price": 38999,
        "stock": 12,
        "rating": 4.5,
        "tag": "Tablet",
        "is_featured": False,
        "image_url": "/product-media/tablet.jpg",
        "description": "Premium tablet with a bright 11.2 inch 144Hz display, Snapdragon chip, and massive battery.",
        "specifications": "Display: 11.2 inch IPS 144Hz\nProcessor: Snapdragon 8s Gen 3\nRAM: 8GB\nStorage: 256GB\nBattery: 10000mAh\nCharging: 67W",
    },
    {
        "name": "Logitech MX Mechanical",
        "category": "Accessories",
        "brand": "Logitech",
        "price": 19999,
        "discount_price": 17999,
        "stock": 18,
        "rating": 4.5,
        "tag": "Keyboard",
        "is_featured": False,
        "image_url": "/product-media/keyboard.jpg",
        "description": "Wireless mechanical keyboard with smart backlighting and multi-device connectivity.",
        "specifications": "Switches: Tactile Quiet\nBacklight: Smart Illumination\nBattery: Up to 15 months\nConnectivity: Bluetooth + USB Receiver\nLayout: Full Size",
    },
    {
        "name": "HP Pavilion Gaming Desktop",
        "category": "Gaming",
        "brand": "HP",
        "price": 125999,
        "discount_price": 109999,
        "stock": 5,
        "rating": 4.4,
        "tag": "Desktop",
        "is_featured": True,
        "image_url": "/product-media/desktop.jpg",
        "description": "Powerful gaming desktop with RTX graphics for modern games and creative workloads.",
        "specifications": "Processor: AMD Ryzen 7 7700X\nGPU: NVIDIA RTX 4060 8GB\nRAM: 16GB DDR5\nStorage: 1TB NVMe SSD\nPSU: 500W\nOS: Windows 11",
    },
    {
        "name": "Samsung T7 Shield SSD 2TB",
        "category": "Accessories",
        "brand": "Samsung",
        "price": 16999,
        "discount_price": 14999,
        "stock": 40,
        "rating": 4.6,
        "tag": "Storage",
        "is_featured": False,
        "image_url": "/product-media/samsung-t7-shield-ssd-2tb_accurate.jpg",
        "description": "Portable SSD with rugged design and USB 3.2 Gen 2 speeds up to 1,050MB/s.",
        "specifications": "Capacity: 2TB\nInterface: USB 3.2 Gen 2\nRead Speed: 1050 MB/s\nWrite Speed: 1000 MB/s\nDurability: IP65, 3m drop\nWeight: 98g",
    },
    {
        "name": "Xiaomi Smart Band 9",
        "category": "Accessories",
        "brand": "Xiaomi",
        "price": 3999,
        "discount_price": 3499,
        "stock": 100,
        "rating": 4.4,
        "tag": "Wearable",
        "is_featured": False,
        "image_url": "/product-media/band.jpg",
        "description": "AMOLED fitness band with sport modes, SpO2 monitoring, and long battery life.",
        "specifications": "Display: 1.62 inch AMOLED\nBattery: 21 days\nWater Resistance: 5ATM\nSensors: Heart Rate, SpO2, Accelerometer\nWeight: 15.8g",
    },
    {
        "name": "Ubiquiti UniFi Dream Machine Pro",
        "category": "Networking",
        "brand": "Ubiquiti",
        "price": 55000,
        "discount_price": None,
        "stock": 50,
        "rating": 4.6,
        "tag": "Network",
        "is_featured": False,
        "image_url": "/product-media/ubiquiti-unifi-dream-machine-pro_accurate.jpg",
        "description": "All-in-one enterprise network console with Dual WAN, 10G SFP+, and advanced firewall tools.",
        "specifications": "WAN: Dual WAN\nPorts: 10G SFP+\nSecurity: Advanced firewall\nUse: Store, office, and creator studio networks",
    },
    {
        "name": "TP-Link Deco AX3000 WiFi 6 Mesh",
        "category": "Networking",
        "brand": "TP-Link",
        "price": 24999,
        "discount_price": None,
        "stock": 50,
        "rating": 4.5,
        "tag": "WiFi 6",
        "is_featured": False,
        "image_url": "/product-media/tp-link-deco-ax3000-wifi-6-mesh_accurate.jpg",
        "description": "WiFi 6 mesh system with seamless roaming, low latency, and wide home coverage.",
        "specifications": "Speed: AX3000\nWireless: WiFi 6\nCoverage: Mesh roaming\nUse: Home, hostel, and small office",
    },
    {
        "name": "Corsair MM300 PRO Extended Mouse Pad",
        "category": "Accessories",
        "brand": "Corsair",
        "price": 4500,
        "discount_price": None,
        "stock": 50,
        "rating": 4.3,
        "tag": "Desk",
        "is_featured": False,
        "image_url": "/product-media/corsair_pad.jpg",
        "description": "Spill-proof extended gaming mouse pad with a smooth surface for full desk setups.",
        "specifications": "Surface: Textile weave\nSize: Extended\nBase: Anti-skid rubber\nUse: Gaming and developer desks",
    },
    {
        "name": "Anker 735 Charger (GaNPrime 65W)",
        "category": "Accessories",
        "brand": "Anker",
        "price": 8999,
        "discount_price": None,
        "stock": 50,
        "rating": 4.6,
        "tag": "Charger",
        "is_featured": False,
        "image_url": "/product-media/anker-735-charger-ganprime-65w.jpg",
        "description": "Compact GaNPrime charger that powers three devices at once with fast 65W output.",
        "specifications": "Output: 65W\nPorts: 2 USB-C + 1 USB-A\nTechnology: GaNPrime\nUse: Phone, tablet, and laptop charging",
    },
    {
        "name": "SanDisk 1TB Dual Drive USB-C",
        "category": "Accessories",
        "brand": "SanDisk",
        "price": 9500,
        "discount_price": None,
        "stock": 50,
        "rating": 4.4,
        "tag": "Storage",
        "is_featured": False,
        "image_url": "/product-media/sandisk-1tb-dual-drive-usb-c_accurate.jpg",
        "description": "Dual USB-C and USB-A flash drive for moving files between phones, tablets, Macs, and PCs.",
        "specifications": "Capacity: 1TB\nConnectors: USB-C and USB-A\nUse: Phone and laptop file transfer\nDesign: Reversible dual drive",
    },
    {
        "name": "Keychron Q1 Pro Mechanical Keyboard",
        "category": "Accessories",
        "brand": "Keychron",
        "price": 28000,
        "discount_price": None,
        "stock": 50,
        "rating": 4.7,
        "tag": "Custom",
        "is_featured": False,
        "image_url": "/product-media/keychron-q1-pro-mechanical-keyboard_accurate.jpg",
        "description": "Full-metal QMK/VIA wireless custom mechanical keyboard for heavy typing and coding.",
        "specifications": "Build: Full metal\nFirmware: QMK/VIA\nConnection: Wireless and wired\nUse: Coding, writing, and desk setups",
    },
    {
        "name": "CalDigit TS4 Thunderbolt 4 Dock",
        "category": "Accessories",
        "brand": "CalDigit",
        "price": 62000,
        "discount_price": None,
        "stock": 50,
        "rating": 4.8,
        "tag": "Dock",
        "is_featured": False,
        "image_url": "/product-media/caldigit-ts4-thunderbolt-4-dock_accurate.jpg",
        "description": "Thunderbolt 4 dock with 18 ports, 98W charging, and 2.5GbE for full workstation setups.",
        "specifications": "Ports: 18\nCharging: 98W\nNetwork: 2.5GbE\nConnection: Thunderbolt 4",
    },
    {
        "name": "CG 190L Single Door Refrigerator",
        "category": "Appliances",
        "brand": "CG",
        "price": 32999,
        "discount_price": 29999,
        "stock": 11,
        "rating": 4.2,
        "tag": "Appliance",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?auto=format&fit=crop&w=900&q=80",
        "description": "Compact refrigerator for flats, shops, and hostel rooms.",
        "specifications": "Capacity: 190L\nEnergy: 3 star\nWarranty: 1 year\nDelivery: Scheduled",
    },
    {
        "name": "Xiaomi Smart Air Purifier 4",
        "category": "Appliances",
        "brand": "Xiaomi",
        "price": 23999,
        "discount_price": 20999,
        "stock": 15,
        "rating": 4.5,
        "tag": "Clean Air",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80",
        "description": "Smart purifier for dust, smoke, and indoor pollution.",
        "specifications": "Coverage: Up to 48 sq m\nFilter: HEPA\nControl: App and voice\nWarranty: 1 year",
    },
    {
        "name": "Nike Training Yoga Mat",
        "category": "Sports",
        "brand": "Nike",
        "price": 4999,
        "discount_price": 4199,
        "stock": 31,
        "rating": 4.4,
        "tag": "Fitness",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&w=900&q=80",
        "description": "Comfortable non-slip mat for home workouts and yoga.",
        "specifications": "Thickness: 5mm\nMaterial: TPE\nUse: Yoga and training\nCarry strap: Included",
    },
    {
        "name": "Dukan Basics Dumbbell Set 20kg",
        "category": "Sports",
        "brand": "Dukan Basics",
        "price": 6999,
        "discount_price": 5999,
        "stock": 17,
        "rating": 4.2,
        "tag": "Workout",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
        "description": "Adjustable dumbbell set for simple strength training at home.",
        "specifications": "Total weight: 20kg\nMaterial: Cement plates\nGrip: Steel bar\nUse: Home gym",
    },
    {
        "name": "Atomic Habits",
        "category": "Books",
        "brand": "Penguin",
        "price": 1199,
        "discount_price": 999,
        "stock": 48,
        "rating": 4.8,
        "tag": "Book",
        "is_featured": True,
        "image_url": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=900&q=80",
        "description": "A practical book on building better habits and systems.",
        "specifications": "Format: Paperback\nLanguage: English\nPages: 320\nCategory: Self improvement",
    },
    {
        "name": "Classmate Notebook Pack",
        "category": "Books",
        "brand": "Dukan Basics",
        "price": 599,
        "discount_price": 499,
        "stock": 90,
        "rating": 4.1,
        "tag": "School",
        "is_featured": False,
        "image_url": "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=80",
        "description": "Pack of ruled notebooks for school and college.",
        "specifications": "Pack: 5 notebooks\nPages: 160 each\nPaper: Ruled\nUse: Study",
    },
]

for row in products_data:
    category = cats[row["category"]]
    brand = brands[row["brand"]]
    image_url = row["image_url"]
    product_defaults = {
        "category": category,
        "brand": brand,
        "store": demo_store,
        "description": row["description"],
        "specifications": row["specifications"],
        "price": row["price"],
        "discount_price": row["discount_price"],
        "stock": row["stock"],
        "rating": row["rating"],
        "tag": row["tag"],
        "is_featured": row["is_featured"],
        "is_active": True,
    }
    product, created = Product.objects.update_or_create(
        name=row["name"],
        defaults=product_defaults,
    )
    ProductImage.objects.update_or_create(
        product=product,
        order=0,
        defaults={
            "image_url": image_url,
            "alt_text": product.name,
            "is_primary": True,
        },
    )
    Inventory.objects.update_or_create(product=product, defaults={"quantity": product.stock, "low_stock_threshold": 5})
    if created:
        print(f"Added {product.name}")

fallback_images = {
    "accessories": "https://images.unsplash.com/photo-1625961332771-3f40b0e2bdcf?auto=format&fit=crop&w=900&q=80",
    "appliances": "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    "audio": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    "beauty": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
    "books": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    "fashion": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    "gaming": "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=900&q=80",
    "groceries": "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    "home": "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    "laptops": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
    "mobiles": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    "networking": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    "sports": "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=900&q=80",
}

for product in Product.objects.filter(images__isnull=True).select_related("category"):
    image_url = fallback_images.get(
        product.category.slug,
        "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=900&q=80",
    )
    ProductImage.objects.create(
        product=product,
        order=0,
        image_url=image_url,
        alt_text=product.name,
        is_primary=True,
    )

print(f"{Product.objects.count()} products total")
print("Seed complete")
