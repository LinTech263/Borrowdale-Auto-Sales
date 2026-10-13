import { Vehicle, VehiclePrivate, Category, Lead, SiteSettings, SiteContent, Guide, PageLayoutSettings } from '../types';

// Helper to generate neutral placeholder vehicle graphics for admin draft uploads
export function getCarSvgPlaceholder(colorHex: string = '#C6A15B', label: string = 'Vehicle Photo'): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
    <rect width="800" height="500" fill="#F8FAFC"/>
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${colorHex}" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="#E2E8F0" stop-opacity="0.9"/>
      </linearGradient>
    </defs>
    <rect x="20" y="20" width="760" height="460" rx="8" fill="url(#grad)" stroke="#CBD5E1" stroke-width="2"/>
    <circle cx="400" cy="220" r="70" fill="${colorHex}" fill-opacity="0.15"/>
    <path d="M340 250 L375 200 L425 200 L460 250 Z" fill="${colorHex}" fill-opacity="0.7"/>
    <circle cx="365" cy="255" r="14" fill="#1E293B"/>
    <circle cx="435" cy="255" r="14" fill="#1E293B"/>
    <rect x="350" y="235" width="100" height="15" rx="3" fill="#0F172A"/>
    <text x="400" y="320" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0F172A" text-anchor="middle">${label}</text>
    <text x="400" y="350" font-family="sans-serif" font-size="13" fill="#64748B" text-anchor="middle">BORROWDALE AUTO SALES • HARARE</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Showroom Hero Carousel Slides - High-end cars in luxury showroom setting
export const heroShowroomSlides = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=2000&q=85',
    title: 'Prestige Showroom Collection',
    subtitle: 'Borrowdale Road, Opposite Sam Levy’s Village, Harare',
    badge: 'Borrowdale Flagship Showroom'
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=2000&q=85',
    title: 'Executive Performance & Sports Line',
    subtitle: 'Hand-picked luxury motorcars with verified mechanical provenance',
    badge: 'Executive Suite'
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=2000&q=85',
    title: 'Flagship 4x4 & Luxury SUVs',
    subtitle: 'Commanding road presence engineered for Zimbabwe highways',
    badge: 'All-Terrain Prestige'
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=2000&q=85',
    title: 'Private Viewing & VIP Suites',
    subtitle: 'Confidential viewings by appointment in Harare’s premier address',
    badge: 'VIP Client Lounge'
  },
  {
    id: 'slide-5',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=2000&q=85',
    title: 'German Engineering & Bespoke Saloons',
    subtitle: 'Pre-inspected, duty-paid and ready for immediate delivery',
    badge: 'Showroom Floor'
  }
];

export const initialCategories: Category[] = [
  {
    id: 'cat-suv',
    name: 'Luxury SUVs',
    slug: 'luxury-suvs',
    description: 'High-riding commanding presence built for executive comfort and Zimbabwe highway endurance.',
    heroImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
    defaultMarkupPercent: 12,
    isActive: true,
    showOnHome: true,
    sortOrder: 1,
  },
  {
    id: 'cat-double-cabs',
    name: 'Double Cabs & Pick-ups',
    slug: 'double-cabs',
    description: 'Uncompromising dual-purpose 4x4 bakkies engineered for farms, mines, and Harare executive driveways.',
    heroImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    defaultMarkupPercent: 10,
    isActive: true,
    showOnHome: true,
    sortOrder: 2,
  },
  {
    id: 'cat-executive-sedans',
    name: 'Executive Sedans',
    slug: 'executive-sedans',
    description: 'Refined German precision and prestige saloons delivering effortless highway cruising.',
    heroImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    defaultMarkupPercent: 14,
    isActive: true,
    showOnHome: true,
    sortOrder: 3,
  },
  {
    id: 'cat-prestige-sports',
    name: 'Prestige & Performance',
    slug: 'prestige-performance',
    description: 'Rare enthusiast motorcars, V8 soundtracks, and high-performance engineering.',
    heroImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    defaultMarkupPercent: 15,
    isActive: true,
    showOnHome: true,
    sortOrder: 4,
  },
  {
    id: 'cat-family-crossovers',
    name: 'Crossovers & Estates',
    slug: 'crossovers-estates',
    description: 'Versatile premium compact SUVs with excellent ground clearance and urban agility.',
    heroImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    defaultMarkupPercent: 11,
    isActive: true,
    showOnHome: true,
    sortOrder: 5,
  },
];

