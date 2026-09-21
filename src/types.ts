export type EventType =
  | 'Weddings / Shaadi'
  | 'Engagement'
  | 'Birthday Party'
  | 'Anniversary'
  | 'Corporate Meeting'
  | 'Conference'
  | 'Seminar'
  | 'College Event'
  | 'Family Function'
  | 'Reception'
  | 'Other';

export type VenueCategory =
  | 'Banquet Hall'
  | 'Resort'
  | 'Luxury Hotel'
  | 'Farmhouse'
  | 'Heritage Palace'
  | 'Conference Hall'
  | 'Rooftop Lounge'
  | 'Open Lawn';

export type Amenity =
  | 'AC'
  | 'Parking'
  | 'Catering'
  | 'Decoration'
  | 'DJ / Music'
  | 'Rooms Available'
  | 'Swimming Pool'
  | 'Wi-Fi'
  | 'Conference Facilities'
  | 'Valet Parking'
  | 'Bridal Dressing Room'
  | 'Power Backup'
  | 'Bar / Lounge'
  | 'Wheelchair Accessible';

export interface VenuePackage {
  id: string;
  name: string;
  price: number;
  description: string;
  inclusions: string[];
}

export interface Venue {
  id: string;
  name: string;
  tagline: string;
  category: VenueCategory;
  rating: number;
  reviewCount: number;
  startingPrice: number;
  minCapacity: number;
  maxCapacity: number;
  state: string;
  city: string;
  locality: string;
  pinCode: string;
  address: string;
  landmark: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  images: string[];
  description: string;
  features: {
    indoor: boolean;
    outdoor: boolean;
    ac: boolean;
    parkingSlots: number;
    guestRooms: number;
  };
  amenities: Amenity[];
  supportedEventTypes: EventType[];
  packages: VenuePackage[];
  cateringPricing: {
    vegPerPlate: number;
    nonVegPerPlate: number;
    outsideAllowed: boolean;
  };
  decorationPricing: {
    inHouseAvailable: boolean;
    startingCost: number;
    outsideAllowed: boolean;
  };
  cancellationPolicy: string;
  terms: string[];
  checkInTime: string;
  checkOutTime: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  status: 'approved' | 'pending' | 'rejected';
  isFeatured?: boolean;
  isVerified?: boolean;
  calendar: Record<string, 'available' | 'booked' | 'limited'>; // YYYY-MM-DD
  createdAt: string;
}

export interface BookingAddOn {
  id: string;
  name: string;
  cost: number;
}

export interface Booking {
  id: string;
  bookingCode: string;
  venueId: string;
  venueName: string;
  venueImage: string;
  venueCity: string;
  venueAddress: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  eventType: EventType;
  eventDate: string; // YYYY-MM-DD
  shift: 'Morning (9 AM - 3 PM)' | 'Evening (6 PM - 12 AM)' | 'Full Day (9 AM - 12 AM)';
  guestCount: number;
  packageId: string;
  packageName: string;
  packagePrice: number;
  cateringType: 'veg' | 'non_veg' | 'both' | 'none';
  cateringPlateCost: number;
  cateringTotal: number;
  decorationOption: string;
  decorationCost: number;
  addOns: BookingAddOn[];
  addOnsTotal: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  gstAmount: number; // 18% standard Indian GST for hospitality
  totalAmount: number;
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'wallet';
  paymentDetails: {
    transactionId: string;
    upiId?: string;
    cardLast4?: string;
    bankName?: string;
    paidAt: string;
  };
  bookingStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  specialRequests?: string;
  createdAt: string;
}

export interface Review {
  id: string;
  venueId: string;
  userId: string;
  userName: string;
  userCity?: string;
  userAvatar?: string;
  rating: number;
  ratingsBreakdown: {
    food: number;
    ambiance: number;
    service: number;
    value: number;
  };
  comment: string;
  eventType: string;
  eventDate: string;
  createdAt: string;
  verifiedStay: boolean;
  ownerResponse?: {
    comment: string;
    date: string;
  };
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  role: 'customer' | 'venue_owner' | 'admin';
  savedVenueIds: string[];
  isBlocked?: boolean;
  createdAt: string;
}

export interface Complaint {
  id: string;
  bookingCode: string;
  venueName: string;
  userName: string;
  userEmail: string;
  subject: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved';
  resolution?: string;
  bookingId?: string;
  createdAt: string;
}

export interface SearchFilters {
  query: string;
  location: string;
  state: string;
  eventType: string;
  date: string;
  guests: number;
  minPrice: number;
  maxPrice: number;
  rating: number;
  category: string;
  indoorOutdoor: 'all' | 'indoor' | 'outdoor';
  acOnly: boolean;
  parking: boolean;
  swimmingPool: boolean;
  wifi: boolean;
  roomsAvailable: boolean;
  djMusic: boolean;
  cateringAvailable: boolean;
  conferenceFacilities: boolean;
  sortBy: 'popular' | 'price_low' | 'price_high' | 'rating' | 'capacity';
}
