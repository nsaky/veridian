"""
Veridian Data Generator v2.0 - The Ground Truth
Generates 1,000 diverse property records with strict geo-tagging
"""

import json
import random
from datetime import datetime, timedelta

# Configuration
NUM_PROPERTIES = 1000
NUM_TRAP_PROPERTIES = 50  # High risk properties
OUTPUT_FILE = "api/data/pune_properties.json"

# Pune Localities with STRICT coordinates
LOCALITIES = {
    "Baner": {
        "lat": 18.5590,
        "lng": 73.7868,
        "metro_distance_base": 0.8,
        "price_multiplier": 1.3,
        "appreciation_base": 55,
    },
    "Hinjewadi": {
        "lat": 18.5913,
        "lng": 73.7389,
        "metro_distance_base": 3.2,
        "price_multiplier": 1.1,
        "appreciation_base": 48,
    },
    "Wagholi": {
        "lat": 18.5769,
        "lng": 73.9804,
        "metro_distance_base": 5.5,
        "price_multiplier": 0.7,
        "appreciation_base": 35,
    },
    "Kothrud": {
        "lat": 18.5074,
        "lng": 73.8077,
        "metro_distance_base": 2.1,
        "price_multiplier": 1.25,
        "appreciation_base": 42,
    },
    "Viman Nagar": {
        "lat": 18.5675,
        "lng": 73.9143,
        "metro_distance_base": 1.5,
        "price_multiplier": 1.35,
        "appreciation_base": 52,
    },
    "Koregaon Park": {
        "lat": 18.5362,
        "lng": 73.8961,
        "metro_distance_base": 2.8,
        "price_multiplier": 1.5,
        "appreciation_base": 48,
    },
    "Magarpatta": {
        "lat": 18.5157,
        "lng": 73.9290,
        "metro_distance_base": 3.5,
        "price_multiplier": 1.2,
        "appreciation_base": 45,
    },
    "Aundh": {
        "lat": 18.5590,
        "lng": 73.8078,
        "metro_distance_base": 1.8,
        "price_multiplier": 1.28,
        "appreciation_base": 50,
    },
}

# Property Types Distribution
PROPERTY_TYPES = {
    "Apartment": 0.50,  # 50%
    "Villa": 0.15,      # 15%
    "Plot": 0.20,       # 20%
    "Commercial": 0.15  # 15%
}

# Developer Tiers
TIER_1_DEVELOPERS = ["Godrej Properties", "Lodha Group", "Tata Housing", "Mahindra Lifespaces", "Prestige Group"]
TIER_2_DEVELOPERS = ["Kumar Properties", "Kolte-Patil", "Puravankara", "Shriram Properties"]
UNKNOWN_DEVELOPERS = ["Unknown Promoters", "VK Builders", "Local Developer", "City Constructions"]