export const initialVehicles: Vehicle[] = [
  {
    id: 'veh-001',
    stockNo: 'BAS-8041',
    slug: '2023-toyota-land-cruiser-300-gr-sport-bas8041',
    title: '2023 Toyota Land Cruiser 300 GR Sport',
    year: 2023,
    make: 'Toyota',
    model: 'Land Cruiser 300',
    trim: 'GR Sport 3.3D V6 4WD',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-suv'],
    bodyType: 'SUV',
    price: 138000,
    wasPrice: 145000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 18500,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engineSize: '3.3L V6 Twin-Turbo Diesel',
    exteriorColor: 'Precious White Pearl',
    interiorColor: 'Black & Dark Red Leather',
    seats: 7,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1594502184342-2e12f877aa73?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The definitive benchmark for prestige and off-road capability in Zimbabwe. This 2023 Toyota Land Cruiser 300 GR Sport combines bulletproof twin-turbo diesel torque with E-KDSS electronic suspension for unmatched ride quality across both Enterprise Road and cross-country terrain. Immaculate condition, full dealer service record, balance of factory warranty, and verified mileage.',
    features: {
      safety: ['E-KDSS Kinetic Dynamic Suspension', 'Toyota Safety Sense 2.0', 'Adaptive Cruise Control', 'Lane Trace Assist', '10 Airbags', 'Blind Spot Monitor with RCTA'],
      comfort: ['Cool Box Central Console', 'Quad-Zone Climate Control', 'Heated & Ventilated Front & Middle Seats', 'Power Folding 3rd Row', 'Sunroof'],
      tech: ['12.3-inch Multimedia Display with Apple CarPlay & Android Auto', 'JBL 14-Speaker Premium Sound', 'Multi-Terrain 360 View Monitor', 'Head-Up Display'],
      exterior: ['GR Sport Honeycomb Grille & Badging', '18-inch Matt Black GR Alloy Wheels', 'Full LED Matrix Headlamps', 'Electric Tow Bar Preparation']
    },
    serviceHistory: 'Full Toyota franchise service record with stamped books. One owner since new. No accident history.',
    listedDate: '2026-09-28T08:00:00Z',
    viewsCount: 420,
    isDemo: true,
  },
  {
    id: 'veh-002',
    stockNo: 'BAS-8042',
    slug: '2022-mercedes-benz-g63-amg-bas8042',
    title: '2022 Mercedes-AMG G 63 V8 Biturbo',
    year: 2022,
    make: 'Mercedes-Benz',
    model: 'G-Class',
    trim: 'AMG G 63 4.0 V8 Biturbo',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-suv', 'cat-prestige-sports'],
    bodyType: 'SUV',
    price: 195000,
    wasPrice: 205000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 24000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '4.0L V8 Biturbo (577 hp)',
    exteriorColor: 'Obsidian Black Metallic',
    interiorColor: 'Designo Bengal Red Exclusive Nappa',
    seats: 5,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Iconic brutalist aesthetic paired with thunderous 577 horsepower V8 performance. Finished in deep Obsidian Black over Diamond-quilted Bengal Red Nappa leather. Features the AMG Night Package, switchable side-exit sports exhaust, and 22-inch forged cross-spoke wheels. Meticulously maintained and kept in climate-controlled garaging.',
    features: {
      safety: ['AMG High-Performance Braking System with Red Calipers', 'Active Brake Assist', '360 Surround Camera System', 'Distronic Plus Radar Cruise Control'],
      comfort: ['Exclusive Nappa Interior Package', 'Multicontour Massaging Seats', 'Burmester Surround Sound System', '64-Colour Ambient Lighting'],
      tech: ['Dual 12.3-inch Widescreen Digital Cockpit', 'AMG Dynamic Select Driving Modes', 'Smartphone Integration', 'Track Pace Telemetry'],
      exterior: ['AMG Night Package Gloss Black Accents', '22-inch Forged Cross-Spoke Alloys', 'Side-Exit AMG Switchable Sports Exhaust', 'Matrix Multibeam LEDs']
    },
    serviceHistory: 'Full authorised Mercedes-Benz specialist records.',
    listedDate: '2026-10-02T10:30:00Z',
    viewsCount: 512,
    isDemo: true,
  },
  {
    id: 'veh-003',
    stockNo: 'BAS-8043',
    slug: '2023-ford-ranger-raptor-30-v6-ecoboost-bas8043',
    title: '2023 Ford Ranger Raptor 3.0 V6 EcoBoost',
    year: 2023,
    make: 'Ford',
    model: 'Ranger Raptor',
    trim: '3.0 V6 Twin-Turbo 4WD 10AT',
    condition: 'Pre-owned',
    status: 'Available',
    categoryIds: ['cat-double-cabs', 'cat-prestige-sports'],
    bodyType: 'Double Cab',
    price: 84000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 14200,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engineSize: '3.0L V6 Twin-Turbo EcoBoost (392 hp)',
    exteriorColor: 'Code Orange',
    interiorColor: 'Ebony Leather with Code Orange Accents',
    seats: 5,
    doors: 4,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The pinnacle high-speed desert and dirt runner now available in Harare. Equipped with factory FOX 2.5 Live Valve internal bypass shock absorbers and anti-lag V6 EcoBoost engine. Front and rear locking differentials ensure total dominance over challenging terrain while remaining civilized in city traffic.',
    features: {
      safety: ['Front and Rear Locking Differentials', 'Baja Mode Terrain Management', 'Trail Control Off-Road Cruise', 'Autonomous Emergency Braking'],
      comfort: ['F-22 Fighter Jet Inspired Sports Seats', 'Dual-Zone Climate Control', 'Keyless Entry & Push-Button Start', 'Acoustic Windscreen'],
      tech: ['12-inch SYNC 4A Vertical Touchscreen', 'B&O 10-Speaker Sound System', 'Wireless Charging Pad', '12.4-inch Digital Cluster'],
      exterior: ['17-inch Beadlock-Capable Alloys with BFGoodrich KO2 Tyres', 'Heavy-Duty Steel Bash Plates', 'Cast Aluminium Side Steps', 'Matrix LED Headlamps']
    },
    serviceHistory: 'Single executive owner. Balance of Ford warranty.',
    listedDate: '2026-10-05T09:15:00Z',
    viewsCount: 388,
    isDemo: true,
  },
  {
    id: 'veh-004',
    stockNo: 'BAS-8044',
    slug: '2022-toyota-hilux-28-gd6-legend-rs-bas8044',
    title: '2022 Toyota Hilux 2.8 GD-6 Legend RS 4x4 Auto',
    year: 2022,
    make: 'Toyota',
    model: 'Hilux',
    trim: 'Legend RS 2.8 GD-6 4x4 Automatic',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-double-cabs'],
    bodyType: 'Double Cab',
    price: 59500,
    wasPrice: 63000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 38000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engineSize: '2.8L 4-Cyl Turbodiesel (150 kW / 500 Nm)',
    exteriorColor: 'Attitude Black',
    interiorColor: 'Legend Black Perforated Leather with Blue Ambient Lighting',
    seats: 5,
    doors: 4,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Zimbabwe’s proven champion for farm, mine, and executive town duty. The flagship Legend RS features the factory motorised lockable roller shutter, rubberised bin, JBL 9-speaker audio, and Toyota Safety Sense radar suite. Smooth 6-speed auto and robust 2.8 GD-6 engine tuned to 500Nm.',
    features: {
      safety: ['Toyota Safety Sense with Pre-Collision Warning', 'Adaptive Cruise Control', 'Rear Differential Lock', 'Hill Descent Assist'],
      comfort: ['Power Adjustable Drivers Seat', 'JBL Premium Audio', 'Leather Upholstery', 'Dual-Zone Air Conditioning'],
      tech: ['8-inch Infotainment with Apple CarPlay', 'Reverse Camera & Parking Sensors', 'Multi-Information Display Cluster'],
      exterior: ['Motorised Aluminium Roller Shutter (RS Package)', 'Black Sports Bar & Nudge Bar', '18-inch Legend Alloys', 'LED Headlamps & Daytime Lights']
    },
    serviceHistory: 'Full Toyota service agent history. Clean bill of health.',
    listedDate: '2026-10-06T14:20:00Z',
    viewsCount: 310,
    isDemo: true,
  },
  {
    id: 'veh-005',
    stockNo: 'BAS-8045',
    slug: '2023-range-rover-sport-d350-first-edition-bas8045',
    title: '2023 Land Rover Range Rover Sport D350 Dynamic HSE',
    year: 2023,
    make: 'Land Rover',
    model: 'Range Rover Sport',
    trim: 'D350 3.0 MHEV Dynamic HSE AWD',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-suv'],
    bodyType: 'SUV',
    price: 155000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 19800,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '3.0L Straight-Six Twin-Turbo Diesel (345 hp)',
    exteriorColor: 'Carpathian Grey Metallic',
    interiorColor: 'Deep Garnet & Ebony Semi-Aniline Leather',
    seats: 5,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Dynamic luxury redefined. The new-generation Range Rover Sport combines reductive modern design with peerless ride refinement courtesy of Dynamic Air Suspension with switchable volume air springs and all-wheel steering. Effortless 700Nm of torque from the silky Ingenium twin-turbo diesel.',
    features: {
      safety: ['All-Wheel Steering', 'Electronic Air Suspension with Dynamic Response Pro', '3D Surround Camera with Wade Sensing', 'ClearSight Rear View Mirror'],
      comfort: ['Semi-Aniline 22-Way Heated & Cooled Massage Seats', 'Soft Door Close', 'Panoramic Sliding Sunroof', 'Cabin Air Purification Pro'],
      tech: ['13.1-inch Curved Floating Pivi Pro Screen', 'Meridian 3D Surround Sound 800W', 'Head-Up Display', 'Wireless Device Charging'],
      exterior: ['22-inch Satin Dark Grey Wheels with Carbon Inserts', 'Pixel LED Headlights with Signature DRL', 'Flush Deployable Door Handles', 'Black Contrast Roof']
    },
    serviceHistory: 'Full franchise service history with Land Rover warranty valid.',
    listedDate: '2026-10-07T11:00:00Z',
    viewsCount: 470,
    isDemo: true,
  },
  {
    id: 'veh-006',
    stockNo: 'BAS-8046',
    slug: '2021-bmw-m5-competition-f90-bas8046',
    title: '2021 BMW M5 Competition (F90 LCI)',
    year: 2021,
    make: 'BMW',
    model: 'M5',
    trim: 'Competition 4.4 V8 M xDrive 625hp',
    condition: 'Pre-owned',
    status: 'Available',
    categoryIds: ['cat-executive-sedans', 'cat-prestige-sports'],
    bodyType: 'Sedan',
    price: 112000,
    wasPrice: 119000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 31000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '4.4L TwinPower Turbo V8 (625 hp / 750 Nm)',
    exteriorColor: 'Marina Bay Blue Metallic',
    interiorColor: 'Silverstone Merino Leather with M Piping',
    seats: 5,
    doors: 4,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Supercar pace with five-passenger executive composure. 0-100 km/h in 3.3 seconds via the switchable M xDrive all-wheel-drive system (including pure rear-wheel-drive mode). Facelift LCI model with updated shock absorber damping, larger infotainment screen, and M Carbon exterior package.',
    features: {
      safety: ['M Carbon Ceramic Brakes with Gold Calipers', 'M Compound Differential', 'Driving Assistant Professional', 'Laserlight Headlamps with High-Beam Assist'],
      comfort: ['M Multifunction Ventilated Seats with Illuminated M5 Logo', 'Bowers & Wilkins Diamond Surround Sound', 'Four-Zone Climate Control', 'Alcantara Anthracite Headliner'],
      tech: ['BMW Live Cockpit Professional 12.3-inch', 'Head-Up Display with M Mode', 'Apple CarPlay & Android Auto', 'M Setup Custom Memory Buttons'],
      exterior: ['Carbon Fibre Reinforced Plastic (CFRP) Roof', '20-inch Style 789M Forged Wheels', 'M Sports Exhaust System with Black Chrome Tips', 'Carbon Mirror Caps']
    },
    serviceHistory: 'BMW Motorplan service history verified.',
    listedDate: '2026-10-08T16:00:00Z',
    viewsCount: 395,
    isDemo: true,
  },
  {
    id: 'veh-007',
    stockNo: 'BAS-8047',
    slug: '2023-isuzu-d-max-30-tdi-v-cross-4x4-bas8047',
    title: '2023 Isuzu D-Max 3.0 Ddi V-Cross 4x4 Auto',
    year: 2023,
    make: 'Isuzu',
    model: 'D-Max',
    trim: 'V-Cross 3.0 Ddi 4x4 Double Cab 6AT',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-double-cabs'],
    bodyType: 'Double Cab',
    price: 52000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 26000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engineSize: '3.0L 4-Cylinder Turbodiesel (140 kW / 450 Nm)',
    exteriorColor: 'Islay Gray Metallic',
    interiorColor: 'Black Leather with Gunmetal Inlays',
    seats: 5,
    doors: 4,
    location: 'Borrowdale Showroom, Harare',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Renowned commercial reliability wrapped in an aggressive modern double-cab package. The V-Cross sits at the top of the D-Max range with Advanced Driver Assist Systems (IDAS), electronic rear diff lock, and 800mm water wading depth. Superb fuel economy and proven durability across Zimbabwe roads.',
    features: {
      safety: ['IDAS Stereo Camera Safety Suite', 'Rear Differential Lock with Electronic Switch', 'Hill Descent Control', '8 Airbags including Center Airbag'],
      comfort: ['8-Way Electric Driver Seat with Lumbar Support', 'Dual-Zone Climate Control with Rear Vents', 'Leather Wrapped Multi-Function Steering'],
      tech: ['9-inch High-Resolution Touchscreen with Apple CarPlay', 'Digital Driver Information Display', 'Reverse Camera with Dynamic Guidelines'],
      exterior: ['Gun Metallic Exterior Accents & Roof Rails', '18-inch Dark Grey Alloy Wheels', 'Bi-LED Headlights with Automatic Levelling', 'Heavy-Duty Rear Step Bumper']
    },
    serviceHistory: 'Full dealer service history with balance of warranty and service plan.',
    listedDate: '2026-10-09T09:00:00Z',
    viewsCount: 220,
    isDemo: true,
  },
  {
    id: 'veh-008',
    stockNo: 'BAS-8048',
    slug: '2020-mercedes-benz-e300-amg-line-bas8048',
    title: '2020 Mercedes-Benz E-Class E 300 AMG Line',
    year: 2020,
    make: 'Mercedes-Benz',
    model: 'E-Class',
    trim: 'E 300 AMG Line 9G-Tronic',
    condition: 'Pre-owned',
    status: 'Available',
    categoryIds: ['cat-executive-sedans'],
    bodyType: 'Sedan',
    price: 43500,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 48000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'RWD',
    engineSize: '2.0L Turbocharged 4-Cylinder (255 hp)',
    exteriorColor: 'Iridium Silver Metallic',
    interiorColor: 'Black Artico & Dinamica Microfibre',
    seats: 5,
    doors: 4,
    location: 'Borrowdale Showroom, Harare',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Executive dignity and refined poise. This facelift E 300 features the AMG aerodynamic body styling, 19-inch AMG twin-spoke alloy wheels, widescreen cockpit with MBUX voice control, and Agility Control selective damping suspension.',
    features: {
      safety: ['Active Parking Assist with Parktronic', 'Blind Spot Assist', 'Collision Prevention Assist Plus', 'LED High Performance Headlights'],
      comfort: ['Heated Front Seats', 'Thermatic Automatic Climate Control', 'Ambient Lighting with 64 Colours', 'Comfort Suspension'],
      tech: ['MBUX Multimedia System with "Hey Mercedes"', 'Smartphone Integration Pack', 'Wireless Mobile Charging Pad'],
      exterior: ['AMG Bodystyling Front Apron & Side Skirts', '19-inch AMG 5-Twin-Spoke Alloys', 'Diamond Grille with Chrome Pins']
    },
    serviceHistory: 'Full agency service history recorded in digital book.',
    listedDate: '2026-10-10T12:00:00Z',
    viewsCount: 185,
    isDemo: true,
  },
  {
    id: 'veh-009',
    stockNo: 'BAS-8049',
    slug: '2022-porsche-cayenne-gts-coupe-bas8049',
    title: '2022 Porsche Cayenne GTS Coupe V8',
    year: 2022,
    make: 'Porsche',
    model: 'Cayenne',
    trim: 'GTS Coupe 4.0 Twin-Turbo V8 Tiptronic S',
    condition: 'Certified',
    status: 'Available',
    categoryIds: ['cat-suv', 'cat-prestige-sports'],
    bodyType: 'SUV',
    price: 148000,
    wasPrice: 155000,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 21500,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '4.0L Twin-Turbo V8 (453 hp / 620 Nm)',
    exteriorColor: 'Crayon (Chalk) Grey',
    interiorColor: 'GTS Alcantara & Black Leather with Carmine Red Stitching',
    seats: 5,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: true,
    coverImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The sports car among luxury SUVs. The Cayenne GTS Coupe brings back the thumping 4.0-litre V8 engine coupled with a sports exhaust that produces a spine-tingling acoustic note. Equipped with Porsche Active Suspension Management (PASM) with 20mm lower ride height, Sport Chrono Package, and lightweight sports carbon roof.',
    features: {
      safety: ['Porsche Surface Coated Brakes (PSCB) with Red Calipers', 'Porsche Dynamic Light System Plus (PDLS+)', 'Night Vision Assist Camera'],
      comfort: ['Adaptive 18-Way Sports Seats Plus', 'Soft-Close Doors', 'BOSE Surround Sound System 710W', 'Panoramic Fixed Glass Roof'],
      tech: ['Sport Chrono Package with Mode Switch', 'Porsche Communication Management 12.3-inch', 'Apple CarPlay with Wireless Connection'],
      exterior: ['SportDesign Package in Satin Black', '21-inch RS Spyder Design Wheels in Satin Black', 'Sports Exhaust System with Central Oval Tailpipes in Black']
    },
    serviceHistory: 'Full Porsche Centre service record. 111-point inspection certified.',
    listedDate: '2026-10-11T15:30:00Z',
    viewsCount: 350,
    isDemo: true,
  },
  {
    id: 'veh-010',
    stockNo: 'BAS-8050',
    slug: '2021-toyota-fortuner-28-gd6-vx-4x4-bas8050',
    title: '2021 Toyota Fortuner 2.8 GD-6 VX 4x4 Auto',
    year: 2021,
    make: 'Toyota',
    model: 'Fortuner',
    trim: '2.8 GD-6 VX 4x4 Automatic (7-Seater)',
    condition: 'Pre-owned',
    status: 'Available',
    categoryIds: ['cat-suv', 'cat-family-crossovers'],
    bodyType: 'SUV',
    price: 49500,
    isPriceNegotiable: true,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 44000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: '4WD',
    engineSize: '2.8L Turbodiesel 4-Cylinder (150 kW / 500 Nm)',
    exteriorColor: 'Glacier White',
    interiorColor: 'Chamois & Black Leather',
    seats: 7,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'The definitive 7-seater family adventure SUV for Zimbabwe. Top-specification VX trim delivers high-output 150kW turbodiesel performance, 18-inch alloys, JBL 11-speaker sound, and Toyota Safety Sense package. Pristine condition with low mileage for its year.',
    features: {
      safety: ['Toyota Safety Sense Suite', 'Blind Spot Monitor', 'Rear Cross Traffic Alert', '7 Airbags', 'Rear Diff Lock'],
      comfort: ['Leather 7-Passenger Seating', 'Dual-Zone Air Conditioning with Ceiling Vents', 'Power Tailgate', 'Heated Front Seats'],
      tech: ['JBL Premium Sound 11 Speakers', '8-inch Touchscreen with Navigation & CarPlay', 'Paddle Shifters'],
      exterior: ['Bi-Beam LED Headlamps', '18-inch Machined Finish Alloys', 'Side Steps & Roof Rails']
    },
    serviceHistory: 'Full Toyota franchise history from day one.',
    listedDate: '2026-10-12T08:15:00Z',
    viewsCount: 290,
    isDemo: true,
  },
  {
    id: 'veh-011',
    stockNo: 'BAS-8051',
    slug: '2023-audi-rs6-avant-carbon-black-bas8051',
    title: '2023 Audi RS6 Avant 4.0 TFSI V8 Quattro',
    year: 2023,
    make: 'Audi',
    model: 'RS6 Avant',
    trim: 'Carbon Black 4.0 V8 Twin-Turbo 600hp Tiptronic',
    condition: 'Certified',
    status: 'Reserved',
    categoryIds: ['cat-prestige-sports', 'cat-crossovers-estates'],
    bodyType: 'Coupe',
    price: 168000,
    isPriceNegotiable: false,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 11000,
    fuel: 'Petrol',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '4.0L Twin-Turbo V8 (600 hp / 800 Nm)',
    exteriorColor: 'Nardo Grey',
    interiorColor: 'Black Valcona Leather with Rock Grey Honeycomb Stitching',
    seats: 5,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Under reservation. The quintessential super-estate combining ferocious 600hp twin-turbo V8 capability with 5-passenger practicality and estate utility. Featuring Nardo Grey paintwork, Carbon Black exterior optics, HD Matrix LED headlights with Audi laser light, and RS Sports Exhaust.',
    features: {
      safety: ['Quattro with Sport Differential', 'All-Wheel Steering', 'Carbon Ceramic Brakes with Anthracite Calipers'],
      comfort: ['Super Sports Seats in Valcona Leather', 'Bang & Olufsen 3D Advanced Sound System 1820W', 'Panoramic Glass Roof'],
      tech: ['Audi Virtual Cockpit Plus with RS Displays', 'Head-Up Display', 'Audi MMI Dual Touchscreens'],
      exterior: ['Carbon Black Styling Package', '22-inch 5-V-Spoke Gloss Anthracite Alloys', 'RS Sports Exhaust System']
    },
    serviceHistory: 'Certified Audi Approved Plus warranty and full service book.',
    listedDate: '2026-09-15T10:00:00Z',
    viewsCount: 680,
    isDemo: true,
  },
  {
    id: 'veh-012',
    stockNo: 'BAS-8038',
    slug: '2022-land-rover-defender-110-d300-x-dynamic-bas8038',
    title: '2022 Land Rover Defender 110 D300 X-Dynamic HSE',
    year: 2022,
    make: 'Land Rover',
    model: 'Defender 110',
    trim: 'D300 MHEV X-Dynamic HSE AWD',
    condition: 'Certified',
    status: 'Sold',
    categoryIds: ['cat-suv'],
    bodyType: 'SUV',
    price: 118000,
    isPriceNegotiable: false,
    isPriceOnRequest: false,
    hidePrice: false,
    mileage: 29000,
    fuel: 'Diesel',
    transmission: 'Automatic',
    drivetrain: 'AWD',
    engineSize: '3.0L Straight-6 Twin-Turbo Diesel (300 hp)',
    exteriorColor: 'Pangea Green Metallic with White Contrast Roof',
    interiorColor: 'Acorn & Lunar Robustec Interior',
    seats: 5,
    doors: 5,
    location: 'Borrowdale Showroom, Harare',
    featured: false,
    coverImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Delivered to a valued client in Borrowdale Brooke. Recently sold example showing our high turnover of premium Land Rover inventory. Contact our sales desk to source a matching specification Defender for you.',
    features: {
      safety: ['Electronic Air Suspension with Adaptive Dynamics', 'Wade Sensing up to 900mm', 'ClearSight Ground View Camera'],
      comfort: ['14-Way Heated & Cooled Electric Memory Seats', 'Meridian Sound System', 'Sliding Panoramic Roof'],
      tech: ['11.4-inch Pivi Pro Touchscreen', 'Interactive Driver Display', 'Head-Up Display'],
      exterior: ['20-inch Satin Dark Grey Style 5098 Wheels', 'X-Dynamic Silicon Silver Accents', 'Black Exposed Rear Recovery Eyes']
    },
    serviceHistory: 'Supplied with full franchise history and handover documentation.',
    listedDate: '2026-08-10T10:00:00Z',
    soldDate: '2026-09-18T14:00:00Z',
    viewsCount: 710,
    isDemo: true,
  }
];

