import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Search, 
  Sparkles, 
  Calendar, 
  SlidersHorizontal, 
  Grid, 
  Map as MapIcon, 
  CheckCircle,
  HelpCircle,
  PhoneCall,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { 
  Venue, 
  Booking, 
  Review, 
  UserProfile, 
  SearchFilters, 
  Complaint 
} from './types';
import { INITIAL_VENUES, INITIAL_REVIEWS } from './data/initialVenues';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { FilterBar } from './components/FilterBar';
import { VenueCard } from './components/VenueCard';
import { VenueMapDiscovery } from './components/VenueMapDiscovery';
import { VenueDetailsModal } from './components/VenueDetailsModal';
import { BookingModal } from './components/BookingModal';
import { UserDashboard } from './components/UserDashboard';
import { VenueOwnerDashboard } from './components/VenueOwnerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { AiAssistantModal } from './components/AiAssistantModal';
import { ReviewModal } from './components/ReviewModal';

const DEFAULT_FILTERS: SearchFilters = {
  query: '',
  location: '',
  state: 'All',
  eventType: 'All',
  date: '',
  guests: 0,
  minPrice: 0,
  maxPrice: 500000,
  rating: 0,
  category: 'All',
  indoorOutdoor: 'all',
  acOnly: false,
  parking: false,
  swimmingPool: false,
  wifi: false,
  roomsAvailable: false,
  djMusic: false,
  cateringAvailable: false,
  conferenceFacilities: false,
  sortBy: 'popular'
};

