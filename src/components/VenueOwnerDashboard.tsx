import React, { useState } from 'react';
import { 
  Building2, 
  Calendar, 
  IndianRupee, 
  Users, 
  PlusCircle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Settings, 
  Image as ImageIcon,
  Check,
  AlertCircle
} from 'lucide-react';
import { Venue, Booking, Review, VenuePackage, Amenity, EventType } from '../types';
import { formatINR, formatDateIN } from '../utils/formatters';

interface VenueOwnerDashboardProps {
  venues: Venue[];
  bookings: Booking[];
  reviews: Review[];
  onAddVenue: (venue: Partial<Venue>) => void;
  onUpdateVenueCalendar: (venueId: string, date: string, status: 'available' | 'booked' | 'limited') => void;
  onUpdateBookingStatus: (bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') => void;
  onRespondToReview: (reviewId: string, response: string) => void;
}

export const VenueOwnerDashboard: React.FC<VenueOwnerDashboardProps> = ({
  venues,
  bookings,
  reviews,
  onAddVenue,
  onUpdateVenueCalendar,
  onUpdateBookingStatus,
  onRespondToReview
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'calendar' | 'bookings' | 'register' | 'reviews'>('overview');
  const [selectedVenueId, setSelectedVenueId] = useState<string>(venues[0]?.id || '');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [replySuccess, setReplySuccess] = useState<string | null>(null);

  // New venue form state
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('Patna');
  const [newState, setNewState] = useState('Bihar');
  const [newLocality, setNewLocality] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newAddress, setNewAddress] = useState('');
  const [newPrice, setNewPrice] = useState(40000);
  const [newMinGuests, setNewMinGuests] = useState(50);
  const [newMaxGuests, setNewMaxGuests] = useState(600);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80');
  const [newCategory, setNewCategory] = useState<any>('Banquet Hall');
  const [formSuccess, setFormSuccess] = useState(false);

  // Calendar date management state
  const [blockDate, setBlockDate] = useState('');
  const [blockStatus, setBlockStatus] = useState<'available' | 'booked' | 'limited'>('booked');

  const currentVenue = venues.find(v => v.id === selectedVenueId) || venues[0];
  const venueBookings = bookings.filter(b => b.venueId === currentVenue?.id);
  const venueReviews = reviews.filter(r => r.venueId === currentVenue?.id);

  // Earnings calculation
  const totalEarnings = venueBookings
    .filter(b => b.paymentStatus === 'paid' && b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const handleCreateVenue = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVenue({
      name: newName,
      tagline: `Premier ${newCategory} for grand celebrations in ${newCity}`,
      city: newCity,
      state: newState,
      locality: newLocality,
      pinCode: newPin,
      address: newAddress,
      startingPrice: Number(newPrice),
      minCapacity: Number(newMinGuests),
      maxCapacity: Number(newMaxGuests),
      description: newDescription,
      category: newCategory,
      images: [newImageUrl],
      features: { indoor: true, outdoor: true, ac: true, parkingSlots: 100, guestRooms: 10 },
      amenities: ['AC', 'Parking', 'Catering', 'Decoration', 'DJ / Music', 'Power Backup'],
      supportedEventTypes: ['Weddings / Shaadi', 'Engagement', 'Birthday Party', 'Reception', 'Corporate Meeting'],
      packages: [
        { id: `pkg-${Date.now()}`, name: 'Standard Banquet Package', price: Number(newPrice), description: 'Complete hall access & lighting', inclusions: ['Hall access', 'Stage', 'Parking'] }
      ],
      cateringPricing: { vegPerPlate: 850, nonVegPerPlate: 1100, outsideAllowed: true },
      decorationPricing: { inHouseAvailable: true, startingCost: 20000, outsideAllowed: true },
      cancellationPolicy: 'Refundable up to 20 days prior.',
      terms: ['Standard noise curfew at 10:30 PM.'],
      checkInTime: '09:00 AM',
      checkOutTime: '11:00 PM',
      ownerId: 'owner-patna-1',
      ownerName: 'Vikramaditya Singh',
      ownerPhone: '+91 98350 44219',
      status: 'approved'
    });

    setFormSuccess(true);
    setTimeout(() => {
      setFormSuccess(false);
      setActiveTab('overview');
    }, 2000);
  };

  const handleUpdateDate = () => {
    if (!blockDate || !currentVenue) return;
    onUpdateVenueCalendar(currentVenue.id, blockDate, blockStatus);
    setBlockDate('');
  };

  const handleSendReply = (reviewId: string) => {
    const text = replyText[reviewId];
    if (!text) return;
    onRespondToReview(reviewId, text);
    setReplySuccess(reviewId);
    setTimeout(() => setReplySuccess(null), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display">Venue Partner Portal</h2>
            <p className="text-xs text-stone-400">
              Manage listings, live date availability, customer bookings & earnings across India
            </p>
          </div>
        </div>

        {/* Venue Selector Dropdown */}
        {venues.length > 0 && (
          <div className="flex items-center gap-2 text-xs">
            <label htmlFor="owner-active-venue-select" className="text-stone-400">Active Venue:</label>
            <select
              id="owner-active-venue-select"
              aria-label="Active Venue"
              value={selectedVenueId}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className="bg-stone-800 text-amber-300 font-bold px-3 py-1.5 rounded-xl border border-stone-700"
            >
              {venues.map(v => (
                <option key={v.id} value={v.id}>{v.name} ({v.city})</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'overview' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Overview & Earnings
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'calendar' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Availability Calendar
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'bookings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Customer Bookings ({venueBookings.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'reviews' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Reviews & Feedback ({venueReviews.length})
        </button>
        <button
          onClick={() => setActiveTab('register')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'register' ? 'bg-amber-600 text-white' : 'text-amber-800 bg-amber-50 hover:bg-amber-100'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Register New Venue</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & EARNINGS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 3 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Gross Booking Value</span>
              <div className="text-2xl font-extrabold text-amber-900 font-display">
                {formatINR(totalEarnings)}
              </div>
              <p className="text-[10px] text-emerald-700">100% Guaranteed payout via NEFT / RTGS</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Bookings</span>
              <div className="text-2xl font-extrabold text-stone-900 font-display">
                {venueBookings.length}
              </div>
              <p className="text-[10px] text-stone-500">{venueBookings.filter(b => b.bookingStatus === 'confirmed').length} Active Confirmed</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-xs text-stone-500 font-bold uppercase tracking-wider">Guest Rating</span>
              <div className="text-2xl font-extrabold text-stone-900 font-display flex items-center gap-1">
                <span>{currentVenue?.rating || 4.8}</span>
                <span className="text-xs font-normal text-stone-400">/ 5.0</span>
              </div>
              <p className="text-[10px] text-stone-500">{currentVenue?.reviewCount || 0} reviews received</p>
            </div>
          </div>

          {/* Active Venue Snapshot */}
          {currentVenue && (
            <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-base font-bold text-stone-900">{currentVenue.name}</h3>
                  <span className="text-stone-500">{currentVenue.address}, {currentVenue.city}, {currentVenue.state}</span>
                </div>
                <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold px-3 py-1 rounded-full uppercase text-[10px]">
                  Status: {currentVenue.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-stone-700">
                <div className="bg-stone-50 p-2.5 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Starting Base</span>
                  <strong>{formatINR(currentVenue.startingPrice)}</strong>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Guest Capacity</span>
                  <strong>{currentVenue.minCapacity} – {currentVenue.maxCapacity}</strong>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Parking Slots</span>
                  <strong>{currentVenue.features.parkingSlots} cars</strong>
                </div>
                <div className="bg-stone-50 p-2.5 rounded-xl">
                  <span className="text-stone-400 block text-[10px]">Guest Rooms</span>
                  <strong>{currentVenue.features.guestRooms} AC rooms</strong>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: AVAILABILITY CALENDAR MANAGEMENT */}
      {activeTab === 'calendar' && currentVenue && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 text-xs">
          <div>
            <h3 className="font-display font-bold text-stone-900 text-base">
              Manage Date Availability for {currentVenue.name}
            </h3>
            <p className="text-stone-500">
              Prevent double booking by marking dates as Booked, Limited, or Available.
            </p>
          </div>

          {/* Quick Date Control Form */}
          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="owner-calendar-date-input" className="font-bold text-stone-700 block mb-1">Select Date to Update</label>
              <input
                id="owner-calendar-date-input"
                aria-label="Select Date to Update"
                type="date"
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white"
              />
            </div>

            <div>
              <label htmlFor="owner-availability-status-select" className="font-bold text-stone-700 block mb-1">Availability Status</label>
              <select
                id="owner-availability-status-select"
                aria-label="Availability Status"
                value={blockStatus}
                onChange={(e) => setBlockStatus(e.target.value as any)}
                className="p-2.5 rounded-xl border border-stone-300 bg-white font-medium"
              >
                <option value="booked">🔴 Booked (Unavailable)</option>
                <option value="limited">🟡 Limited Availability</option>
                <option value="available">🟢 Available (Open)</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleUpdateDate}
              disabled={!blockDate}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl cursor-pointer disabled:opacity-50"
            >
              Update Date Status
            </button>
          </div>

          {/* Current Calendar Overrides List */}
          <div>
            <h4 className="font-bold text-stone-800 mb-2">Current Explicit Calendar Entries:</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
              {Object.entries(currentVenue.calendar).map(([d, st]) => (
                <div key={d} className="p-2.5 rounded-xl border border-stone-200 flex items-center justify-between bg-stone-50">
                  <div>
                    <span className="font-bold text-stone-900 block">{formatDateIN(d)}</span>
                    <span className={`text-[10px] font-semibold uppercase ${
                      st === 'booked' ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {st}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateVenueCalendar(currentVenue.id, d, 'available')}
                    className="text-stone-400 hover:text-red-600 cursor-pointer text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER BOOKINGS & DETAILS */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <h3 className="font-display font-bold text-stone-900 text-base">
            Client Reservations ({venueBookings.length})
          </h3>

          {venueBookings.length === 0 ? (
            <p className="text-stone-500 italic p-6 text-center">No bookings recorded for this venue yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                    <th className="py-2.5 px-3">Booking ID</th>
                    <th className="py-2.5 px-3">Client</th>
                    <th className="py-2.5 px-3">Occasion</th>
                    <th className="py-2.5 px-3">Date & Shift</th>
                    <th className="py-2.5 px-3">Guests</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {venueBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-stone-50">
                      <td className="py-3 px-3 font-mono font-bold text-stone-800">{b.bookingCode}</td>
                      <td className="py-3 px-3">
                        <strong className="block text-stone-900">{b.userName}</strong>
                        <span className="text-stone-400">{b.userPhone}</span>
                      </td>
                      <td className="py-3 px-3 font-medium">{b.eventType}</td>
                      <td className="py-3 px-3">
                        <strong className="block">{formatDateIN(b.eventDate)}</strong>
                        <span className="text-[10px] text-stone-400">{b.shift}</span>
                      </td>
                      <td className="py-3 px-3">{b.guestCount}</td>
                      <td className="py-3 px-3 font-bold text-amber-900">{formatINR(b.totalAmount)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          b.bookingStatus === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                        }`}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-1.5">
                          {b.bookingStatus === 'confirmed' && (
                            <button
                              onClick={() => onUpdateBookingStatus(b.id, 'completed')}
                              className="px-2 py-1 bg-stone-900 text-white rounded text-[10px] hover:bg-stone-800 cursor-pointer"
                            >
                              Complete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: REVIEWS & OWNER RESPONSES */}
      {activeTab === 'reviews' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <h3 className="font-display font-bold text-stone-900 text-base">
            Customer Reviews & Responses ({venueReviews.length})
          </h3>

          {venueReviews.length === 0 ? (
            <p className="text-stone-500 italic p-6 text-center">No reviews submitted yet.</p>
          ) : (
            <div className="space-y-4">
              {venueReviews.map((r) => (
                <div key={r.id} className="p-4 rounded-xl border border-stone-200 space-y-3 bg-stone-50">
                  <div className="flex justify-between items-center">
                    <div>
                      <strong className="text-stone-900 text-sm block">{r.userName} ({r.userCity})</strong>
                      <span className="text-stone-500 text-[10px]">Occasion: {r.eventType} • {formatDateIN(r.createdAt)}</span>
                    </div>
                    <span className="font-bold text-amber-600 text-sm">★ {r.rating}.0 / 5.0</span>
                  </div>

                  <p className="text-stone-700">{r.comment}</p>

                  {/* Owner Response box */}
                  {r.ownerResponse ? (
                    <div className="p-3 bg-white rounded-lg border-l-4 border-amber-600 text-stone-800 space-y-0.5">
                      <span className="font-bold text-amber-900 block">Your Response ({formatDateIN(r.ownerResponse.date)}):</span>
                      <p>{r.ownerResponse.comment}</p>
                    </div>
                  ) : (
                    <div className="pt-2 border-t border-stone-200 flex gap-2">
                      <input
                        type="text"
                        placeholder="Type polite thank-you or response to guest..."
                        value={replyText[r.id] || ''}
                        onChange={(e) => setReplyText({ ...replyText, [r.id]: e.target.value })}
                        className="flex-1 p-2 rounded-lg border border-stone-300 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendReply(r.id)}
                        className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
                      >
                        Send Reply
                      </button>
                    </div>
                  )}

                  {replySuccess === r.id && (
                    <span className="text-emerald-700 font-semibold block">Response published to public listing!</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: REGISTER NEW VENUE FORM (Requirement #11) */}
      {activeTab === 'register' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-5 text-xs max-w-2xl mx-auto">
          <div>
            <h3 className="font-display font-bold text-stone-900 text-lg">
              Register a New Venue / Resort on VenueBook India
            </h3>
            <p className="text-stone-500">
              Join India's premier banquet and hospitality booking network.
            </p>
          </div>

          {formSuccess && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Venue successfully submitted and activated in catalog!</span>
            </div>
          )}

          <form onSubmit={handleCreateVenue} className="space-y-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">Venue Name</label>
              <input
                required
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Sheesh Mahal Heritage Lawns"
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">State</label>
                <select
                  value={newState}
                  onChange={(e) => setNewState(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Delhi NCR">Delhi NCR</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Goa">Goa</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">City</label>
                <input
                  required
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="e.g. Patna, Delhi, Bangalore"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Locality / Area</label>
                <input
                  required
                  type="text"
                  value={newLocality}
                  onChange={(e) => setNewLocality(e.target.value)}
                  placeholder="e.g. Bailey Road, Whitefield"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">PIN Code</label>
                <input
                  required
                  type="text"
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="e.g. 800001"
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Full Address</label>
              <input
                required
                type="text"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                placeholder="Full street address and landmark"
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="font-bold text-stone-700 block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                >
                  <option value="Banquet Hall">Banquet Hall</option>
                  <option value="Resort">Resort</option>
                  <option value="Luxury Hotel">Luxury Hotel</option>
                  <option value="Farmhouse">Farmhouse</option>
                  <option value="Heritage Palace">Heritage Palace</option>
                  <option value="Conference Hall">Conference Hall</option>
                  <option value="Rooftop Lounge">Rooftop Lounge</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Starting Price (₹)</label>
                <input
                  required
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Max Guests</label>
                <input
                  required
                  type="number"
                  value={newMaxGuests}
                  onChange={(e) => setNewMaxGuests(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Main Cover Photo URL</label>
              <input
                type="url"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="font-bold text-stone-700 block mb-1">Venue Description</label>
              <textarea
                required
                rows={3}
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Highlight lawn size, banquet architecture, cuisines, and key advantages..."
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer text-sm"
            >
              Submit Venue for Verification
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