// Admin private pricing & VINs
export const initialVehiclesPrivate: Record<string, VehiclePrivate> = {
  'veh-001': {
    vehicleId: 'veh-001',
    vin: 'JTMBV0AJ504081923',
    costPrice: 122000,
    markupType: 'fixed',
    markupValue: 16000,
    computedSellingPrice: 138000,
    marginAmount: 16000,
    marginPercent: 11.59,
    roundingRule: 500,
    priceHistory: [
      { date: '2026-09-28', oldPrice: 145000, newPrice: 138000, changedBy: 'Director', reason: 'Market competitive adjustment' }
    ],
    internalNotes: 'Purchased directly from executive repatriating to UK. Spotless inspection.'
  },
  'veh-002': {
    vehicleId: 'veh-002',
    vin: 'W1NYX77X9NF391048',
    costPrice: 172000,
    markupType: 'percentage',
    markupValue: 13.37,
    computedSellingPrice: 195000,
    marginAmount: 23000,
    marginPercent: 11.79,
    roundingRule: 500,
    priceHistory: [
      { date: '2026-10-02', oldPrice: 205000, newPrice: 195000, changedBy: 'Director', reason: 'Spring stock showcase price' }
    ],
    internalNotes: 'Client willing to take clean trade-in up to $50k.'
  },
  'veh-003': {
    vehicleId: 'veh-003',
    vin: '6FPXXMJ2XNB710294',
    costPrice: 74500,
    markupType: 'fixed',
    markupValue: 9500,
    computedSellingPrice: 84000,
    marginAmount: 9500,
    marginPercent: 11.31,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'High interest from mining executives. Minimum floor $80k.'
  },
  'veh-004': {
    vehicleId: 'veh-004',
    vin: 'AHTBB3CD508192348',
    costPrice: 53000,
    markupType: 'fixed',
    markupValue: 6500,
    computedSellingPrice: 59500,
    marginAmount: 6500,
    marginPercent: 10.92,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Legend RS package fully verified. Spare key present.'
  },
  'veh-005': {
    vehicleId: 'veh-005',
    vin: 'SALWR2V84PA190283',
    costPrice: 138000,
    markupType: 'fixed',
    markupValue: 17000,
    computedSellingPrice: 155000,
    marginAmount: 17000,
    marginPercent: 10.97,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Immaculate condition. Two key fobs, original manuals.'
  },
  'veh-006': {
    vehicleId: 'veh-006',
    vin: 'WBSJF02010CC81940',
    costPrice: 99000,
    markupType: 'fixed',
    markupValue: 13000,
    computedSellingPrice: 112000,
    marginAmount: 13000,
    marginPercent: 11.61,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Tyres at 80% tread. Carbon ceramic rotors inspected.'
  },
  'veh-007': {
    vehicleId: 'veh-007',
    vin: 'MPATFS40JP4081920',
    costPrice: 46000,
    markupType: 'fixed',
    markupValue: 6000,
    computedSellingPrice: 52000,
    marginAmount: 6000,
    marginPercent: 11.54,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Reliable fast mover. Great trade-in potential.'
  },
  'veh-008': {
    vehicleId: 'veh-008',
    vin: 'WDD2130832B109283',
    costPrice: 38000,
    markupType: 'fixed',
    markupValue: 5500,
    computedSellingPrice: 43500,
    marginAmount: 5500,
    marginPercent: 12.64,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Serviced 2,000km ago.'
  },
  'veh-009': {
    vehicleId: 'veh-009',
    vin: 'WP1ZZZ9YZNDA19028',
    costPrice: 131000,
    markupType: 'fixed',
    markupValue: 17000,
    computedSellingPrice: 148000,
    marginAmount: 17000,
    marginPercent: 11.49,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Crayon color premium. Clean title.'
  },
  'veh-010': {
    vehicleId: 'veh-010',
    vin: 'AHTKA3GS408194821',
    costPrice: 43800,
    markupType: 'fixed',
    markupValue: 5700,
    computedSellingPrice: 49500,
    marginAmount: 5700,
    marginPercent: 11.52,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Excellent 7-seater condition.'
  },
  'veh-011': {
    vehicleId: 'veh-011',
    vin: 'WAUZZZF28PA019482',
    costPrice: 150000,
    markupType: 'fixed',
    markupValue: 18000,
    computedSellingPrice: 168000,
    marginAmount: 18000,
    marginPercent: 10.71,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Deposit received from client pending bank clearance.'
  },
  'veh-012': {
    vehicleId: 'veh-012',
    vin: 'SALEE7H45N2819034',
    costPrice: 104000,
    markupType: 'fixed',
    markupValue: 14000,
    computedSellingPrice: 118000,
    marginAmount: 14000,
    marginPercent: 11.86,
    roundingRule: 500,
    priceHistory: [],
    internalNotes: 'Sold to Borrowdale Brooke resident. Handover completed.'
  }
};