export default function App() {
  // Navigation & Role State
  const [activeTab, setActiveTab] = useState<string>('home');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Core Data State (seeded with initial real Indian venue data, synced with /api/venues)
  const [venues, setVenues] = useState<Venue[]>(INITIAL_VENUES);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: 'comp-1',
      bookingCode: 'BK-IND-849201',
      venueName: 'Royal Palace Resort & Convention',
      userName: 'Ritik Sharma',
      userEmail: 'ritik.sharma@example.in',
      subject: 'Inquiry regarding power backup timing for Sangeet',
      description: 'Requesting confirmation that 100% DG set silent backup is operational until midnight for the baraat function.',
      status: 'resolved',
      resolution: 'Verified with venue GM: 125 kVA silent generator is dedicated on standby throughout the event duration.',
      createdAt: '2026-09-18T14:30:00Z'
    }
  ]);

  // Current User Session Simulation
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'user-patna-1',
    name: 'Ritik Sharma',
    email: 'ritik.sharma@example.in',
    phone: '+91 98765 43210',
    role: 'customer',
    city: 'Patna',
    savedVenueIds: ['venue-patna-1', 'venue-jaipur-1'],
    createdAt: '2026-01-01'
  });

  // Filter & Search State
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(DEFAULT_FILTERS);

  // Modals State
  const [selectedVenueForDetails, setSelectedVenueForDetails] = useState<Venue | null>(null);
  const [bookingVenue, setBookingVenue] = useState<Venue | null>(null);
  const [bookingInitialDate, setBookingInitialDate] = useState<string>('');
  const [bookingInitialPackageId, setBookingInitialPackageId] = useState<string>('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [reviewModalData, setReviewModalData] = useState<{
    venueId: string;
    venueName: string;
    eventType?: string;
  } | null>(null);

  // Fetch initial data from server
  useEffect(() => {
    fetch('/api/venues')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setVenues(data);
        }
      })
      .catch(err => console.error('Error fetching venues:', err));

    fetch('/api/bookings')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setBookings(data);
        }
      })
      .catch(err => console.error('Error fetching bookings:', err));

    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(err => console.error('Error fetching reviews:', err));
  }, []);

  // Filter and search logic
  const filteredVenues = useMemo(() => {
    return venues.filter((v) => {
      // Query text
      if (searchFilters.query) {
        const q = searchFilters.query.toLowerCase();
        const matchesQ = v.name.toLowerCase().includes(q) ||
          v.city.toLowerCase().includes(q) ||
          v.locality.toLowerCase().includes(q) ||
          v.tagline.toLowerCase().includes(q);
        if (!matchesQ) return false;
      }

      // Location filter (city or state or locality match)
      if (searchFilters.location) {
        const query = searchFilters.location.toLowerCase();
        const matchesLoc = 
          v.city.toLowerCase().includes(query) ||
          v.state.toLowerCase().includes(query) ||
          v.locality.toLowerCase().includes(query);
        if (!matchesLoc) return false;
      }

      // State filter
      if (searchFilters.state && searchFilters.state !== 'All') {
        if (v.state.toLowerCase() !== searchFilters.state.toLowerCase()) return false;
      }

      // Event Type filter
      if (searchFilters.eventType && searchFilters.eventType !== 'All') {
        if (!v.supportedEventTypes.includes(searchFilters.eventType as any)) {
          return false;
        }
      }

      // Guest Capacity filter
      if (searchFilters.guests && searchFilters.guests > 0) {
        if (searchFilters.guests > v.maxCapacity) {
          return false;
        }
      }

      // Date Availability filter
      if (searchFilters.date) {
        if (v.calendar[searchFilters.date] === 'booked') {
          return false;
        }
      }

      // Category filter
      if (searchFilters.category && searchFilters.category !== 'All') {
        if (v.category !== searchFilters.category) {
          return false;
        }
      }

      // Price filter
      if (searchFilters.minPrice > 0 && v.startingPrice < searchFilters.minPrice) {
        return false;
      }
      if (searchFilters.maxPrice < 500000 && v.startingPrice > searchFilters.maxPrice) {
        return false;
      }

      // Rating filter
      if (searchFilters.rating > 0 && v.rating < searchFilters.rating) {
        return false;
      }

      // Indoor / Outdoor
      if (searchFilters.indoorOutdoor === 'indoor' && !v.features.indoor) return false;
      if (searchFilters.indoorOutdoor === 'outdoor' && !v.features.outdoor) return false;

      // Amenities
      if (searchFilters.acOnly && !v.features.ac) return false;
      if (searchFilters.parking && v.features.parkingSlots < 20) return false;
      if (searchFilters.swimmingPool && !v.amenities.includes('Swimming Pool')) return false;
      if (searchFilters.wifi && !v.amenities.includes('Wi-Fi')) return false;
      if (searchFilters.roomsAvailable && v.features.guestRooms === 0) return false;
      if (searchFilters.djMusic && !v.amenities.includes('DJ / Music')) return false;
      if (searchFilters.cateringAvailable && !v.amenities.includes('Catering')) return false;
      if (searchFilters.conferenceFacilities && !v.amenities.includes('Conference Facilities')) return false;

      return true;
    }).sort((a, b) => {
      if (searchFilters.sortBy === 'price_low') return a.startingPrice - b.startingPrice;
      if (searchFilters.sortBy === 'price_high') return b.startingPrice - a.startingPrice;
      if (searchFilters.sortBy === 'rating') return b.rating - a.rating;
      if (searchFilters.sortBy === 'capacity') return b.maxCapacity - a.maxCapacity;
      // Popular / Recommended: featured first, then rating
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return b.rating - a.rating;
    });
  }, [venues, searchFilters]);

  // Saved venues handling
  const savedVenuesList = useMemo(() => {
    return venues.filter(v => currentUser.savedVenueIds.includes(v.id));
  }, [venues, currentUser.savedVenueIds]);

  const handleToggleSaveVenue = (venueId: string) => {
    setCurrentUser(prev => {
      const isSaved = prev.savedVenueIds.includes(venueId);
      return {
        ...prev,
        savedVenueIds: isSaved
          ? prev.savedVenueIds.filter(id => id !== venueId)
          : [...prev.savedVenueIds, venueId]
      };
    });
  };

  const handleSearchSubmit = (filters: Partial<SearchFilters>) => {
    setSearchFilters(prev => ({ ...prev, ...filters }));
    setActiveTab('venues');
  };

  const handleQuickSearch = (query: string, eventType?: string) => {
    setSearchFilters(prev => ({
      ...prev,
      location: query,
      query: '',
      eventType: eventType || prev.eventType
    }));
    setActiveTab('venues');
  };

  const handleViewVenueDetails = (venue: Venue) => {
    setSelectedVenueForDetails(venue);
  };

  const handleInitiateBooking = (venue: Venue, date?: string, packageId?: string) => {
    setBookingVenue(venue);
    setBookingInitialDate(date || searchFilters.date || '');
    setBookingInitialPackageId(packageId || '');
  };

  const handleBookingSuccess = (newBooking: Booking) => {
    setBookings(prev => [newBooking, ...prev]);
    // Also update local venue calendar to booked
    setVenues(prev => prev.map(v => {
      if (v.id === newBooking.venueId) {
        return {
          ...v,
          calendar: {
            ...v.calendar,
            [newBooking.eventDate]: 'booked'
          }
        };
      }
      return v;
    }));
  };

  const handleCancelBooking = async (bookingId: string) => {
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'POST' });
    if (res.ok) {
      const updated = await res.json();
      setBookings(prev => prev.map(b => b.id === bookingId ? updated : b));
    }
  };

  const handleAddVenue = async (venueData: Partial<Venue>) => {
    const res = await fetch('/api/venues', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(venueData)
    });
    if (res.ok) {
      const created = await res.json();
      setVenues(prev => [created, ...prev]);
    }
  };

  const handleUpdateVenueCalendar = async (venueId: string, date: string, status: 'available' | 'booked' | 'limited') => {
    const res = await fetch(`/api/venues/${venueId}/calendar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, status })
    });
    if (res.ok) {
      setVenues(prev => prev.map(v => {
        if (v.id === venueId) {
          return {
            ...v,
            calendar: { ...v.calendar, [date]: status }
          };
        }
        return v;
      }));
    }
  };

  const handleUpdateBookingStatus = async (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => {
    const res = await fetch(`/api/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) {
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, bookingStatus: status } : b));
    }
  };

  const handleApproveVenue = async (venueId: string) => {
    const res = await fetch(`/api/venues/${venueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' })
    });
    if (res.ok) {
      setVenues(prev => prev.map(v => v.id === venueId ? { ...v, status: 'approved' } : v));
    }
  };

  const handleRejectVenue = async (venueId: string) => {
    const res = await fetch(`/api/venues/${venueId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' })
    });
    if (res.ok) {
      setVenues(prev => prev.map(v => v.id === venueId ? { ...v, status: 'rejected' } : v));
    }
  };

  const handleToggleFeatureVenue = async (venueId: string) => {
    const venue = venues.find(v => v.id === venueId);
    if (!venue) return;
    const nextFeatured = !venue.isFeatured;

    const res = await fetch(`/api/venues/${venueId}/feature`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isFeatured: nextFeatured })
    });
    if (res.ok) {
      setVenues(prev => prev.map(v => v.id === venueId ? { ...v, isFeatured: nextFeatured } : v));
    }
  };

  const handleResolveComplaint = async (id: string, resolution: string) => {
    const res = await fetch(`/api/complaints/${id}/resolve`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resolution })
    });
    if (res.ok) {
      const updated = await res.json();
      setComplaints(prev => prev.map(c => c.id === id ? updated : c));
    }
  };

  const handleSubmitReview = async (reviewData: {
    venueId: string;
    rating: number;
    eventType: string;
    comment: string;
    photos?: string[];
  }) => {
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...reviewData,
        userId: currentUser.id,
        userName: currentUser.name,
        userCity: currentUser.city
      })
    });
    if (res.ok) {
      const created = await res.json();
      setReviews(prev => [created, ...prev]);
    }
  };

  const handleRespondToReview = async (reviewId: string, responseComment: string) => {
    const res = await fetch(`/api/reviews/${reviewId}/response`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ownerId: 'owner-patna-1',
        comment: responseComment
      })
    });
    if (res.ok) {
      const updated = await res.json();
      setReviews(prev => prev.map(r => r.id === reviewId ? updated : r));
    }
  };

  const handleRoleChange = (newRole: 'customer' | 'venue_owner' | 'admin') => {
    setCurrentUser(prev => ({ ...prev, role: newRole }));
    if (newRole === 'customer') setActiveTab('venues');
    else if (newRole === 'venue_owner') setActiveTab('owner');
    else if (newRole === 'admin') setActiveTab('admin');
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 flex flex-col selection:bg-amber-500 selection:text-white">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        onSelectRole={handleRoleChange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        savedCount={currentUser.savedVenueIds.length}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onOpenRegisterVenue={() => {
          setCurrentUser(prev => ({ ...prev, role: 'venue_owner' }));
          setActiveTab('owner');
        }}
      />

      {/* 2. Main Page Content Routing */}
      <main className="flex-1 pb-16">
        {/* VIEW 1: HOMEPAGE */}
        {activeTab === 'home' && (
          <div className="space-y-10">
            {/* Hero Search & Banner */}
            <HeroSearch
              filters={searchFilters}
              onSearch={handleSearchSubmit}
              onQuickSearch={handleQuickSearch}
              onOpenAiRecommendation={() => setIsAiModalOpen(true)}
            />

            {/* Featured Luxury & Heritage Venues Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>Curated Indian Celebrations</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-1">
                    Featured Venues & Grand Resorts
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-600">
                    Hand-picked heritage palaces, banquet halls, and open lawns verified for Indian weddings & gatherings.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('venues')}
                  className="text-xs font-bold text-amber-800 hover:text-amber-950 underline underline-offset-4 cursor-pointer"
                >
                  View All Available Venues ({venues.length}) →
                </button>
              </div>

              {/* Grid of featured venues */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {venues.slice(0, 6).map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                    onViewDetails={handleViewVenueDetails}
                    onCheckAvailability={(v) => handleViewVenueDetails(v)}
                    isSaved={currentUser.savedVenueIds.includes(venue.id)}
                    onToggleSave={handleToggleSaveVenue}
                  />
                ))}
              </div>
            </div>

            {/* Interactive India Map Teaser */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
              <div className="p-1">
                <VenueMapDiscovery
                  venues={venues}
                  onSelectVenue={handleViewVenueDetails}
                />
              </div>
            </div>

            {/* Trust & Verification Badges */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
              <div className="bg-stone-900 text-white rounded-3xl p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base font-display">100% Date Guarantee</h3>
                  <p className="text-xs text-stone-400">
                    Direct calendar sync with venue management eliminates double bookings on high-demand Vivah & Muhurat dates.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base font-display">Transparent Indian Pricing</h3>
                  <p className="text-xs text-stone-400">
                    Upfront per-plate veg/non-veg catering rates, stage decoration packages, and 18% GST tax breakdown.
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base font-display">Gemini AI Concierge</h3>
                  <p className="text-xs text-stone-400">
                    Smart recommendations by guest count and budget, catering plate calculators, and Indian wedding planning guidance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: VENUES EXPLORE / BROWSE (Grid & Map Switcher) */}
        {activeTab === 'venues' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            
            {/* Filter Bar Component */}
            <FilterBar
              filters={searchFilters}
              onChange={(updated) => setSearchFilters(prev => ({ ...prev, ...updated }))}
              onReset={() => setSearchFilters(DEFAULT_FILTERS)}
              totalMatches={filteredVenues.length}
              viewMode={viewMode}
              setViewMode={setViewMode}
            />

            {/* Content view switch */}
            {viewMode === 'grid' ? (
              filteredVenues.length === 0 ? (
                <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4 max-w-lg mx-auto">
                  <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
                    <Search className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-stone-900 text-lg">No Venues Match Your Current Filters</h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Try broadening your budget range, resetting guest count, or searching another Indian city like Patna, Delhi, or Jaipur.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSearchFilters(DEFAULT_FILTERS)}
                    className="px-5 py-2.5 bg-stone-900 text-white font-bold text-xs rounded-xl hover:bg-stone-800"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                      onViewDetails={handleViewVenueDetails}
                      onCheckAvailability={(v) => handleViewVenueDetails(v)}
                      isSaved={currentUser.savedVenueIds.includes(venue.id)}
                      onToggleSave={handleToggleSaveVenue}
                    />
                  ))}
                </div>
              )
            ) : (
              <VenueMapDiscovery
                venues={filteredVenues}
                onSelectVenue={handleViewVenueDetails}
              />
            )}
          </div>
        )}

        {/* VIEW 3: INDIA MAP DIRECT DISCOVERY */}
        {activeTab === 'map' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
            <VenueMapDiscovery
              venues={venues}
              onSelectVenue={handleViewVenueDetails}
            />
          </div>
        )}

        {/* VIEW 4: USER DASHBOARD */}
        {activeTab === 'user' && (
          <UserDashboard
            currentUser={currentUser}
            bookings={bookings}
            savedVenues={savedVenuesList}
            userReviews={reviews.filter(r => r.userId === currentUser.id)}
            onCancelBooking={handleCancelBooking}
            onOpenVenue={handleViewVenueDetails}
            onLeaveReview={(venueId, eventType) => {
              const venue = venues.find(v => v.id === venueId);
              setReviewModalData({
                venueId,
                venueName: venue?.name || 'Venue',
                eventType
              });
            }}
            onUpdateProfile={(updated) => setCurrentUser(prev => ({ ...prev, ...updated }))}
          />
        )}

        {/* VIEW 5: VENUE OWNER DASHBOARD */}
        {activeTab === 'owner' && (
          <VenueOwnerDashboard
            venues={venues}
            bookings={bookings}
            reviews={reviews}
            onAddVenue={handleAddVenue}
            onUpdateVenueCalendar={handleUpdateVenueCalendar}
            onUpdateBookingStatus={handleUpdateBookingStatus}
            onRespondToReview={handleRespondToReview}
          />
        )}

        {/* VIEW 6: SUPER ADMIN DASHBOARD */}
        {activeTab === 'admin' && (
          <AdminDashboard
            venues={venues}
            bookings={bookings}
            users={[currentUser]}
            complaints={complaints}
            onApproveVenue={handleApproveVenue}
            onRejectVenue={handleRejectVenue}
            onToggleFeatureVenue={handleToggleFeatureVenue}
            onResolveComplaint={handleResolveComplaint}
          />
        )}
      </main>

      {/* 3. Footer */}
      <footer className="bg-stone-900 text-white border-t border-stone-800 text-xs py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-base">VenueBook India</span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed">
              India's trusted online venue reservation platform for Grand Weddings, Vivah, Receptions, Corporate Summits, and Private Celebrations.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Popular Indian Hubs</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li><button onClick={() => handleSearchSubmit({ location: 'Patna' })} className="hover:text-amber-400 cursor-pointer">Patna Banquets & Resorts</button></li>
              <li><button onClick={() => handleSearchSubmit({ location: 'Delhi' })} className="hover:text-amber-400 cursor-pointer">Delhi NCR Farmhouses & Halls</button></li>
              <li><button onClick={() => handleSearchSubmit({ location: 'Jaipur' })} className="hover:text-amber-400 cursor-pointer">Jaipur Heritage Palaces</button></li>
              <li><button onClick={() => handleSearchSubmit({ location: 'Bangalore' })} className="hover:text-amber-400 cursor-pointer">Bangalore Luxury Convention Centers</button></li>
              <li><button onClick={() => handleSearchSubmit({ location: 'Goa' })} className="hover:text-amber-400 cursor-pointer">Goa Beachfront Wedding Resorts</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Celebrations Supported</h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Weddings / Shaadi & Vivah</li>
              <li>Engagement & Ring Ceremonies</li>
              <li>Sangeet, Mehendi & Haldi</li>
              <li>Corporate Seminars & Summits</li>
              <li>Birthday Parties & Anniversaries</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">Partner & Host Concierge</h4>
            <p className="text-stone-400 mb-3">
              Are you a banquet hall or resort owner? List your property and connect with thousands of families planning events.
            </p>
            <button
              type="button"
              onClick={() => {
                handleRoleChange('venue_owner');
              }}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Open Venue Partner Portal
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-stone-800 flex flex-wrap justify-between items-center text-stone-500 text-[11px] gap-2">
          <span>© {new Date().getFullYear()} VenueBook India Hospitality Technologies Pvt. Ltd. All rights reserved.</span>
          <span className="flex items-center gap-1 text-amber-500 font-medium">
            <Sparkles className="w-3 h-3" />
            Empowered by Gemini 2.5 Flash for Smart Event Planning
          </span>
        </div>
      </footer>

      {/* 4. Venue Details Modal */}
      <VenueDetailsModal
        venue={selectedVenueForDetails}
        onClose={() => setSelectedVenueForDetails(null)}
        onBookNow={(venue, date, pkgId) => {
          setSelectedVenueForDetails(null);
          handleInitiateBooking(venue, date, pkgId);
        }}
        isSaved={selectedVenueForDetails ? currentUser.savedVenueIds.includes(selectedVenueForDetails.id) : false}
        onToggleSave={handleToggleSaveVenue}
        reviews={selectedVenueForDetails ? reviews.filter(r => r.venueId === selectedVenueForDetails.id) : []}
        onAddReviewClick={() => {
          if (selectedVenueForDetails) {
            setReviewModalData({
              venueId: selectedVenueForDetails.id,
              venueName: selectedVenueForDetails.name,
              eventType: 'Weddings / Shaadi'
            });
          }
        }}
      />

      {/* 5. Booking Flow Modal */}
      {bookingVenue && (
        <BookingModal
          venue={bookingVenue}
          initialDate={bookingInitialDate}
          initialPackageId={bookingInitialPackageId}
          onClose={() => setBookingVenue(null)}
          onBookingSuccess={handleBookingSuccess}
          currentUser={currentUser}
        />
      )}

      {/* 6. Gemini AI Assistant & Recommender Modal */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onSelectVenue={(v) => {
          setIsAiModalOpen(false);
          handleViewVenueDetails(v);
        }}
        venues={venues}
      />

      {/* 7. Customer Review Submission Modal */}
      {reviewModalData && (
        <ReviewModal
          isOpen={true}
          venueId={reviewModalData.venueId}
          venueName={reviewModalData.venueName}
          initialEventType={reviewModalData.eventType}
          onClose={() => setReviewModalData(null)}
          onSubmitReview={handleSubmitReview}
        />
      )}

    </div>
  );
}
