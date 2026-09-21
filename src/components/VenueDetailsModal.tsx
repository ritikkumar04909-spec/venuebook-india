import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Users, 
  CheckCircle, 
  ShieldCheck, 
  Calendar, 
  Clock, 
  Car, 
  Utensils, 
  Sparkles, 
  Share2, 
  Heart,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
  Phone,
  Check,
  AlertCircle
} from 'lucide-react';
import { Venue, Review } from '../types';
import { formatINR, formatDateIN } from '../utils/formatters';

interface VenueDetailsModalProps {
  venue: Venue | null;
  onClose: () => void;
  onBookNow: (venue: Venue, selectedDate?: string, selectedPackageId?: string) => void;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  reviews: Review[];
  onAddReviewClick: () => void;
}

export const VenueDetailsModal: React.FC<VenueDetailsModalProps> = ({
  venue,
  onClose,
  onBookNow,
  isSaved,
  onToggleSave,
  reviews,
  onAddReviewClick
}) => {
  if (!venue) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    venue.packages[0]?.id || ''
  );
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState<number>(new Date().getMonth());
  const [currentCalendarYear, setCurrentCalendarYear] = useState<number>(new Date().getFullYear());

  // Generate days for the interactive calendar (requirement #8: 🟢 Available, 🔴 Booked, 🟡 Limited)
  const daysInMonth = new Date(currentCalendarYear, currentCalendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentCalendarYear, currentCalendarMonth, 1).getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleNextMonth = () => {
    if (currentCalendarMonth === 11) {
      setCurrentCalendarMonth(0);
      setCurrentCalendarYear(prev => prev + 1);
    } else {
      setCurrentCalendarMonth(prev => prev + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentCalendarMonth === 0) {
      setCurrentCalendarMonth(11);
      setCurrentCalendarYear(prev => prev - 1);
    } else {
      setCurrentCalendarMonth(prev => prev - 1);
    }
  };

  const getDateStatus = (day: number) => {
    const formattedDate = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return venue.calendar[formattedDate] || 'available';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
              {venue.category}
            </span>
            {venue.isVerified && (
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified by VenueBook India
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleSave(venue.id)}
              className="p-2 rounded-full border border-stone-200 hover:bg-white text-stone-700 cursor-pointer transition-colors"
              title="Save Venue"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full border border-stone-200 hover:bg-stone-200 text-stone-700 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto max-h-[82vh] p-4 sm:p-6 space-y-8">
          {/* 1. Large Image Gallery with thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden bg-stone-100">
              <img
                src={venue.images[activeImageIndex] || venue.images[0]}
                alt={venue.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              
              {/* Image Prev/Next arrows */}
              {venue.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : venue.images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < venue.images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full font-medium">
                Photo {activeImageIndex + 1} of {venue.images.length}
              </div>
            </div>

            {/* Thumbnails row */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {venue.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-amber-600 scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Venue Header, Location, Rating & Highlights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2 space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
                {venue.name}
              </h2>
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
                <span className="flex items-center gap-1 font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {venue.rating} ({venue.reviewCount} verified reviews)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {venue.address}, {venue.locality}, {venue.city}, {venue.state} - {venue.pinCode}
                </span>
              </div>

              {venue.landmark && (
                <p className="text-xs text-stone-500 font-medium">
                  <strong>Landmark:</strong> {venue.landmark}
                </p>
              )}

              <p className="text-sm text-stone-700 leading-relaxed pt-2">
                {venue.description}
              </p>
            </div>

            {/* Quick Price & Booking sticky card */}
            <div className="bg-stone-50 p-5 rounded-2xl border border-stone-200 space-y-4">
              <div>
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">Starting Package</span>
                <div className="text-2xl font-extrabold text-amber-900 mt-0.5">
                  {formatINR(venue.startingPrice)}
                  <span className="text-xs font-normal text-stone-500"> / event</span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-stone-600 border-t border-stone-200 pt-3">
                <div className="flex justify-between">
                  <span>Guest Capacity:</span>
                  <strong className="text-stone-900">{venue.minCapacity} to {venue.maxCapacity} Guests</strong>
                </div>
                <div className="flex justify-between">
                  <span>Veg Plate:</span>
                  <strong className="text-stone-900">from ₹{venue.cateringPricing.vegPerPlate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Non-Veg Plate:</span>
                  <strong className="text-stone-900">from ₹{venue.cateringPricing.nonVegPerPlate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Parking:</span>
                  <strong className="text-stone-900">{venue.features.parkingSlots} vehicles</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onBookNow(venue, selectedDate, selectedPackageId)}
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm shadow-md shadow-amber-900/20 transition-all cursor-pointer hover:scale-[1.01]"
              >
                Book This Venue Now
              </button>
            </div>
          </div>

          {/* 3. Packages Section */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">Available Venue Packages</h3>
                <p className="text-xs text-stone-500">Transparent packages tailored for Indian weddings, parties, and summits</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {venue.packages.map((pkg) => {
                const isSelected = selectedPackageId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackageId(pkg.id)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-600 bg-amber-50/40 shadow-sm'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-stone-900 text-sm">{pkg.name}</h4>
                        {isSelected && (
                          <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <div className="text-lg font-extrabold text-amber-900">
                        {formatINR(pkg.price)}
                      </div>
                      <p className="text-xs text-stone-600">{pkg.description}</p>

                      <ul className="space-y-1.5 pt-2 border-t border-stone-200/60 text-xs text-stone-700">
                        {pkg.inclusions.map((inc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      className={`mt-4 py-1.5 px-3 rounded-lg text-xs font-semibold text-center transition-colors ${
                        isSelected
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {isSelected ? 'Package Selected' : 'Choose Package'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Interactive Live Calendar Availability (Requirement #8) */}
          <div className="space-y-3 pt-4 border-t border-stone-200">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  <span>Check Availability Calendar</span>
                </h3>
                <p className="text-xs text-stone-500">Live date statuses maintained directly by the venue management</p>
              </div>

              {/* Status Legend */}
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-stone-700">Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-stone-700">Limited</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-stone-700">Booked</span>
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 max-w-xl mx-auto">
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-700 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-bold text-sm text-stone-900">
                  {monthNames[currentCalendarMonth]} {currentCalendarYear}
                </span>
                <button
                  type="button"
                  onClick={handleNextMonth}
                  className="p-1.5 rounded-lg border border-stone-200 hover:bg-white text-stone-700 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-stone-500 mb-2">
                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5">
                {/* Empty slots before day 1 */}
                {Array.from({ length: firstDayIndex }).map((_, i) => (
                  <div key={`empty-${i}`} className="h-10" />
                ))}

                {/* Days of month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dateString = `${currentCalendarYear}-${String(currentCalendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const status = getDateStatus(day);
                  const isDateSelected = selectedDate === dateString;

                  let badgeColor = 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-300';
                  if (status === 'booked') {
                    badgeColor = 'bg-red-100 text-red-700 border-red-200 cursor-not-allowed opacity-60';
                  } else if (status === 'limited') {
                    badgeColor = 'bg-amber-100 text-amber-800 hover:bg-amber-200 border-amber-300';
                  }

                  if (isDateSelected) {
                    badgeColor = 'ring-2 ring-amber-600 bg-amber-600 text-white font-bold';
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={status === 'booked'}
                      onClick={() => setSelectedDate(dateString)}
                      className={`h-10 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center transition-all cursor-pointer ${badgeColor}`}
                    >
                      <span>{day}</span>
                      <span className="text-[9px] capitalize leading-none">
                        {status === 'available' ? 'Open' : status}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-4 p-2.5 bg-white rounded-xl border border-stone-200 text-xs flex items-center justify-between">
                  <span>Selected Date: <strong>{formatDateIN(selectedDate)}</strong></span>
                  <button
                    type="button"
                    onClick={() => onBookNow(venue, selectedDate, selectedPackageId)}
                    className="px-3 py-1 bg-amber-600 text-white rounded-lg font-semibold hover:bg-amber-700"
                  >
                    Proceed with this date
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 5. Amenities & Policies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-200 text-xs">
            {/* Amenities List */}
            <div className="space-y-2">
              <h4 className="font-bold text-stone-900 text-sm font-display">Venue Amenities & Facilities</h4>
              <div className="grid grid-cols-2 gap-2">
                {venue.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 border border-stone-200/70 text-stone-800">
                    <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shift Timings & Policies */}
            <div className="space-y-3">
              <h4 className="font-bold text-stone-900 text-sm font-display">Operating Hours & Booking Policy</h4>
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-stone-700">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Morning Shift:</span>
                  <span>09:00 AM – 03:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Evening Shift:</span>
                  <span>06:00 PM – 12:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Check-in / Check-out:</span>
                  <span>{venue.checkInTime} / {venue.checkOutTime}</span>
                </div>
                <div className="border-t border-stone-200 pt-2 text-[11px] text-stone-600">
                  <strong className="text-stone-800 block mb-0.5">Cancellation Policy:</strong>
                  {venue.cancellationPolicy}
                </div>
              </div>
            </div>
          </div>

          {/* 6. Reviews & Customer Ratings */}
          <div className="space-y-4 pt-4 border-t border-stone-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 font-display">
                  Guest Reviews ({reviews.length})
                </h3>
                <p className="text-xs text-stone-500">Genuine reviews submitted by verified patrons</p>
              </div>

              <button
                type="button"
                onClick={onAddReviewClick}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors cursor-pointer"
              >
                Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-stone-500 italic p-4 text-center bg-stone-50 rounded-xl">
                No reviews yet. Be the first to host and review this venue!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-stone-200 bg-white space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-amber-600 text-white font-bold flex items-center justify-center text-xs">
                          {rev.userName.charAt(0)}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block leading-tight">{rev.userName}</span>
                          <span className="text-[10px] text-stone-400">{rev.userCity || 'India'} • {rev.eventType}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{rev.rating}.0</span>
                      </div>
                    </div>

                    <p className="text-stone-700 leading-relaxed">{rev.comment}</p>

                    {rev.ownerResponse && (
                      <div className="mt-2 p-2.5 bg-amber-50/70 border-l-2 border-amber-600 rounded text-stone-700 text-[11px] space-y-0.5">
                        <span className="font-bold text-amber-900 block">Response from Venue Owner:</span>
                        <p>{rev.ownerResponse.comment}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Bottom CTA */}
          <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-xs text-stone-500">Selected Package Starting At:</span>
              <div className="text-xl font-bold text-amber-900">
                {formatINR(venue.packages.find(p => p.id === selectedPackageId)?.price || venue.startingPrice)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => onBookNow(venue, selectedDate, selectedPackageId)}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                Proceed to Book Venue
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