export const initialLeads: Lead[] = [
  {
    id: 'lead-101',
    type: 'make_offer',
    status: 'New',
    createdAt: '2026-10-13T04:15:00Z',
    customerName: 'Tendai M.',
    phone: '+263 77 234 5678',
    email: 'tendai.m@example.co.zw',
    preferredContact: 'WhatsApp',
    vehicleId: 'veh-001',
    vehicleTitle: '2023 Toyota Land Cruiser 300 GR Sport',
    vehicleStockNo: 'BAS-8041',
    vehicleAskingPrice: 138000,
    offerAmount: 132000,
    hasTradeIn: true,
    tradeInDetails: {
      make: 'Toyota',
      model: 'Land Cruiser 200 VX',
      year: 2018,
      mileage: 95000,
      condition: 'Excellent, full service history',
      askingValuation: 65000
    },
    needsFinance: false,
    message: 'Serious cash buyer looking to upgrade my LC200 to the 300 GR Sport. Ready to inspect this afternoon in Borrowdale.',
    internalNotes: ['High probability buyer. Trade-in LC200 is desirable stock for quick resale.'],
    sourceUrl: '/vehicle/2023-toyota-land-cruiser-300-gr-sport-bas8041'
  },
  {
    id: 'lead-102',
    type: 'make_offer',
    status: 'Negotiating',
    createdAt: '2026-10-12T11:30:00Z',
    customerName: 'Farai K.',
    phone: '+263 71 890 1234',
    preferredContact: 'WhatsApp',
    vehicleId: 'veh-003',
    vehicleTitle: '2023 Ford Ranger Raptor 3.0 V6 EcoBoost',
    vehicleStockNo: 'BAS-8043',
    vehicleAskingPrice: 84000,
    offerAmount: 78000,
    hasTradeIn: false,
    needsFinance: false,
    counterOfferAmount: 81000,
    message: 'Can pay in USD cash within 48 hours if you accept $78,000.',
    internalNotes: ['Countered at $81,000 via WhatsApp. Client considering over the weekend.'],
    sourceUrl: '/vehicle/2023-ford-ranger-raptor-30-v6-ecoboost-bas8043'
  },
  {
    id: 'lead-103',
    type: 'book_viewing',
    status: 'Viewing Booked',
    createdAt: '2026-10-12T09:00:00Z',
    customerName: 'Tinashe C.',
    phone: '+263 77 345 6789',
    preferredContact: 'Call',
    vehicleId: 'veh-002',
    vehicleTitle: '2022 Mercedes-AMG G 63 V8 Biturbo',
    vehicleStockNo: 'BAS-8042',
    vehicleAskingPrice: 195000,
    viewingDateTime: 'Tomorrow at 10:30 AM',
    message: 'Would like to view the G63 and listen to the engine startup. Please confirm availability of vehicle on showroom floor.',
    internalNotes: ['Appointment confirmed for showroom floor. Car washed and positioned in main bay.'],
    sourceUrl: '/vehicle/2022-mercedes-benz-g63-amg-bas8042'
  },
  {
    id: 'lead-104',
    type: 'trade_in',
    status: 'Contacted',
    createdAt: '2026-10-11T16:20:00Z',
    customerName: 'Kudakwashe R.',
    phone: '+263 78 456 7890',
    preferredContact: 'WhatsApp',
    hasTradeIn: true,
    tradeInDetails: {
      make: 'Ford',
      model: 'Ranger 3.2 Wildtrak',
      year: 2019,
      mileage: 72000,
      condition: 'Clean interior, canopy fitted, one owner',
      askingValuation: 32000
    },
    message: 'Wanting to trade in my Wildtrak against your 2022 Hilux Legend RS.',
    internalNotes: ['Requested 4 exterior photos and tyre photos via WhatsApp.'],
    sourceUrl: '/sell-your-car'
  },
  {
    id: 'lead-105',
    type: 'sourcing',
    status: 'New',
    createdAt: '2026-10-10T14:45:00Z',
    customerName: 'Dr. Chipo M.',
    phone: '+263 77 567 8901',
    preferredContact: 'WhatsApp',
    sourcingDetails: {
      budget: '$60,000 - $75,000',
      makeModelDesired: 'Toyota Prado TX-L 2.8 Diesel or Lexus RX 350',
      yearRange: '2021 - 2023'
    },
    message: 'Looking for a clean Prado TX-L 2.8 or Lexus RX with under 40,000km in Pearl White. Can view anytime in Borrowdale.',
    internalNotes: ['Check with partner network in Durban/Harare for incoming white Prados.'],
    sourceUrl: '/inventory'
  },
  {
    id: 'lead-106',
    type: 'make_offer',
    status: 'Won',
    createdAt: '2026-09-17T10:15:00Z',
    customerName: 'Simba Z.',
    phone: '+263 77 678 9012',
    preferredContact: 'WhatsApp',
    vehicleId: 'veh-012',
    vehicleTitle: '2022 Land Rover Defender 110 D300',
    vehicleStockNo: 'BAS-8038',
    vehicleAskingPrice: 120000,
    offerAmount: 118000,
    message: 'Offer accepted and vehicle handed over with full documentation.',
    internalNotes: ['Deal closed at $118,000. Client thrilled with fast turnaround.'],
    sourceUrl: '/vehicle/2022-land-rover-defender-110-d300-x-dynamic-bas8038'
  }
];

