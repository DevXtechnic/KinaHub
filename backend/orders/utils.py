from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime

# ─── Zone definitions ────────────────────────────────────────────────
# Dukan's warehouse is assumed to be in central Kathmandu (Thamel area).
# Zones radiate outward; each has a base fee and a per-km-equivalent surcharge.

ZONE_CONFIG = {
    # Zone 1 — Core Kathmandu (< ~3 km from centre)
    "core": {
        "base_fee": Decimal("40.00"),
        "eta_food": "20-30 mins",
        "eta_standard": "45-60 mins",
    },
    # Zone 2 — Greater Kathmandu (3-7 km)
    "inner": {
        "base_fee": Decimal("70.00"),
        "eta_food": "30-45 mins",
        "eta_standard": "1-2 hours",
    },
    # Zone 3 — Lalitpur / ring-road fringe (7-12 km)
    "middle": {
        "base_fee": Decimal("100.00"),
        "eta_food": "45-60 mins",
        "eta_standard": "2-3 hours",
    },
    # Zone 4 — Bhaktapur / outer valley (12-20 km)
    "outer": {
        "base_fee": Decimal("150.00"),
        "eta_food": "60-90 mins",
        "eta_standard": "3-5 hours",
    },
    # Zone 5 — Far outskirts / semi-rural
    "remote": {
        "base_fee": Decimal("220.00"),
        "eta_food": "Not available",
        "eta_standard": "1-2 days",
    },
}

# Map every area to a zone.  Keys are lowercase.
AREA_ZONE_MAP = {
    # ── Zone: core ──
    "thamel": "core", "ason": "core", "new road": "core", "basantapur": "core",
    "chhetrapati": "core", "bhotahity": "core", "sundhara": "core",
    "kamaladi": "core", "putalisadak": "core", "ratnapark": "core",
    "jamal": "core", "dillibazar": "core", "kamalpokhari": "core",
    "lainchaur": "core", "lazimpat": "core", "naxal": "core",
    "durbarmarg": "core", "durbar marg": "core", "tripureshwor": "core", "thapathali": "core",
    "gairidhara": "core", "tangal": "core", "baluwatar": "core",

    # ── Zone: inner ──
    "baneshwor": "inner", "new baneshwor": "inner", "old baneshwor": "inner",
    "maitidevi": "inner", "gyaneshwor": "inner", "hattisar": "inner",
    "battisputali": "inner", "ghattekulo": "inner", "sorhakhutte": "inner",
    "chabahil": "inner", "dhumbarahi": "inner", "maharajgunj": "inner",
    "dallu": "inner", "chhauni": "inner", "teku": "inner", "kalimati": "inner",
    "balkhu": "inner", "bafal": "inner", "nayabazar": "inner",
    "sinamangal": "inner", "gaushala": "inner", "pashupatinath": "inner",
    "min bhawan": "inner", "minbhawan": "inner", "sankhamul": "inner",
    "chandol": "inner", "tahachal": "inner", "tusal": "inner",

    # ── Zone: middle ──
    "balaju": "inner", "gongabu": "middle", "basundhara": "middle",
    "dhapasi": "middle", "ranibari": "middle", "kapan": "middle",
    "boudha": "middle", "boudhanath": "middle", "jorpati": "middle",
    "pepsicola": "middle", "koteshwor": "middle", "tinkune": "middle",
    "jadibuti": "middle", "kalanki": "middle", "sitapaila": "middle",
    "swayambhu": "middle", "kirtipur": "middle", "panga": "middle",
    "jawalakhel": "middle", "kupondole": "middle", "pulchowk": "middle",
    "patan": "middle", "lalitpur": "middle", "mangal bazaar": "middle",
    "lagankhel": "middle", "sanepa": "middle", "ekantakuna": "middle",
    "dhobighat": "middle", "gwarko": "middle", "satdobato": "middle",
    "nakhipot": "middle", "nakkhu": "middle", "khumaltar": "middle",

    # ── Zone: outer ──
    "bhaktapur": "outer", "bhaktapur durbar square": "outer",
    "sano thimi": "outer", "kausaltar": "outer", "suryabinayak": "outer",
    "tokha": "outer", "budhanilkantha": "outer", "imadol": "outer",
    "hattiban": "outer", "bhaisipati": "outer", "bhaisepati": "outer",
    "chapagaun": "outer", "dhapakhel": "outer", "lubhu": "outer",
    "thecho": "outer", "tyagal": "outer", "un park": "outer",

    # ── Zone: remote ──
    "farping": "remote", "pharping": "remote", "sankhu": "remote",
    "chandragiri": "remote",
}