# Images by type
IMAGES = {
    "Apartment": [
        "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    ],
    "Villa": [
        "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=80",
        "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200&q=80",
    ],
    "Plot": [
        "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80"
    ],
    "Commercial": [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80"
    ]
}

BEDROOM_CONFIGS = [1, 2, 3, 4]

def generate_property(index, property_type, is_trap=False):
    """Generate a single property record"""
    
    locality = random.choice(list(LOCALITIES.keys()))
    loc_data = LOCALITIES[locality]
    
    # Strict geo-tagging with minimal jitter
    lat = loc_data["lat"] + random.uniform(-0.001, 0.001)
    lng = loc_data["lng"] + random.uniform(-0.001, 0.001)
    distance_metro = loc_data["metro_distance_base"] + random.uniform(-0.2, 0.2)
    
    # Property-specific attributes
    if property_type == "Apartment":
        bedrooms = random.choice(BEDROOM_CONFIGS)
        carpet_area = bedrooms * random.randint(380, 450)
        base_price = carpet_area * random.randint(8000, 12000)
        rental_yield = round(random.uniform(2.8, 3.8), 2)
        land_title = "Leasehold" if random.random() > 0.7 else "Freehold"
        
    elif property_type == "Villa":
        bedrooms = random.choice([3, 4, 5])
        carpet_area = bedrooms * random.randint(600, 800)
        base_price = carpet_area * random.randint(15000, 25000)
        rental_yield = round(random.uniform(2.0, 2.8), 2)
        land_title = "Freehold"
        
    elif property_type == "Plot":
        bedrooms = 0
        carpet_area = random.randint(1000, 5000)
        base_price = carpet_area * random.randint(8000, 15000)
        rental_yield = 0
        land_title = "Freehold"
        
    else:  # Commercial
        bedrooms = 0
        carpet_area = random.randint(300, 2000)
        base_price = carpet_area * random.randint(12000, 20000)
        rental_yield = round(random.uniform(5.0, 7.5), 2)
        land_title = "Leasehold"
    
    price = int(base_price * loc_data["price_multiplier"])
    
    # Trap logic - make 20% cheaper
    if is_trap:
        price = int(price * 0.8)
    
    # Appreciation
    appreciation = loc_data["appreciation_base"] + random.randint(-10, 10)
    
    # Maintenance
    maintenance = round(carpet_area * 3.5) if property_type != "Plot" else 0
    
    # Developer
    if property_type in ["Villa", "Apartment"] and not is_trap:
        developer = random.choice(TIER_1_DEVELOPERS + TIER_2_DEVELOPERS)
    elif is_trap:
        developer = random.choice(UNKNOWN_DEVELOPERS)
    else:
        developer = "N/A"
    
    # Legal status - trap properties have issues
    if is_trap:
        if random.random() > 0.5:
            rera_status = "Revoked"
            litigation = 0
        else:
            rera_status = "Approved"
            litigation = random.randint(1, 3)
    else:
        rera_status = random.choice(["Approved"] * 8 + ["Revoked"])
        litigation = 0 if random.random() > 0.1 else random.randint(1, 2)
    
    # Possession date
    days_offset = random.randint(30, 730)
    possession_date = (datetime.now() + timedelta(days=days_offset)).strftime("%Y-%m-%d")
    
    # Image
    image_url = random.choice(IMAGES[property_type])
    
    # Title
    if property_type == "Apartment":
        title = f"{bedrooms}BHK {property_type} in {locality}"
    elif property_type == "Villa":
        title = f"Luxurious {bedrooms}BHK Villa - {locality}"
    elif property_type == "Plot":
        title = f"Residential Plot ({carpet_area} sq.ft) - {locality}"
    else:
        title = f"Commercial Shop ({carpet_area} sq.ft) - {locality}"
    
    return {
        "id": f"PROP_{str(index+1).zfill(4)}",
        "title": title,
        "developer": developer,
        "locality": locality,
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "price": price,
        "carpet_area": carpet_area,
        "bedrooms": bedrooms,
        "property_type": property_type,
        "land_title": land_title,
        "rental_yield": rental_yield,
        "appreciation": appreciation,
        "distance_metro": round(distance_metro, 2),
        "rera_status": rera_status,
        "litigation": litigation,
        "possession_date": possession_date,
        "maintenance": maintenance,
        "image_url": image_url
    }

def generate_dataset():
    """Generate complete dataset"""
    properties = []
    
    print(f"Generating {NUM_PROPERTIES} properties...")
    
    # Calculate distribution
    num_apartments = int(NUM_PROPERTIES * PROPERTY_TYPES["Apartment"])
    num_villas = int(NUM_PROPERTIES * PROPERTY_TYPES["Villa"])
    num_plots = int(NUM_PROPERTIES * PROPERTY_TYPES["Plot"])
    num_commercial = NUM_PROPERTIES - num_apartments - num_villas - num_plots
    
    print(f"  - Apartments: {num_apartments}")
    print(f"  - Villas: {num_villas}")
    print(f"  - Plots: {num_plots}")
    print(f"  - Commercial: {num_commercial}")
    print(f"  - Trap Properties: {NUM_TRAP_PROPERTIES}")
    
    index = 0
    trap_indices = set(random.sample(range(NUM_PROPERTIES), NUM_TRAP_PROPERTIES))
    
    # Generate apartments
    for i in range(num_apartments):
        is_trap = index in trap_indices
        properties.append(generate_property(index, "Apartment", is_trap))
        index += 1
    
    # Generate villas
    for i in range(num_villas):
        is_trap = index in trap_indices
        properties.append(generate_property(index, "Villa", is_trap))
        index += 1
    
    # Generate plots
    for i in range(num_plots):
        is_trap = index in trap_indices
        properties.append(generate_property(index, "Plot", is_trap))
        index += 1
    
    # Generate commercial
    for i in range(num_commercial):
        is_trap = index in trap_indices
        properties.append(generate_property(index, "Commercial", is_trap))
        index += 1
    
    # Shuffle
    random.shuffle(properties)
    
    # Re-assign sequential IDs
    for i, prop in enumerate(properties):
        prop["id"] = f"PROP_{str(i+1).zfill(4)}"
    
    return properties

def main():
    """Main execution"""
    print("\n🏗️  VERIDIAN DATA GENERATOR V2.0")
    print("=" * 50)
    
    dataset = generate_dataset()
    
    # Save to JSON
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(dataset, f, indent=2)
    
    print(f"\n✅ Generated {len(dataset)} properties")
    print(f"📁 Saved to: {OUTPUT_FILE}")
    
    # Statistics
    trap_count = sum(1 for p in dataset if p['rera_status'] == 'Revoked' or p['litigation'] > 0)
    villa_count = sum(1 for p in dataset if p['property_type'] == 'Villa')
    plot_count = sum(1 for p in dataset if p['property_type'] == 'Plot')
    baner_count = sum(1 for p in dataset if p['locality'] == 'Baner')
    
    print(f"\n📊 Dataset Statistics:")
    print(f"  - Villas: {villa_count}")
    print(f"  - Plots: {plot_count}")
    print(f"  - Properties in Baner: {baner_count}")
    print(f"  - Trap properties (risky): {trap_count}")
    print(f"  - Average price: ₹{sum(p['price'] for p in dataset) / len(dataset):,.0f}")
    
    print("\n✨ Data generation complete!\n")

if __name__ == "__main__":
    main()