export const initialSiteSettings: SiteSettings = {
  dealershipName: 'Borrowdale Auto Sales',
  legalEntityName: 'Borrowdale Auto Sales (Pvt) Ltd',
  tagline: 'Serious Cars for Serious Drivers.',
  phonePlaceholder: '+263 77 000 0000',
  whatsappPlaceholder: '+263 77 000 0000',
  emailPlaceholder: 'sales@borrowdaleautosales.co.zw',
  addressPlaceholder: 'Borrowdale Road (Opposite Sam Levy’s Village), Borrowdale, Harare, Zimbabwe',
  hoursPlaceholder: 'Monday – Friday: 08:00 – 17:00 | Saturday: 08:30 – 13:00 | Sunday: By Appointment',
  locationCoordinates: { lat: -17.7554, lng: 31.0855 },
  googleMapsUrl: 'https://maps.google.com/?q=-17.7554,31.0855',
  facebookUrl: 'https://www.facebook.com/borrowdaleautosales',
  instagramUrl: 'https://www.instagram.com/borrowdaleautosales',
  currency: {
    primary: 'USD',
    secondaryEnabled: false,
    secondaryCurrency: 'ZiG',
    usdToZigRate: 26.5
  },
  brandColors: {
    obsidian: '#FFFFFF',
    graphite: '#FFFFFF',
    gunmetal: '#E2E8F0',
    brass: '#C6A15B',
    ember: '#B3261E',
    brandGreen: '#0E7A33',
    brandOrange: '#EA580C'
  },
  defaultCategoryMarkup: 12,
  notificationEmails: 'sales@borrowdaleautosales.co.zw',
  analytics: {
    ga4Id: '',
    metaPixelId: '',
    searchConsoleCode: ''
  }
};

