import { Venue, Review } from '../types';

export const INITIAL_VENUES: Venue[] = [
  {
    id: 'venue-patna-1',
    name: 'Royal Palace Resort & Convention',
    tagline: 'Grand royal wedding lawns & luxury banquet amidst lush manicured gardens',
    category: 'Resort',
    rating: 4.8,
    reviewCount: 142,
    startingPrice: 45000,
    minCapacity: 100,
    maxCapacity: 1200,
    state: 'Bihar',
    city: 'Patna',
    locality: 'Bailey Road / Danapur',
    pinCode: '801503',
    address: 'Near Saguna More, Danapur Khagaul Road, Patna, Bihar',
    landmark: 'Opposite AIIMS Link Road',
    coordinates: { lat: 25.5941, lng: 85.0443 },
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-fbf6951283fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Royal Palace Resort & Convention is Patna’s premier luxury wedding and grand celebration destination. Featuring two opulent pillarless banquet halls and sprawling emerald open-air lawns, it offers an imperial ambience for weddings, receptions, grand anniversaries, and corporate summits. Complete with in-house royal culinary catering, ambient mood lighting, bridal suites, and valet parking for over 250 cars.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 300,
      guestRooms: 28
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Swimming Pool',
      'Wi-Fi',
      'Bridal Dressing Room',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Engagement',
      'Reception',
      'Family Function',
      'Anniversary',
      'Corporate Meeting'
    ],
    packages: [
      {
        id: 'pkg-rp-silver',
        name: 'Silver Celebration Package',
        price: 45000,
        description: 'Ideal for engagements, anniversaries, and family functions up to 250 guests',
        inclusions: ['Banquet hall access (6 hours)', 'Basic sound & ambient lighting', 'Bridal room access', 'Standard stage setup', 'Parking assistance']
      },
      {
        id: 'pkg-rp-gold',
        name: 'Royal Shaadi Grand Package',
        price: 95000,
        description: 'Comprehensive wedding package with grand lawn, banquet hall, and bridal suites',
        inclusions: ['Lawn + AC Banquet hall (Full Day)', '3 Complimentary luxury AC rooms', 'Grand entry arch & floral stage decor', 'Professional DJ & acoustic sound system', 'Power backup generator & valet team']
      },
      {
        id: 'pkg-rp-platinum',
        name: 'Imperial Destination Experience',
        price: 165000,
        description: 'All-inclusive multi-day wedding and resort celebration with accommodation',
        inclusions: ['Complete resort takeover', '15 AC guest rooms for baraat', 'Poolside mehendi & haldi setup', 'Fireworks show clearance', 'Dedicated hospitality coordinator']
      }
    ],
    cateringPricing: {
      vegPerPlate: 950,
      nonVegPerPlate: 1250,
      outsideAllowed: false
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 25000,
      outsideAllowed: true
    },
    cancellationPolicy: '100% refund if cancelled 30 days before event. 50% refund between 15-29 days. Non-refundable under 15 days.',
    terms: [
      'Loud music permitted until 10:30 PM per local municipal guidelines.',
      'Outside alcohol requires one-day excise permit procured in advance.',
      'Firecrackers permitted only in designated open lawn zones.'
    ],
    checkInTime: '08:00 AM',
    checkOutTime: '11:00 PM',
    ownerId: 'owner-patna-1',
    ownerName: 'Vikramaditya Singh',
    ownerPhone: '+91 98350 44219',
    status: 'approved',
    isFeatured: true,
    isVerified: true,
    calendar: {
      '2026-10-02': 'booked',
      '2026-10-10': 'booked',
      '2026-10-15': 'limited',
      '2026-11-20': 'booked',
      '2026-11-25': 'booked'
    },
    createdAt: '2026-01-15'
  },
  {
    id: 'venue-delhi-1',
    name: 'The Grand Imperial Ballroom & Lawn',
    tagline: 'Magnificent destination weddings & upscale corporate summits in Chhatarpur',
    category: 'Luxury Hotel',
    rating: 4.9,
    reviewCount: 210,
    startingPrice: 120000,
    minCapacity: 150,
    maxCapacity: 1500,
    state: 'Delhi NCR',
    city: 'Delhi',
    locality: 'Chhatarpur Farms',
    pinCode: '110074',
    address: 'Main Chhatarpur Road, South Delhi, New Delhi',
    landmark: 'Adjacent to Tivoli Estate',
    coordinates: { lat: 28.5028, lng: 77.1729 },
    images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Nestled in the prime wedding corridor of South Delhi, The Grand Imperial Ballroom & Lawn represents the pinnacle of luxury celebrations. Boasting Italian marble flooring, Swarovski crystal chandeliers, temperature-controlled outdoor lawns, and master chefs crafting authentic Mughlai, Awadhi, and Continental banquets.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 450,
      guestRooms: 20
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Wi-Fi',
      'Conference Facilities',
      'Bridal Dressing Room',
      'Power Backup',
      'Wheelchair Accessible'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Reception',
      'Corporate Meeting',
      'Conference',
      'Anniversary',
      'Birthday Party'
    ],
    packages: [
      {
        id: 'pkg-delhi-corp',
        name: 'Corporate Summit Package',
        price: 120000,
        description: 'State of the art AV, projector, high speed optical Wi-Fi, and executive high-tea',
        inclusions: ['Audio visual setup with wireless lapel mics', 'Conference tech support', 'High-speed dedicated Wi-Fi', 'Executive tea/coffee lounge setup']
      },
      {
        id: 'pkg-delhi-wedding',
        name: 'Royal Delhi Dawat & Mandap',
        price: 240000,
        description: 'Complete wedding setup with custom designer floral mandap and baraat band clearance',
        inclusions: ['Lawn & Crystal Ballroom access', 'Custom floral thematic mandap', '5 Luxury guest suites', 'Red carpet welcome & Shehnai artists', 'Full acoustic sound system']
      }
    ],
    cateringPricing: {
      vegPerPlate: 1800,
      nonVegPerPlate: 2300,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 50000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Free cancellation up to 45 days before event. 60% refund up to 20 days prior.',
    terms: [
      'Government ID mandatory for all check-in guest room occupants.',
      'Valet parking mandatory for gatherings exceeding 200 guests.'
    ],
    checkInTime: '09:00 AM',
    checkOutTime: '01:00 AM',
    ownerId: 'owner-delhi-1',
    ownerName: 'Kabir Oberoi',
    ownerPhone: '+91 98110 99872',
    status: 'approved',
    isFeatured: true,
    isVerified: true,
    calendar: {
      '2026-10-18': 'booked',
      '2026-11-12': 'booked',
      '2026-11-13': 'booked',
      '2026-12-05': 'limited'
    },
    createdAt: '2026-01-10'
  },
  {
    id: 'venue-bangalore-1',
    name: 'Silicon Summit Convention & Tech Pavilion',
    tagline: 'Next-generation tech conferences, board meetings & corporate seminars',
    category: 'Conference Hall',
    rating: 4.8,
    reviewCount: 167,
    startingPrice: 38000,
    minCapacity: 25,
    maxCapacity: 600,
    state: 'Karnataka',
    city: 'Bangalore',
    locality: 'Whitefield / Outer Ring Road',
    pinCode: '560066',
    address: 'ITPB Road, Near Kundalahalli Gate, Whitefield, Bengaluru',
    landmark: 'Next to Prestige Tech Cloud',
    coordinates: { lat: 12.9698, lng: 77.7499 },
    images: [
      'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Silicon Summit Convention is Bengaluru’s premier venue designed specifically for hackathons, investor demo days, tech conferences, executive board retreats, and product unveils. Equipped with 4K laser projection, redundant gigabit optical fiber, breakout rooms, and an indoor rooftop networking terrace.',
    features: {
      indoor: true,
      outdoor: false,
      ac: true,
      parkingSlots: 180,
      guestRooms: 6
    },
    amenities: [
      'AC',
      'Parking',
      'Wi-Fi',
      'Conference Facilities',
      'Power Backup',
      'Catering',
      'Wheelchair Accessible'
    ],
    supportedEventTypes: [
      'Corporate Meeting',
      'Conference',
      'Seminar',
      'College Event',
      'Other'
    ],
    packages: [
      {
        id: 'pkg-blr-half',
        name: 'Executive Half-Day Seminar',
        price: 38000,
        description: 'Morning or afternoon business slot for up to 150 attendees',
        inclusions: ['Dual 4K Laser Projectors', 'Ultra-fast 500Mbps Wi-Fi', 'Audio mixer with 4 handheld mics', 'Tea/coffee break setup']
      },
      {
        id: 'pkg-blr-full',
        name: 'Tech Convention Full Day',
        price: 72000,
        description: 'Full day convention access with 3 breakout rooms and amphitheater stage',
        inclusions: ['Auditorium seating for 450', '3 executive breakout discussion pods', 'Live stream broadcast studio kit', 'Dedicated IT engineer on standby']
      }
    ],
    cateringPricing: {
      vegPerPlate: 650,
      nonVegPerPlate: 850,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 15000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Full refund up to 14 days prior to event. 50% refund up to 7 days prior.',
    terms: [
      'Non-smoking indoor facility.',
      'Technical rehearsals must be booked 24 hours in advance.'
    ],
    checkInTime: '08:00 AM',
    checkOutTime: '08:00 PM',
    ownerId: 'owner-blr-1',
    ownerName: 'Ananya Deshmukh',
    ownerPhone: '+91 99002 33410',
    status: 'approved',
    isFeatured: false,
    isVerified: true,
    calendar: {
      '2026-10-05': 'booked',
      '2026-10-22': 'booked'
    },
    createdAt: '2026-02-01'
  },
  {
    id: 'venue-jaipur-1',
    name: 'Maharaja Haveli & Royal Courtyard',
    tagline: 'Authentic Rajasthani heritage destination weddings with royal pomp',
    category: 'Heritage Palace',
    rating: 4.95,
    reviewCount: 318,
    startingPrice: 150000,
    minCapacity: 100,
    maxCapacity: 1000,
    state: 'Rajasthan',
    city: 'Jaipur',
    locality: 'Amer Road / Kukas',
    pinCode: '302028',
    address: 'Heritage Mile, Delhi-Jaipur Highway, Kukas, Jaipur, Rajasthan',
    landmark: '5 km past Amer Fort',
    coordinates: { lat: 26.9855, lng: 75.8513 },
    images: [
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Step into royal splendor at Maharaja Haveli. Crafted from hand-chiseled pink sandstone with jharokhas, water fountains, and sprawling bougainvillea courtyards. Experience elephant entry processions, folk Kalbelia dancers, royal royal thalis, and fireworks over the Aravalli hills.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 350,
      guestRooms: 36
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Swimming Pool',
      'Wi-Fi',
      'Bridal Dressing Room',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Engagement',
      'Reception',
      'Anniversary',
      'Family Function'
    ],
    packages: [
      {
        id: 'pkg-jpr-royal',
        name: 'Rajwada Shahi Vivah',
        price: 210000,
        description: 'Complete royal wedding experience including traditional nagada and royal welcome',
        inclusions: ['Courtyard & Sheesh Mahal ballroom access', 'Traditional Rajasthani royal welcome', 'Bridal suite + 8 guest rooms', 'Custom hand-crafted marigold & rose decor', 'Royal procession arrangement support']
      }
    ],
    cateringPricing: {
      vegPerPlate: 1400,
      nonVegPerPlate: 1800,
      outsideAllowed: false
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 60000,
      outsideAllowed: false
    },
    cancellationPolicy: 'Refundable (minus 20% processing) if cancelled 60 days before event date.',
    terms: [
      'Heritage preservation code applies; no hammering on stone walls.',
      'Traditional sound permits valid till 10 PM.'
    ],
    checkInTime: '10:00 AM',
    checkOutTime: '12:00 PM (Next Day)',
    ownerId: 'owner-jpr-1',
    ownerName: 'Thakur Ranvijay Rathore',
    ownerPhone: '+91 94140 76543',
    status: 'approved',
    isFeatured: true,
    isVerified: true,
    calendar: {
      '2026-11-15': 'booked',
      '2026-11-16': 'booked',
      '2026-11-28': 'booked',
      '2026-12-10': 'booked'
    },
    createdAt: '2026-01-05'
  },
  {
    id: 'venue-mumbai-1',
    name: 'Marine Crest Rooftop & Ocean Banquet',
    tagline: 'Breathtaking Arabian Sea views for chic receptions and corporate soirees',
    category: 'Rooftop Lounge',
    rating: 4.75,
    reviewCount: 184,
    startingPrice: 75000,
    minCapacity: 40,
    maxCapacity: 350,
    state: 'Maharashtra',
    city: 'Mumbai',
    locality: 'Worli Sea Face',
    pinCode: '400030',
    address: 'Skyline Tower, 14th Floor, Worli Sea Face, Mumbai, Maharashtra',
    landmark: 'Overlooking Bandra-Worli Sea Link',
    coordinates: { lat: 19.0178, lng: 72.8158 },
    images: [
      'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Overlooking the glittering Mumbai skyline and the Arabian Sea, Marine Crest offers an unforgettable rooftop venue for cocktail receptions, milestone birthdays, engagement bashes, and corporate networking evenings. Features glass railings, retractable weather canopy, designer bar, and ambient DJ deck.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 100,
      guestRooms: 4
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Bar / Lounge',
      'Wi-Fi',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Birthday Party',
      'Anniversary',
      'Engagement',
      'Reception',
      'Corporate Meeting',
      'Other'
    ],
    packages: [
      {
        id: 'pkg-mum-cocktail',
        name: 'Sunset Cocktail & Dinner Package',
        price: 75000,
        description: 'Prime 5-hour evening slot with panoramic Sea Link sunset view',
        inclusions: ['Exclusive rooftop deck access', 'Lounge furniture & mood lighting', 'In-house acoustic sound system', 'Valet parking assistance']
      }
    ],
    cateringPricing: {
      vegPerPlate: 1200,
      nonVegPerPlate: 1600,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 20000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Free cancellation up to 21 days prior.',
    terms: ['Outside caterers must carry FSSAI license.', 'DJ music strictly indoor after 10 PM.'],
    checkInTime: '04:00 PM',
    checkOutTime: '01:30 AM',
    ownerId: 'owner-mum-1',
    ownerName: 'Rohan Mehta',
    ownerPhone: '+91 98201 55678',
    status: 'approved',
    isFeatured: true,
    isVerified: true,
    calendar: {
      '2026-10-24': 'booked',
      '2026-10-31': 'booked'
    },
    createdAt: '2026-01-20'
  },
  {
    id: 'venue-hyderabad-1',
    name: 'Nizam Pearl Banquet & Convention Hall',
    tagline: 'Opulent halls for regal weddings, grand receptions and celebrations',
    category: 'Banquet Hall',
    rating: 4.7,
    reviewCount: 152,
    startingPrice: 55000,
    minCapacity: 100,
    maxCapacity: 1500,
    state: 'Telangana',
    city: 'Hyderabad',
    locality: 'Banjara Hills, Road No. 12',
    pinCode: '500034',
    address: 'Banjara Hills Main Road, Hyderabad, Telangana',
    landmark: 'Near Care Hospital Junction',
    coordinates: { lat: 17.4156, lng: 78.4357 },
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf6951283fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Embodying the grandeur of Hyderabadi Nawabi culture, Nizam Pearl Banquet features soaring 24-foot ceilings, exquisite brass and mirror craftsmanship, and dedicated dining halls capable of serving authentic Hyderabadi Dum Biryani and Shahi Tukda to thousands of guests with seamless hospitality.',
    features: {
      indoor: true,
      outdoor: false,
      ac: true,
      parkingSlots: 280,
      guestRooms: 10
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Wi-Fi',
      'Bridal Dressing Room',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Reception',
      'Family Function',
      'Anniversary',
      'Conference'
    ],
    packages: [
      {
        id: 'pkg-hyd-grand',
        name: 'Nawabi Grand Dawat Package',
        price: 55000,
        description: 'Complete AC banquet with separate dining and stage sections',
        inclusions: ['Main Hall + Segregated Dining Area', 'Bridal suite with makeup lighting', 'Stage lighting & crystal chandeliers', 'Power backup and generator']
      }
    ],
    cateringPricing: {
      vegPerPlate: 850,
      nonVegPerPlate: 1100,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 30000,
      outsideAllowed: true
    },
    cancellationPolicy: '50% advance non-refundable if cancelled within 20 days.',
    terms: ['Segregated dining arrangements available upon request.', 'Outside decor vendors allowed with deposit.'],
    checkInTime: '08:30 AM',
    checkOutTime: '11:30 PM',
    ownerId: 'owner-hyd-1',
    ownerName: 'Syed Moazzam Hussain',
    ownerPhone: '+91 98490 11234',
    status: 'approved',
    isFeatured: false,
    isVerified: true,
    calendar: {
      '2026-10-17': 'booked',
      '2026-11-08': 'booked'
    },
    createdAt: '2026-01-25'
  },
  {
    id: 'venue-goa-1',
    name: 'Sea Breeze Palms Beach Resort',
    tagline: 'Magical seaside destination weddings & sunset party lawns in North Goa',
    category: 'Resort',
    rating: 4.88,
    reviewCount: 226,
    startingPrice: 85000,
    minCapacity: 50,
    maxCapacity: 500,
    state: 'Goa',
    city: 'Goa',
    locality: 'Candolim / Calangute',
    pinCode: '403515',
    address: 'Sinquerim Beach Road, Candolim, Goa',
    landmark: '200m from Fort Aguada Beach',
    coordinates: { lat: 15.5186, lng: 73.7656 },
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Direct beachfront access with swaying coconut groves and soft golden sands. Sea Breeze Palms offers romantic barefoot sunset vows, poolside Sangeet nights, and breezy open lawns for dream destination weddings, reunions, and anniversary galas.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 120,
      guestRooms: 45
    },
    amenities: [
      'AC',
      'Parking',
      'Swimming Pool',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Wi-Fi',
      'Bar / Lounge',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Birthday Party',
      'Anniversary',
      'Family Function',
      'Corporate Meeting',
      'Other'
    ],
    packages: [
      {
        id: 'pkg-goa-beach',
        name: 'Sunset Beachfront Nuptials',
        price: 85000,
        description: 'Private lawn leading directly into the sandy shore with beachfront pergola',
        inclusions: ['Beachfront lawn access', 'Fairy light & cabana decor setup', 'Poolside cocktail zone', 'Bar setup & service team']
      },
      {
        id: 'pkg-goa-destination',
        name: '3-Day Goa Destination Wedding',
        price: 350000,
        description: 'Resort stay with 20 ocean-view rooms and multi-event venue bookings',
        inclusions: ['20 Deluxe sea-facing rooms for 2 nights', 'Poolside Haldi & Mehendi setup', 'Sangeet lawn & beach pheras setup', 'In-house DJ sound & console']
      }
    ],
    cateringPricing: {
      vegPerPlate: 1100,
      nonVegPerPlate: 1500,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 35000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Free cancellation up to 30 days before event date.',
    terms: ['Beach permits included in grand destination package.', 'Sound limits per Coastal Regulation Zone after 10 PM.'],
    checkInTime: '02:00 PM',
    checkOutTime: '11:00 AM',
    ownerId: 'owner-goa-1',
    ownerName: 'Dominic D’Souza',
    ownerPhone: '+91 98221 44550',
    status: 'approved',
    isFeatured: true,
    isVerified: true,
    calendar: {
      '2026-11-10': 'booked',
      '2026-11-11': 'booked',
      '2026-12-24': 'booked',
      '2026-12-31': 'booked'
    },
    createdAt: '2026-02-10'
  },
  {
    id: 'venue-delhi-farm-1',
    name: 'Green Meadows Luxury Farmhouse',
    tagline: 'Private swimming pool, rolling lawns and secluded farmhouse party retreat',
    category: 'Farmhouse',
    rating: 4.82,
    reviewCount: 96,
    startingPrice: 42000,
    minCapacity: 30,
    maxCapacity: 400,
    state: 'Delhi NCR',
    city: 'Gurgaon',
    locality: 'Sohna Road / Badshahpur',
    pinCode: '122101',
    address: 'Near Country Club, Sohna Road, Gurugram, Haryana',
    landmark: 'Off GD Goenka University Road',
    coordinates: { lat: 28.3243, lng: 77.0422 },
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'An expansive 3-acre gated farmhouse retreat designed for private birthday bashes, pool parties, intimate pre-wedding functions, and corporate offsites. Features a sparkling swimming pool, barbecue gazebo, glass-walled villa with 5 suites, and lush green lawns.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 80,
      guestRooms: 5
    },
    amenities: [
      'AC',
      'Parking',
      'Swimming Pool',
      'DJ / Music',
      'Rooms Available',
      'Wi-Fi',
      'Power Backup',
      'Catering',
      'Decoration'
    ],
    supportedEventTypes: [
      'Birthday Party',
      'Anniversary',
      'Engagement',
      'Family Function',
      'College Event',
      'Other'
    ],
    packages: [
      {
        id: 'pkg-farm-pool',
        name: 'Pool Party & Villa Day Stay',
        price: 42000,
        description: 'Exclusive 12-hour farmhouse & pool access for up to 100 guests',
        inclusions: ['Clean sanitized swimming pool access', 'Villa with 5 furnished AC bedrooms', 'Outdoor sound box & party lights', 'Barbecue grill & kitchen access']
      }
    ],
    cateringPricing: {
      vegPerPlate: 750,
      nonVegPerPlate: 950,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 15000,
      outsideAllowed: true
    },
    cancellationPolicy: '100% refund up to 10 days prior to booking.',
    terms: ['Security deposit of ₹10,000 refundable at checkout.', 'Pets allowed with prior intimation.'],
    checkInTime: '11:00 AM',
    checkOutTime: '11:00 PM',
    ownerId: 'owner-delhi-2',
    ownerName: 'Manish Tyagi',
    ownerPhone: '+91 98108 77651',
    status: 'approved',
    isFeatured: false,
    isVerified: true,
    calendar: {
      '2026-10-04': 'booked',
      '2026-10-11': 'booked'
    },
    createdAt: '2026-02-12'
  },
  {
    id: 'venue-lucknow-1',
    name: 'Avadh Darbar Grand Lawn & Banquet',
    tagline: 'Timeless Nawabi elegance and regal Awadhi culinary banquets',
    category: 'Banquet Hall',
    rating: 4.78,
    reviewCount: 115,
    startingPrice: 48000,
    minCapacity: 80,
    maxCapacity: 950,
    state: 'Uttar Pradesh',
    city: 'Lucknow',
    locality: 'Gomti Nagar Extension',
    pinCode: '226010',
    address: 'Shaheed Path, Near Ekana Stadium, Gomti Nagar, Lucknow, UP',
    landmark: 'Adjacent to Phoenix Palassio',
    coordinates: { lat: 26.8123, lng: 81.0028 },
    images: [
      'https://images.unsplash.com/photo-1545232979-fbf6951283fb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Experience Lucknow’s storied hospitality at Avadh Darbar. Featuring traditional arches, delicate jali work, massive chandelier-lit banqueting spaces, and manicured lawns. Renowned for authentic Galawati kebab, biryani, and live shehnai.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 220,
      guestRooms: 12
    },
    amenities: [
      'AC',
      'Parking',
      'Valet Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Bridal Dressing Room',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Weddings / Shaadi',
      'Engagement',
      'Reception',
      'Anniversary',
      'Family Function'
    ],
    packages: [
      {
        id: 'pkg-lko-darbar',
        name: 'Shahi Lucknowi Shaadi',
        price: 48000,
        description: 'Lawn & banquet hall with authentic royal Nawabi stage',
        inclusions: ['Lawn & Hall dual access', 'Bridal suite with private salon chair', 'Carpeted dining area', 'Full generator power backup']
      }
    ],
    cateringPricing: {
      vegPerPlate: 800,
      nonVegPerPlate: 1050,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 22000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Refundable up to 25 days before event (minus 15% booking charge).',
    terms: ['Music permissible until 10 PM outdoors, 11:30 PM inside banquet.'],
    checkInTime: '09:00 AM',
    checkOutTime: '12:00 AM',
    ownerId: 'owner-lko-1',
    ownerName: 'Naved Siddiqui',
    ownerPhone: '+91 94150 88231',
    status: 'approved',
    isFeatured: false,
    isVerified: true,
    calendar: {
      '2026-11-22': 'booked'
    },
    createdAt: '2026-02-18'
  },
  {
    id: 'venue-patna-2',
    name: 'Ganga View Banquet & Rooftop Lawn',
    tagline: 'Serene riverside ambiance for engagements, parties, and conferences',
    category: 'Banquet Hall',
    rating: 4.65,
    reviewCount: 88,
    startingPrice: 32000,
    minCapacity: 50,
    maxCapacity: 450,
    state: 'Bihar',
    city: 'Patna',
    locality: 'Fraser Road / Gandhi Maidan',
    pinCode: '800001',
    address: 'Near Dak Bungalow Crossing, Fraser Road, Patna, Bihar',
    landmark: '500m from Patna Junction',
    coordinates: { lat: 25.6125, lng: 85.1376 },
    images: [
      'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80'
    ],
    description: 'Centrally located in the commercial heart of Patna with easy railway and airport access. Features a pillarless centrally air-conditioned hall and an open terrace with breezy riverfront views, ideal for birthdays, ring ceremonies, and corporate seminars.',
    features: {
      indoor: true,
      outdoor: true,
      ac: true,
      parkingSlots: 80,
      guestRooms: 8
    },
    amenities: [
      'AC',
      'Parking',
      'Catering',
      'Decoration',
      'DJ / Music',
      'Rooms Available',
      'Wi-Fi',
      'Conference Facilities',
      'Power Backup'
    ],
    supportedEventTypes: [
      'Birthday Party',
      'Engagement',
      'Corporate Meeting',
      'Conference',
      'College Event',
      'Family Function'
    ],
    packages: [
      {
        id: 'pkg-patna-prime',
        name: 'City Center Banquet & Terrace',
        price: 32000,
        description: 'Prime 6-hour banquet hall with connected rooftop buffet terrace',
        inclusions: ['AC Banquet Hall', 'Rooftop dining space', 'Sound & podium system', 'Bridal green room']
      }
    ],
    cateringPricing: {
      vegPerPlate: 650,
      nonVegPerPlate: 850,
      outsideAllowed: true
    },
    decorationPricing: {
      inHouseAvailable: true,
      startingCost: 16000,
      outsideAllowed: true
    },
    cancellationPolicy: 'Full refund if cancelled 15 days prior.',
    terms: ['No smoking inside the air-conditioned banquet hall.'],
    checkInTime: '10:00 AM',
    checkOutTime: '11:00 PM',
    ownerId: 'owner-patna-2',
    ownerName: 'Sunil Prasad',
    ownerPhone: '+91 94310 11982',
    status: 'approved',
    isFeatured: false,
    isVerified: true,
    calendar: {
      '2026-10-09': 'booked',
      '2026-10-18': 'booked'
    },
    createdAt: '2026-02-25'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    venueId: 'venue-patna-1',
    userId: 'usr-1',
    userName: 'Rakesh Kumar',
    userCity: 'Patna',
    rating: 5,
    ratingsBreakdown: { food: 5, ambiance: 5, service: 5, value: 4 },
    comment: 'Hosted my sister’s wedding at Royal Palace Resort. The sprawling lawn and stage decoration were beyond our expectations! Guests loved the live chaat counters and Awadhi biryani. The management took care of everything seamlessly.',
    eventType: 'Weddings / Shaadi',
    eventDate: '2026-08-14',
    createdAt: '2026-08-16',
    verifiedStay: true,
    ownerResponse: {
      comment: 'Thank you so much Rakesh ji! It was our pleasure hosting your family. Wishing the newlyweds a blessed journey!',
      date: '2026-08-17'
    }
  },
  {
    id: 'rev-2',
    venueId: 'venue-delhi-1',
    userId: 'usr-2',
    userName: 'Pooja Malhotra',
    userCity: 'Delhi',
    rating: 5,
    ratingsBreakdown: { food: 5, ambiance: 5, service: 5, value: 5 },
    comment: 'Spectacular venue! The crystal chandeliers in the ballroom created the most regal backdrop for our reception. Valet parking for 400 cars handled our guests effortlessly.',
    eventType: 'Reception',
    eventDate: '2026-07-28',
    createdAt: '2026-07-30',
    verifiedStay: true
  },
  {
    id: 'rev-3',
    venueId: 'venue-bangalore-1',
    userId: 'usr-3',
    userName: 'Siddharth Rao',
    userCity: 'Bengaluru',
    rating: 4.8,
    ratingsBreakdown: { food: 4.5, ambiance: 5, service: 5, value: 5 },
    comment: 'Conducted our annual developer summit for 300 engineers. The high-speed internet never lagged once, and the dual 4K laser projectors were crisp. Ideal tech conference facility in Whitefield.',
    eventType: 'Conference',
    eventDate: '2026-08-02',
    createdAt: '2026-08-04',
    verifiedStay: true,
    ownerResponse: {
      comment: 'Glad the tech setup met your expectations, Siddharth! Looking forward to hosting your next hackathon.',
      date: '2026-08-05'
    }
  }
];