# ─── Category-based surcharges ───────────────────────────────────────
# Some product categories are heavier / bulkier / need special handling.
CATEGORY_SURCHARGE = {
    "electronics": Decimal("30.00"),
    "furniture": Decimal("80.00"),
    "appliances": Decimal("50.00"),
    "beverages": Decimal("15.00"),     # heavy liquids
}

# ─── Thresholds & multipliers ────────────────────────────────────────
FREE_DELIVERY_THRESHOLD = Decimal("2500.00")   # free delivery over Rs 2500
HEAVY_ORDER_ITEMS_THRESHOLD = 5                # surcharge if > 5 distinct items
HEAVY_ORDER_SURCHARGE = Decimal("25.00")
PEAK_HOUR_MULTIPLIER = Decimal("1.20")         # 20% surge 11 AM – 2 PM and 6 – 9 PM
NIGHT_SURCHARGE = Decimal("50.00")             # flat surcharge 9 PM – 6 AM
MIN_DELIVERY_FEE = Decimal("35.00")            # never below Rs 35
MAX_DELIVERY_FEE = Decimal("400.00")           # cap at Rs 400


def _resolve_zone(shipping_address: str) -> str:
    """Match an address string to the best zone, defaulting to 'middle'."""
    addr = shipping_address.lower().strip()
    # Try longest match first so "new baneshwor" beats "baneshwor"
    for area in sorted(AREA_ZONE_MAP.keys(), key=len, reverse=True):
        if area in addr:
            return AREA_ZONE_MAP[area]
    return "middle"  # sensible default for unknown Kathmandu addresses


def _is_peak_hour() -> bool:
    """Check if current Nepal time falls in peak delivery windows."""
    # Nepal is UTC+5:45 — but on the server we just use local time
    hour = datetime.now().hour
    return (11 <= hour <= 13) or (18 <= hour <= 20)


def _is_night() -> bool:
    hour = datetime.now().hour
    return hour >= 21 or hour < 6


def calculate_delivery_info(shipping_address: str, products, quantity_map: dict = None) -> tuple:
    """
    Calculate a realistic delivery fee and ETA for an order on a per-item basis.

    Algorithm:
    1. Resolve customer shipping zone and product origin zone.
    2. If zones match (local delivery), fee is Rs 0.
    3. Otherwise, use higher of customer zone base fee or product base fee.
    4. Apply category, time-of-day surcharges.
    5. Return total aggregated fee and a dictionary of individual item ETAs/fees.
    """
    if quantity_map is None:
        quantity_map = {}

    shipping_zone = _resolve_zone(shipping_address)
    shipping_zone_cfg = ZONE_CONFIG[shipping_zone]

    if not products:
        return Decimal("150.00"), {}

    total_fee = Decimal("0.00")
    item_deliveries = {}
    
    is_night = _is_night()
    is_peak = _is_peak_hour()

    for product in products:
        # 1. Determine product origin zone (store area)
        store_area = product.store.area if product.store and product.store.area else "thamel"
        product_zone = _resolve_zone(store_area)
        
        # 2. Check for free local delivery (same zone)
        if product_zone == shipping_zone:
            item_fee = Decimal("0.00")
        else:
            # 3. Base fee: higher of customer zone fee or product's base fee override
            item_fee = max(shipping_zone_cfg["base_fee"], product.base_delivery_fee)
            
            # 4. Category surcharge
            cat_slug = product.category.slug.lower() if product.category else ""
            if cat_slug in CATEGORY_SURCHARGE:
                item_fee += CATEGORY_SURCHARGE[cat_slug]
                
            # 5. Time-of-day multipliers
            if is_night:
                item_fee += NIGHT_SURCHARGE
            elif is_peak:
                item_fee = (item_fee * PEAK_HOUR_MULTIPLIER).quantize(Decimal("1"), rounding=ROUND_HALF_UP)
                
            # 6. Clamp between MIN and MAX
            if item_fee > Decimal("0.00"):
                item_fee = max(item_fee, MIN_DELIVERY_FEE)
                item_fee = min(item_fee, MAX_DELIVERY_FEE)
                
            item_fee = item_fee.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)

        # 7. Determine ETA
        dte = product.delivery_time_estimate.lower()
        if "min" in dte or "hour" in dte:
            eta = shipping_zone_cfg["eta_food"]
        else:
            eta = shipping_zone_cfg["eta_standard"]

        item_deliveries[str(product.id)] = {
            "fee": str(item_fee),
            "eta": eta
        }
        total_fee += item_fee

    return total_fee, item_deliveries