export const initialSiteContent: SiteContent = {
  heroHeadingOption: 'A',
  heroH1_A: 'Serious Cars for Serious Drivers.',
  heroH1_B: 'Borrowdale\'s Address for Premium Cars.',
  heroTagline: 'Distinction, delivered.',
  heroSub: 'Hand-picked premium vehicles, honest pricing and a team that answers on WhatsApp. Find your next car in Borrowdale, Harare.',
  trustBar: [
    { icon: 'ShieldCheck', title: 'Transparent Pricing', subtitle: 'No hidden showroom surcharges or inflated markups' },
    { icon: 'FileText', title: 'Paperwork Handled', subtitle: 'ZIMRA clearance, change of ownership and licensing guidance' },
    { icon: 'Calendar', title: 'Viewings by Appointment', subtitle: 'Private inspections at our secure Borrowdale address' },
    { icon: 'MessageCircle', title: 'Replies on WhatsApp, Fast', subtitle: 'Direct voice and chat with decision-makers' }
  ],
  whyUs: [
    { title: 'Selected, not stocked', subtitle: 'Curated Excellence', description: 'We don\'t fill lots with ordinary cars. Every vehicle on our floor is chosen for verified provenance, mechanical condition, and lasting value.' },
    { title: 'Straight pricing', subtitle: 'Honest Deals', description: 'Clear USD numbers without showroom mystery. Room to submit realistic offers directly to the owner without awkward pressure.' },
    { title: 'One point of contact', subtitle: 'Personal Attention', description: 'From your first WhatsApp enquiry to vehicle inspection and keys handover, you deal with one dedicated senior specialist.' },
    { title: 'Ready for the road', subtitle: 'Thorough Preparation', description: 'Thorough pre-delivery safety checks, clear title paperwork, and handover support so you drive away with complete peace of mind.' }
  ],
  howBuyingWorks: [
    { step: 1, title: 'Find It', desc: 'Browse our live Borrowdale inventory with transparent USD prices and high-definition photography.' },
    { step: 2, title: 'Ask or Make Your Offer', desc: 'Click WhatsApp or submit your offer online. We respond directly with terms and trade-in valuations.' },
    { step: 3, title: 'View & Test Drive', desc: 'Inspect the vehicle in person at our secure Borrowdale showroom and verify all mechanical records.' },
    { step: 4, title: 'Sign & Drive Away', desc: 'We assist with seamless documentation, change of ownership, and handover to your driveway.' }
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'Can I negotiate the price or make an offer?',
      answer: 'Yes. We welcome serious, realistic offers on all available stock. You can submit an offer directly using the Make an Offer button on any vehicle page or talk to us on WhatsApp.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-2',
      question: 'How do I make an offer?',
      answer: 'Simply click "Make an Offer" on the car you want. Enter your proposed price, contact details, and any trade-in information. Your offer is non-binding and we reply promptly.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-3',
      question: 'Can I view and test drive a vehicle before deciding?',
      answer: 'Absolutely. Viewings and test drives are arranged by appointment at our Borrowdale showroom so the vehicle is prepped and our team can give you dedicated time.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-4',
      question: 'Do you accept trade-ins or vehicle part-exchange?',
      answer: 'Yes. We frequently evaluate clean, well-maintained vehicles as trade-ins against our inventory. Share your vehicle details and photos on WhatsApp or via our Sell Your Car page.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-5',
      question: 'Do you offer vehicle finance or bank arrangements?',
      answer: 'We assist clients who have pre-approved corporate or banking facilities. You can submit a finance enquiry through our Finance page or estimate your monthly installments.',
      confirmWithOwnerPolicy: true
    },
    {
      id: 'faq-6',
      question: 'Which documents are handled when I purchase a vehicle?',
      answer: 'We provide the original registration book, agreement of sale, verified ZIMRA duty clearance documents, and assist you through the Change of Ownership procedure.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-7',
      question: 'Can you source a specific vehicle if it is not currently on your floor?',
      answer: 'Yes. If you are searching for a specific trim, year, or model of Toyota, Mercedes-Benz, Land Rover, or Porsche, submit a Sourcing Request and our procurement desk will locate it.',
      confirmWithOwnerPolicy: false
    },
    {
      id: 'faq-8',
      question: 'Where are you located in Borrowdale and when are you open?',
      answer: 'We are situated along Borrowdale Road in Harare, conveniently opposite Sam Levy’s Village. We are open Monday to Friday 08:00 – 17:00, Saturday 08:30 – 13:00, and Sundays by appointment.',
      confirmWithOwnerPolicy: false
    }
  ],
  testimonials: [],
  partnerLogos: [],
  landingPagesCopy: {
    'used-cars-borrowdale-harare': {
      title: 'Used Cars in Borrowdale, Harare | Premium Hand-Picked Stock',
      metaDesc: 'Looking for verified used cars in Borrowdale, Harare? Browse executive SUVs, double cabs, and luxury sedans with honest USD pricing and WhatsApp support.',
      h1: 'Quality Used Cars for Sale in Borrowdale, Harare',
      introHtml: '<p>Welcome to Borrowdale’s trusted dealership for verified pre-owned vehicles. Every car listed on our showroom floor has undergone rigorous provenance checks, mechanical inspections, and documentation verification.</p>'
    },
    'luxury-cars-for-sale-harare': {
      title: 'Luxury Cars for Sale in Harare, Zimbabwe | Borrowdale Auto Sales',
      metaDesc: 'Discover Harare’s premier selection of luxury vehicles: Mercedes-Benz, Land Rover, Porsche and BMW. Transparent pricing and private viewing appointments.',
      h1: 'Prestige & Luxury Cars for Sale in Harare',
      introHtml: '<p>For drivers who demand uncompromised refinement and engineering excellence. Explore our hand-picked portfolio of executive German saloons, high-performance coupes, and flagship luxury SUVs situated in Borrowdale.</p>'
    },
    'suvs-for-sale-harare': {
      title: 'Luxury SUVs for Sale in Harare | Toyota Land Cruiser, Range Rover',
      metaDesc: 'Commanding premium SUVs for sale in Harare. Toyota Land Cruiser 300, Prado, Range Rover Sport and Mercedes G-Class available for immediate inspection.',
      h1: 'Premium SUVs for Sale in Harare, Zimbabwe',
      introHtml: '<p>Harare roads and Zimbabwe highway travel require capable suspension and commanding ground clearance. Our SUV collection pairs rugged durability with world-class cabin comfort.</p>'
    },
    'double-cabs-for-sale-zimbabwe': {
      title: 'Double Cabs for Sale in Zimbabwe | Toyota Hilux, Ford Ranger Raptor',
      metaDesc: 'Browse 4x4 double cabs for sale in Zimbabwe. Toyota Hilux Legend RS, Ford Ranger Raptor and Isuzu D-Max with honest USD pricing in Borrowdale.',
      h1: 'High-Spec 4x4 Double Cabs for Sale in Zimbabwe',
      introHtml: '<p>The ultimate multi-purpose vehicles for Zimbabwean business leaders, commercial farming operations, and family getaways. Discover top-tier double cabs ready for the toughest terrain.</p>'
    },
    'mercedes-benz-for-sale-zimbabwe': {
      title: 'Mercedes-Benz for Sale in Zimbabwe | G-Class, AMG, E-Class in Harare',
      metaDesc: 'Explore Mercedes-Benz and AMG vehicles in Harare. Certified pre-owned Mercedes G63 AMG, E-Class, and executive saloons in Borrowdale.',
      h1: 'Mercedes-Benz Vehicles for Sale in Harare, Zimbabwe',
      introHtml: '<p>The benchmark of automotive prestige. Browse our collection of immaculate Mercedes-Benz and Mercedes-AMG models with full service history and verified mileage.</p>'
    }
  },
  layouts: {
    heroGradientOpacity: 'light',
    heroSearchBoxPosition: 'below_cta',
    heroShowBadge: true,
    heroBadgeText: 'Borrowdale Flagship Showroom',
    heroCtaPrimaryText: 'Browse Inventory',
    heroCtaSecondaryText: 'WhatsApp Us Now',

    homeSectionsOrder: [
      'hero',
      'trust_bar',
      'featured',
      'body_types',
      'budget',
      'recent',
      'why_us',
      'how_buying_works',
      'make_offer_teaser',
      'sell_cta',
      'recently_sold',
      'testimonials',
      'faqs_guides'
    ],
    homeSectionsEnabled: {
      hero: true,
      trust_bar: true,
      featured: true,
      body_types: true,
      budget: true,
      recent: true,
      why_us: true,
      how_buying_works: true,
      make_offer_teaser: true,
      sell_cta: true,
      recently_sold: true,
      testimonials: true,
      faqs_guides: true
    },

    featuredVehiclesTitle: 'Featured Showroom Stock',
    featuredVehiclesSubtitle: 'Hand-picked prestige models ready for immediate inspection in Borrowdale',
    featuredVehiclesCount: 6,
    featuredGridCols: 3,

    bodyTypesTitle: 'Browse by Body Style',
    bodyTypesSubtitle: 'Find the vehicle suited to your driving demands and lifestyle in Harare',

    budgetTitle: 'Shop by Investment Tier',
    budgetSubtitle: 'Transparent USD pricing without hidden fees or currency surcharges',

    recentlyAddedTitle: 'Latest Showroom Arrivals',
    recentlyAddedSubtitle: 'Recently acquired vehicles now on the floor in Borrowdale',

    makeOfferTeaserTitle: 'See It. Price It. Make Your Offer.',
    makeOfferTeaserSubtitle: 'Direct, honest price negotiation',
    makeOfferTeaserDesc: 'Every listed vehicle accepts serious offers. Name your purchase price and trade-in specifications with no strings attached.',
    makeOfferTeaserButtonText: 'Browse Vehicles & Make an Offer',

    sellCarBandTitle: 'Sell or Trade-In Your Executive Vehicle',
    sellCarBandSubtitle: 'Fair market valuation, immediate settlement, and zero paperwork hassle',
    sellCarBandButtonText: 'Get My Free Valuation',

    recentlySoldTitle: 'Recently Delivered in Harare',
    recentlySoldSubtitle: 'Proven track record of high-demand vehicles placed with discerning clients',

    inventoryTitle: 'Borrowdale Showroom Inventory',
    inventorySubtitle: 'Verified luxury motorcars, rugged double cabs, and executive saloons in Harare',
    inventoryFilterPosition: 'left',
    inventoryGridCols: 3,

    vehicleDetailSidebarPosition: 'right',
    vehicleDetailShowCalculator: true,
    vehicleDetailShowSpecsTable: true,
    vehicleDetailCtaText: 'WhatsApp Sales Specialist',

    sellPageTitle: 'Sell or Trade-In Your Motorcar',
    sellPageSubtitle: 'Direct purchase or trade-in credit at realistic Harare market valuation',
    sellPageButtonText: 'Submit Vehicle for Valuation',

    financePageTitle: 'Vehicle Financing & Payment Estimator',
    financePageSubtitle: 'Calculate estimated monthly payments and explore pre-approved banking options',

    aboutPageTitle: 'The Premier Address for Executive Cars in Harare',
    aboutPageStoryHeading: 'Engineering Integrity & Transparent Dealing',
    aboutPagePillarsHeading: 'Our Four Dealership Pillars',

    contactPageTitle: 'Visit Our Borrowdale Showroom',
    contactPageSubtitle: 'Private viewings, trade-in valuations, and executive vehicle handovers'
  }
};

