import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  XCircle, 
  Star, 
  Heart, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Printer,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Booking, UserProfile, Venue, Review } from '../types';
import { formatINR, formatDateIN } from '../utils/formatters';

interface UserDashboardProps {
  currentUser: UserProfile;
  bookings: Booking[];
  savedVenues: Venue[];
  userReviews: Review[];
  onCancelBooking: (bookingId: string) => Promise<void>;
  onOpenVenue: (venue: Venue) => void;
  onLeaveReview: (venueId: string, eventType: string) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  bookings,
  savedVenues,
  userReviews,
  onCancelBooking,
  onOpenVenue,
  onLeaveReview,
  onUpdateProfile
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'bookings' | 'saved' | 'reviews' | 'profile' | 'notifications'>('bookings');
  const [selectedBookingForReceipt, setSelectedBookingForReceipt] = useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancelModalBooking, setCancelModalBooking] = useState<Booking | null>(null);

  // Profile edit states
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [city, setCity] = useState(currentUser.city);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  const upcomingBookings = bookings.filter(b => b.eventDate >= todayStr && b.bookingStatus !== 'cancelled');
  const pastBookings = bookings.filter(b => b.eventDate < todayStr || b.bookingStatus === 'cancelled');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, city });
    setProfileSuccessMsg('Profile updated successfully!');
    setTimeout(() => setProfileSuccessMsg(''), 3000);
  };

  const handleConfirmCancellation = async () => {
    if (!cancelModalBooking) return;
    setCancellingBookingId(cancelModalBooking.id);
    try {
      await onCancelBooking(cancelModalBooking.id);
      setCancelModalBooking(null);
    } catch (err) {
      console.error(err);
    } finally {
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner with User Summary */}
      <div className="bg-stone-900 rounded-3xl p-6 text-white flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-600 text-white font-bold text-2xl flex items-center justify-center shadow-md">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display">{currentUser.name}</h2>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">{currentUser.email} • {currentUser.phone} • {currentUser.city}</p>
          </div>
        </div>

        {/* Quick stats pills */}
        <div className="flex items-center gap-3 text-xs">
          <div className="bg-stone-800 px-4 py-2 rounded-xl text-center">
            <span className="text-stone-400 text-[10px] block">Bookings</span>
            <strong className="text-amber-400 text-base">{bookings.length}</strong>
          </div>
          <div className="bg-stone-800 px-4 py-2 rounded-xl text-center">
            <span className="text-stone-400 text-[10px] block">Saved</span>
            <strong className="text-red-400 text-base">{savedVenues.length}</strong>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'bookings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>My Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('saved')}
          className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'saved' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Heart className="w-3.5 h-3.5 text-red-500" />
          <span>Saved Venues ({savedVenues.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'reviews' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Star className="w-3.5 h-3.5 text-amber-500" />
          <span>My Reviews ({userReviews.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'profile' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={() => setActiveSubTab('notifications')}
          className={`px-3 py-2 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeSubTab === 'notifications' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Alerts & Notifications</span>
        </button>
      </div>

      {/* SUB-TAB 1: BOOKINGS */}
      {activeSubTab === 'bookings' && (
        <div className="space-y-6">
          {/* Upcoming Section */}
          <div className="space-y-3">
            <h3 className="font-display font-bold text-stone-900 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span>Upcoming & Active Celebrations ({upcomingBookings.length})</span>
            </h3>

            {upcomingBookings.length === 0 ? (
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 text-center text-xs text-stone-500">
                You have no upcoming bookings. Ready to plan your wedding, reception, or party?
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingBookings.map((b) => (
                  <div key={b.id} className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-stone-400 block font-bold">
                          {b.bookingCode}
                        </span>
                        <h4 className="font-bold text-stone-900 text-sm mt-0.5">{b.venueName}</h4>
                        <span className="text-stone-500 text-[11px]">{b.venueCity}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {b.bookingStatus}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-stone-50 p-2.5 rounded-xl text-stone-700">
                      <div>
                        <span className="text-[10px] text-stone-400 block">Occasion</span>
                        <strong>{b.eventType}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Date</span>
                        <strong>{formatDateIN(b.eventDate)}</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Shift Timing</span>
                        <span className="truncate block">{b.shift}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block">Paid Amount</span>
                        <strong className="text-amber-900">{formatINR(b.totalAmount)}</strong>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setSelectedBookingForReceipt(b)}
                        className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCancelModalBooking(b)}
                        className="text-red-600 hover:text-red-700 font-semibold cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past / Cancelled Bookings */}
          {pastBookings.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <h3 className="font-display font-bold text-stone-900 text-base text-stone-500">
                Completed & Cancelled Bookings ({pastBookings.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastBookings.map((b) => (
                  <div key={b.id} className="bg-stone-50/70 border border-stone-200 rounded-2xl p-4 text-xs space-y-2 opacity-90">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-stone-400">{b.bookingCode}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        b.bookingStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-stone-200 text-stone-700'
                      }`}>
                        {b.bookingStatus}
                      </span>
                    </div>
                    <div className="font-bold text-stone-800">{b.venueName}</div>
                    <div className="text-stone-500">{formatDateIN(b.eventDate)} • {formatINR(b.totalAmount)}</div>

                    {b.bookingStatus !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => onLeaveReview(b.venueId, b.eventType)}
                        className="mt-2 text-amber-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <Star className="w-3 h-3 text-amber-500" />
                        <span>Leave a Review for Venue</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: SAVED VENUES */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-stone-900 text-base">
            Your Bookmarked Venues ({savedVenues.length})
          </h3>

          {savedVenues.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-500">
              No saved venues yet. Click the heart icon on any venue card to shortlist for later.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedVenues.map((v) => (
                <div key={v.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                  <img src={v.images[0]} alt={v.name} className="w-full h-36 object-cover" />
                  <div className="p-4 space-y-2 text-xs">
                    <span className="text-amber-700 font-bold">{v.city}</span>
                    <h4 className="font-bold text-stone-900 text-sm line-clamp-1">{v.name}</h4>
                    <p className="text-stone-500 line-clamp-2">{v.tagline}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-stone-100">
                      <strong className="text-amber-900">{formatINR(v.startingPrice)}</strong>
                      <button
                        type="button"
                        onClick={() => onOpenVenue(v)}
                        className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg cursor-pointer"
                      >
                        View & Book
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: REVIEWS */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-4">
          <h3 className="font-display font-bold text-stone-900 text-base">
            Your Published Reviews ({userReviews.length})
          </h3>

          {userReviews.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-8 text-center text-xs text-stone-500">
              You have not posted any reviews yet. Completed bookings will appear here for review submission.
            </div>
          ) : (
            <div className="space-y-3">
              {userReviews.map((r) => (
                <div key={r.id} className="bg-white border border-stone-200 p-4 rounded-xl text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-4 h-4 fill-amber-500" />
                      <span>{r.rating}.0 / 5.0</span>
                    </div>
                    <span className="text-stone-400">{formatDateIN(r.createdAt)}</span>
                  </div>
                  <p className="text-stone-700">{r.comment}</p>
                  {r.ownerResponse && (
                    <div className="bg-amber-50 p-2 rounded border-l-2 border-amber-500 text-[11px] text-stone-800">
                      <strong>Owner Response:</strong> {r.ownerResponse.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PROFILE */}
      {activeSubTab === 'profile' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 max-w-lg space-y-4 text-xs">
          <h3 className="font-display font-bold text-stone-900 text-base">Edit Account Information</h3>

          {profileSuccessMsg && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{profileSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-3">
            <div>
              <label className="text-stone-600 font-bold block mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-stone-600 font-bold block mb-1">Primary Mobile (+91)</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div>
              <label className="text-stone-600 font-bold block mb-1">Home City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-xl cursor-pointer"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}

      {/* SUB-TAB 5: NOTIFICATIONS */}
      {activeSubTab === 'notifications' && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 space-y-3 text-xs max-w-xl">
          <h3 className="font-display font-bold text-stone-900 text-base">Booking & Platform Alerts</h3>
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1">
            <span className="font-bold text-amber-900 block">Upcoming Wedding Muhurat Season Alert</span>
            <p className="text-stone-700">Venues in Patna, Delhi, and Jaipur are booking up fast for November & December auspicious vivah dates. Reserve yours early.</p>
            <span className="text-[10px] text-stone-400 block">2 hours ago</span>
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
            <span className="font-bold text-emerald-900 block">Booking Confirmed & Calendar Blocked</span>
            <p className="text-stone-700">Your reservation with Royal Palace Resort & Convention has been verified with 100% date guarantee.</p>
            <span className="text-[10px] text-stone-400 block">Yesterday</span>
          </div>
        </div>
      )}

      {/* RECEIPT MODAL */}
      {selectedBookingForReceipt && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <div>
                <strong className="text-base text-stone-900 block font-display">VenueBook India</strong>
                <span className="text-stone-500 text-[10px]">Booking Receipt & GST Invoice</span>
              </div>
              <button
                onClick={() => setSelectedBookingForReceipt(null)}
                className="p-1 rounded-full text-stone-500 hover:bg-stone-100 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-stone-700">
              <div className="flex justify-between">
                <span>Booking Reference:</span>
                <strong className="font-mono">{selectedBookingForReceipt.bookingCode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Venue:</span>
                <strong>{selectedBookingForReceipt.venueName}</strong>
              </div>
              <div className="flex justify-between">
                <span>Event Date:</span>
                <strong>{formatDateIN(selectedBookingForReceipt.eventDate)}</strong>
              </div>
              <div className="flex justify-between">
                <span>Guests:</span>
                <strong>{selectedBookingForReceipt.guestCount}</strong>
              </div>
              <div className="flex justify-between border-t border-stone-200 pt-2 font-bold text-sm text-stone-900">
                <span>Total Paid:</span>
                <span className="text-amber-900">{formatINR(selectedBookingForReceipt.totalAmount)}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-bold flex items-center justify-center gap-1 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedBookingForReceipt(null)}
                className="flex-1 py-2 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CANCEL BOOKING CONFIRMATION MODAL */}
      {cancelModalBooking && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-stone-200 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
              <AlertCircle className="w-5 h-5" />
              <span>Cancel Venue Booking</span>
            </div>

            <p className="text-stone-600 leading-relaxed">
              Are you sure you want to cancel your reservation for <strong>{cancelModalBooking.venueName}</strong> on <strong>{formatDateIN(cancelModalBooking.eventDate)}</strong>?
            </p>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-[11px] text-stone-700 space-y-1">
              <span className="font-bold text-stone-900 block">Refund Calculation:</span>
              <p>Total Paid: {formatINR(cancelModalBooking.totalAmount)}</p>
              <p className="text-emerald-700 font-semibold">Estimated Refund: {formatINR(Math.round(cancelModalBooking.totalAmount * 0.85))} (after standard 15% cancellation retention fee)</p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                disabled={cancellingBookingId !== null}
                onClick={handleConfirmCancellation}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold cursor-pointer disabled:opacity-50"
              >
                {cancellingBookingId ? 'Processing Refund...' : 'Confirm Cancellation'}
              </button>
              <button
                type="button"
                onClick={() => setCancelModalBooking(null)}
                className="flex-1 py-2.5 bg-stone-100 text-stone-700 rounded-xl font-semibold hover:bg-stone-200 cursor-pointer"
              >
                Keep Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