export const defaultLayoutSettings: PageLayoutSettings = initialSiteContent.layouts!;

export const initialGuides: Guide[] = [
  {
    id: 'guide-1',
    slug: 'how-to-inspect-a-used-car-before-you-buy-in-zimbabwe',
    title: 'How to Inspect a Used Car Before You Buy in Zimbabwe',
    summary: 'A practical, field-tested guide to checking mechanical condition, suspension wear, and fluid health before handing over cash in Harare.',
    readingTime: '6 min read',
    publishedDate: '2026-09-20',
    author: 'Borrowdale Auto Sales Editorial Team',
    coverImage: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1200&q=80',
    targetKeywords: ['used car inspection Zimbabwe', 'buying used car Harare', 'car checklist Zimbabwe'],
    contentMarkdown: `### 1. Always Inspect in Broad Daylight
Never inspect a vehicle under poor showroom lighting or after dusk. Daylight reveals subtle differences in paint reflection, uneven panel gaps, overspray around rubber door seals, and signs of past accident repairs.

### 2. Cold Start and Idle Check
Insist on seeing the engine start when completely cold. Touch the bonnet and engine block before turning the key to ensure the seller hasn't warmed it up beforehand. Watch the exhaust tip for blue smoke (oil burning) or persistent white steam (head gasket issue). A healthy modern diesel or petrol should settle into a smooth, vibration-free idle within 30 seconds.

### 3. Suspension and Undercarriage for Zimbabwean Roads
Harare’s roads test suspension bushings, ball joints, and shock absorbers rigorously. Crouch down with a flashlight and check:
- Shock absorbers for signs of hydraulic fluid leaking or weeping.
- Rubber bushes around control arms for dry rot, tearing, or excessive play.
- Differential and gearbox casings for fresh oil drips.
- Chassis rails for any signs of repair welding or off-road impact damage.

### 4. Fluid Inspections
Pull the oil dipstick and check both color and consistency. Dark diesel oil is normal, but frothy or milky residue on the oil filler cap suggests coolant contamination. Check coolant reservoir transparency: it should be clean pink, green, or blue, never murky brown rust water.

### 5. Road Test Under Load
Take the vehicle onto an open stretch of road such as Enterprise Road or the Borrowdale bypass. Accelerate firmly through all gears:
- Does the automatic transmission shift smoothly without hesitation or violent clunks?
- Does the vehicle track straight when you gently ease your grip on the steering wheel on a flat road?
- Apply firm brakes: is there any pulsing or shudder in the pedal indicating warped brake discs?

*Reviewed by the dealership before publishing. This guide provides general inspection practices; always consult a trusted certified technician for specialized diagnostic scanning.*`
  },
  {
    id: 'guide-2',
    slug: 'suv-vs-double-cab-which-suits-your-life-in-harare',
    title: 'SUV vs Double Cab: Which Suits Your Life in Harare?',
    summary: 'Comparing suspension comfort, security, load flexibility, and resale value between luxury SUVs and modern 4x4 bakkies.',
    readingTime: '5 min read',
    publishedDate: '2026-09-28',
    author: 'Borrowdale Auto Sales Editorial Team',
    coverImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80',
    targetKeywords: ['SUV vs double cab Zimbabwe', 'Hilux vs Land Cruiser Harare', 'best car for Zimbabwe roads'],
    contentMarkdown: `### The Great Zimbabwean Motoring Dilemma
For most car buyers in Harare, the choice ultimately narrows down to two vehicle classes: a luxury SUV (such as a Toyota Land Cruiser 300, Prado, or Range Rover) or a high-spec 4x4 Double Cab (such as a Hilux Legend RS, Ford Ranger Raptor, or Isuzu V-Cross). Both offer generous ground clearance, but they cater to distinct lifestyles.

### 1. Ride Comfort and Passenger Acoustics
Modern double cabs have made enormous strides in refinement, but they still rely on robust ladder-frame chassis with rear leaf springs or coil setups designed to carry up to 1,000kg in the bed. When unladen, a double cab will exhibit a firmer, bouncier rear ride over potholes. In contrast, an SUV like the Land Cruiser 300 or Range Rover Sport features multi-link adaptive or air suspension engineered purely for occupant luxury and cabin hush.

### 2. Luggage Security and Weather Protection
One major consideration in Harare is cargo protection:
- **SUVs:** Fully enclosed luggage compartments keep suitcases, shopping, and golf bags protected from dust, rain, and opportunistic theft.
- **Double Cabs:** Require a lockable aluminium roller shutter (such as on the Hilux Legend RS) or a secure canopy to safeguard valuables from heavy rains and unmonitored parking lots.

### 3. Utility, Farming, and Construction
If your routine involves visiting property developments, transporting feed or generator fuel, or hauling equipment to a farm in Mazowe or Beatrice, a double cab is unbeatable. You can toss dirty tools, building materials, and wet gear straight into the spraylined load bed without fearing damage to fine interior leather.

### 4. Long-Term Resale Value in Harare
Both categories command tremendous resale retention in Zimbabwe. Toyota models lead the pack across the board, followed closely by Ford and Isuzu. SUVs typically hold stronger prestige appeal among corporate executives, whereas double cabs enjoy constant, insatiable demand from agricultural, engineering, and mining sectors.

*Reviewed by the dealership before publishing.*`
  },
  {
    id: 'guide-3',
    slug: 'how-to-sell-your-car-faster-and-for-more-in-harare',
    title: 'How to Sell Your Car Faster and for More in Harare',
    summary: 'Five strategic steps to maximize valuation, attract serious buyers, and avoid time-wasters when trading in or selling your vehicle.',
    readingTime: '4 min read',
    publishedDate: '2026-10-04',
    author: 'Borrowdale Auto Sales Editorial Team',
    coverImage: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&w=1200&q=80',
    targetKeywords: ['sell my car Harare', 'car trade-in Harare Zimbabwe', 'how to sell car Zimbabwe'],
    contentMarkdown: `### 1. Gather Your Paperwork Before You List
Nothing cools a buyer’s enthusiasm quicker than missing documentation. Before marketing your vehicle or presenting it to a dealership, ensure you have:
- The original Blue Book (Registration Book) matching the chassis and engine numbers.
- Proof of ZIMRA customs duty clearance.
- A neatly compiled folder of all service receipts and stamped maintenance records.

### 2. Invest in Professional Detailing
A US$50 professional valet delivers a multifold return on your sale price. Thoroughly clean the engine bay of dust, deep-clean the leather seats with conditioner, polish out light clearcoat swirl marks, and clean all alloy wheels inside out. A vehicle that looks and smells pristine signals meticulous owner care.

### 3. Fix Minor Cosmetic and Mechanical Gremlins
Small annoyances—a cracked side mirror glass, a burnt-out LED bulb, a worn wiper blade, or an air conditioning system needing a gas top-up—often give buyers an excuse to demand a US$1,000 to US$2,000 price discount. Rectifying these low-cost fixes beforehand preserves your asking price leverage.

### 4. Realistic Market Valuation vs Listing Vanity
Research actual transacted prices in Harare rather than aspirational listings. Vehicles priced accurately to market move within 7 to 14 days; vehicles priced 15% above reality linger for months, creating a perception among buyers that something is wrong with the car.

### 5. Private Sale vs Dealer Trade-In
Selling privately through classifieds means handling dozens of late-night messages, tyre-kickers, and strangers visiting your private residence. Trading in with a reputable Borrowdale dealership provides immediate settlement, total paperwork transfer security, and a seamless drive-away upgrade on your next car.

*Reviewed by the dealership before publishing.*`
  },
  {
    id: 'guide-4',
    slug: 'paperwork-checklist-when-buying-a-vehicle-in-zimbabwe',
    title: 'Paperwork Checklist When Buying a Vehicle in Zimbabwe',
    summary: 'The essential legal and registration documents required for ZIMRA, CID Vehicle Theft Squad, and Central Vehicle Registry compliance.',
    readingTime: '5 min read',
    publishedDate: '2026-10-08',
    author: 'Borrowdale Auto Sales Editorial Team',
    coverImage: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80',
    targetKeywords: ['car paperwork Zimbabwe', 'ZIMRA clearance car', 'change of ownership Zimbabwe vehicle'],
    contentMarkdown: `### Essential Documentation When Purchasing a Motor Vehicle
Buying a premium motor vehicle in Zimbabwe requires careful diligence to ensure legal ownership and prevent complications down the line. Here is the standard checklist every buyer must verify:

### 1. Original Vehicle Registration Book (Blue Book)
Verify that:
- The registered owner matches the seller's national identity card.
- The Engine Number and Chassis / VIN Number stamped physically on the vehicle match the book exactly down to every character.
- There are no financial encumbrance endorsements or liens marked on the front face.

### 2. ZIMRA Customs Clearance and Assessment (For Imported Vehicles)
Ensure that the customs declaration (Bill of Entry), assessment notice, and customs release order are present. If the vehicle was brought in under rebate (e.g. civil servant or immigrant rebate), ensure the retention period has lapsed or the requisite duty has been settled before transfer.

### 3. Agreement of Sale
A legally structured Agreement of Sale must specify:
- Full legal names and national ID numbers of both buyer and seller.
- Exact purchase consideration (USD agreed price).
- Full vehicle identification (Make, Model, Year, Engine, Chassis, Mileage).
- Signatures of both parties accompanied by independent witnesses.

### 4. CID Vehicle Theft Squad (VTS) Clearance
Before Central Vehicle Registry (CVR) will process a Change of Ownership, the vehicle must undergo physical inspection at a CID Vehicle Theft Squad depot (such as Southerton in Harare) to verify engine and chassis authenticity.

### 5. Change of Ownership at CVR / Zimpost
Submit the original Blue Book, CID clearance certificate, signed Agreement of Sale, copies of national IDs, and proof of residence to CVR or authorized Zimpost branches to receive the new registration book in your name.

*At Borrowdale Auto Sales, we guide our clients through this complete documentation workflow to ensure a smooth, worry-free handover. Reviewed by the dealership before publishing.*`
  }
];
