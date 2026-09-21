import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Calendar, 
  Clock, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Download, 
  Printer, 
  ArrowRight, 
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  IndianRupee,
  FileText
} from 'lucide-react';
import { Venue, VenuePackage, Booking, BookingAddOn, EventType } from '../types';
import { formatINR, formatDateIN, POPULAR_EVENT_TYPES } from '../utils/formatters';

interface BookingModalProps {
  venue: Venue;
  initialDate?: string;
  initialPackageId?: string;
  onClose: () => void;
  onBookingSuccess: (booking: Booking) => void;
  currentUser: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export const BookingModal: React.FC<BookingModalProps> = ({
  venue,
  initialDate = '',
  initialPackageId = '',
  onClose,
  onBookingSuccess,
  currentUser
}) => {
  const [step, setStep] = useState<'details' | 'addons' | 'payment' | 'confirmation'>('details');

  // Step 1: Event specifications
  const [eventType, setEventType] = useState<EventType>('Weddings / Shaadi');
  const [eventDate, setEventDate] = useState<string>(
    initialDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [shift, setShift] = useState<'Morning (9 AM - 3 PM)' | 'Evening (6 PM - 12 AM)' | 'Full Day (9 AM - 12 AM)'>(
    'Evening (6 PM - 12 AM)'
  );
  const [guestCount, setGuestCount] = useState<number>(venue.minCapacity || 150);
  const [selectedPackageId, setSelectedPackageId] = useState<string>(
    initialPackageId || venue.packages[0]?.id || ''
  );

  // Step 2: Catering & Addons
  const [cateringType, setCateringType] = useState<'veg' | 'non_veg' | 'both' | 'none'>('both');
  const [decorationTheme, setDecorationTheme] = useState<string>('Grand Royal Floral Stage');
  const [selectedAddOns, setSelectedAddOns] = useState<BookingAddOn[]>([
    { id: 'addon-valet', name: 'Dedicated Valet Parking Team', cost: 6000 }
  ]);
  const [specialRequests, setSpecialRequests] = useState<string>('');

  // Host Details
  const [hostName, setHostName] = useState(currentUser.name);
  const [hostEmail, setHostEmail] = useState(currentUser.email);
  const [hostPhone, setHostPhone] = useState(currentUser.phone);
  const [billingAddress, setBillingAddress] = useState(`${venue.city}, India`);

  // Coupon
  const [couponCode, setCouponCode] = useState('SHUBHARAMBH');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(10000);
  const [couponMessage, setCouponMessage] = useState<string>('Promo SHUBHARAMBH applied: ₹10,000 celebration discount!');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [upiId, setUpiId] = useState('ritik@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8891');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('834');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<Booking | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Calculations
  const selectedPackage = venue.packages.find(p => p.id === selectedPackageId) || venue.packages[0];
  const packagePrice = selectedPackage ? selectedPackage.price : venue.startingPrice;

  // Catering Cost
  let plateCost = 0;
  if (cateringType === 'veg') plateCost = venue.cateringPricing.vegPerPlate;
  else if (cateringType === 'non_veg') plateCost = venue.cateringPricing.nonVegPerPlate;
  else if (cateringType === 'both') plateCost = Math.round((venue.cateringPricing.vegPerPlate + venue.cateringPricing.nonVegPerPlate) / 2) + 150;
  
  const cateringTotal = cateringType === 'none' ? 0 : plateCost * guestCount;

  // Decoration Cost
  const decorationCost = venue.decorationPricing.inHouseAvailable ? venue.decorationPricing.startingCost : 0;

  // Add-ons total
  const addOnsTotal = selectedAddOns.reduce((acc, item) => acc + item.cost, 0);

  // Subtotal, Discount, GST & Total
  const subtotal = packagePrice + cateringTotal + decorationCost + addOnsTotal;
  const taxableAmount = Math.max(0, subtotal - appliedDiscount);
  const gstAmount = Math.round(taxableAmount * 0.18); // 18% standard Indian GST for commercial banquets
  const grandTotal = taxableAmount + gstAmount;

  // Available add-ons catalog
  const availableAddons: BookingAddOn[] = [
    { id: 'addon-valet', name: 'Dedicated Valet Parking Team (5 drivers)', cost: 6000 },
    { id: 'addon-drone', name: 'Drone Photography & 4K Live Broadcast setup', cost: 15000 },
    { id: 'addon-generator', name: '100% Uninterrupted Genset Backup (Silent)', cost: 8000 },
    { id: 'addon-chaat', name: 'Live Delhi Chaat & Banarasi Paan Counter', cost: 12000 },
    { id: 'addon-rooms', name: '2 Additional Executive Guest Suites for Baraat', cost: 14000 }
  ];

  const toggleAddon = (addon: BookingAddOn) => {
    if (selectedAddOns.some(a => a.id === addon.id)) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addon.id));
    } else {
      setSelectedAddOns([...selectedAddOns, addon]);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim().toUpperCase() === 'SHUBHARAMBH') {
      setAppliedDiscount(10000);
      setCouponMessage('Promo SHUBHARAMBH applied: ₹10,000 celebration discount!');
    } else if (couponCode.trim().toUpperCase() === 'FIRSTVENUE') {
      const disc = Math.round(subtotal * 0.05);
      setAppliedDiscount(disc);
      setCouponMessage(`5% Welcome discount applied: ${formatINR(disc)}!`);
    } else {
      setAppliedDiscount(0);
      setCouponMessage('Invalid or expired coupon code.');
    }
  };

  const handleProceedToPayment = () => {
    // Check if date is booked
    if (venue.calendar[eventDate] === 'booked') {
      setErrorMessage(`Apologies, ${venue.name} is already booked on ${formatDateIN(eventDate)}. Please choose another available date.`);
      return;
    }
    setErrorMessage('');
    setStep('payment');
  };

  const handleCompleteBooking = async () => {
    setIsProcessingPayment(true);
    setErrorMessage('');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venueId: venue.id,
          venueName: venue.name,
          venueImage: venue.images[0],
          venueCity: `${venue.city}, ${venue.state}`,
          venueAddress: venue.address,
          userId: currentUser.id,
          userName: hostName,
          userEmail: hostEmail,
          userPhone: hostPhone,
          eventType,
          eventDate,
          shift,
          guestCount,
          packageId: selectedPackage?.id,
          packageName: selectedPackage?.name,
          packagePrice,
          cateringType,
          cateringPlateCost: plateCost,
          cateringTotal,
          decorationOption: decorationTheme,
          decorationCost,
          addOns: selectedAddOns,
          addOnsTotal,
          subtotal,
          discount: appliedDiscount,
          couponCode: appliedDiscount > 0 ? couponCode : undefined,
          gstAmount,
          totalAmount: grandTotal,
          paymentMethod,
          paymentDetails: {
            transactionId: `TXN-IND-${Math.floor(100000000 + Math.random() * 900000000)}`,
            upiId: paymentMethod === 'upi' ? upiId : undefined,
            cardLast4: paymentMethod === 'card' ? '8891' : undefined,
            bankName: paymentMethod === 'netbanking' ? selectedBank : undefined,
            paidAt: new Date().toISOString()
          },
          specialRequests
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete booking');
      }

      const newBooking: Booking = await response.json();
      setCreatedBooking(newBooking);
      setStep('confirmation');
      onBookingSuccess(newBooking);
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error. Please retry.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="font-display font-bold text-lg text-stone-900 flex items-center gap-2">
              <span>Book Venue: {venue.name}</span>
            </h2>
            <p className="text-xs text-stone-500">
              {venue.locality}, {venue.city} • Verified Reservation Engine
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-stone-200 hover:bg-stone-200 text-stone-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-6 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between text-xs">
          <div className={`flex items-center gap-1.5 font-bold ${step === 'details' ? 'text-amber-700' : 'text-stone-500'}`}>
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px]">1</span>
            <span>Event & Guests</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'addons' ? 'text-amber-700' : 'text-stone-500'}`}>
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px]">2</span>
            <span>Food & Add-ons</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'payment' ? 'text-amber-700' : 'text-stone-500'}`}>
            <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center text-[11px]">3</span>
            <span>Summary & Payment</span>
          </div>
          <span className="text-stone-300">→</span>
          <div className={`flex items-center gap-1.5 font-bold ${step === 'confirmation' ? 'text-emerald-700' : 'text-stone-400'}`}>
            <span className="w-5 h-5 rounded-full bg-stone-300 text-stone-700 flex items-center justify-center text-[11px]">4</span>
            <span>Receipt</span>
          </div>
        </div>

        {/* Error Notification banner */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[75vh]">
          {/* STEP 1: EVENT DETAILS */}
          {step === 'details' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label htmlFor="booking-event-type-select" className="font-bold text-stone-700 block mb-1">Occasion / Event Type</label>
                  <select
                    id="booking-event-type-select"
                    aria-label="Occasion or Event Type"
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  >
                    {POPULAR_EVENT_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="booking-event-date-input" className="font-bold text-stone-700 block mb-1">Event Date</label>
                  <input
                    id="booking-event-date-input"
                    aria-label="Event Date"
                    type="date"
                    value={eventDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                  {venue.calendar[eventDate] === 'booked' && (
                    <span className="text-[11px] text-red-600 font-semibold block mt-1">
                      ⚠️ Date is already marked booked on venue calendar!
                    </span>
                  )}
                </div>

                <div>
                  <label htmlFor="booking-shift-select" className="font-bold text-stone-700 block mb-1">Preferred Shift / Timing</label>
                  <select
                    id="booking-shift-select"
                    aria-label="Preferred Shift or Timing"
                    value={shift}
                    onChange={(e) => setShift(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  >
                    <option value="Morning (9 AM - 3 PM)">Morning Shift (09:00 AM – 03:00 PM)</option>
                    <option value="Evening (6 PM - 12 AM)">Evening Shift (06:00 PM – 12:00 AM)</option>
                    <option value="Full Day (9 AM - 12 AM)">Full Day (09:00 AM – 12:00 AM)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="booking-guest-count-input" className="font-bold text-stone-700 block mb-1">
                    Expected Number of Guests ({venue.minCapacity} – {venue.maxCapacity})
                  </label>
                  <input
                    id="booking-guest-count-input"
                    aria-label="Expected Number of Guests"
                    type="number"
                    min={venue.minCapacity}
                    max={venue.maxCapacity}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>

              {/* Package Selection */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label className="font-bold text-stone-700 text-xs block">Choose Base Venue Package</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {venue.packages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/50 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white'
                        }`}
                      >
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-stone-900">{pkg.name}</span>
                          {isSelected && <Check className="w-4 h-4 text-amber-600" />}
                        </div>
                        <div className="text-sm font-extrabold text-amber-900 mt-1">
                          {formatINR(pkg.price)}
                        </div>
                        <p className="text-[11px] text-stone-500 mt-1 line-clamp-2">{pkg.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Host Contact Information */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-700 text-xs block">Host Contact & Invoicing Information</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label htmlFor="booking-host-name-input" className="text-stone-500 font-medium block mb-1">Host Name</label>
                    <input
                      id="booking-host-name-input"
                      aria-label="Host Name"
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-host-phone-input" className="text-stone-500 font-medium block mb-1">Phone Number (+91)</label>
                    <input
                      id="booking-host-phone-input"
                      aria-label="Phone Number"
                      type="text"
                      value={hostPhone}
                      onChange={(e) => setHostPhone(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300"
                    />
                  </div>
                  <div>
                    <label htmlFor="booking-host-email-input" className="text-stone-500 font-medium block mb-1">Email Address</label>
                    <input
                      id="booking-host-email-input"
                      aria-label="Email Address"
                      type="email"
                      value={hostEmail}
                      onChange={(e) => setHostEmail(e.target.value)}
                      className="w-full p-2 rounded-lg border border-stone-300"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => setStep('addons')}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue to Food & Services</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: CATERING & ADD-ONS */}
          {step === 'addons' && (
            <div className="space-y-5">
              {/* Catering Options */}
              <div className="space-y-2">
                <span className="font-bold text-stone-700 text-xs block">
                  Catering Arrangements ({guestCount} Guests)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {[
                    { id: 'veg', label: 'Pure Veg Buffet', rate: venue.cateringPricing.vegPerPlate },
                    { id: 'non_veg', label: 'Non-Veg Buffet', rate: venue.cateringPricing.nonVegPerPlate },
                    { id: 'both', label: 'Veg & Non-Veg Deluxe', rate: Math.round((venue.cateringPricing.vegPerPlate + venue.cateringPricing.nonVegPerPlate) / 2) + 150 },
                    { id: 'none', label: 'Arranging Own Caterer', rate: 0 }
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => setCateringType(cat.id as any)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        cateringType === cat.id
                          ? 'border-amber-600 bg-amber-50 font-bold text-stone-900'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <div className="text-xs">{cat.label}</div>
                      <div className="text-sm text-amber-900 mt-1">
                        {cat.rate > 0 ? `₹${cat.rate} / plate` : '₹0'}
                      </div>
                    </div>
                  ))}
                </div>
                {cateringType !== 'none' && (
                  <p className="text-[11px] text-stone-500">
                    Estimated Catering: {guestCount} guests × ₹{plateCost} = <strong>{formatINR(cateringTotal)}</strong>
                  </p>
                )}
              </div>

              {/* Decoration Theme */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <label htmlFor="booking-decoration-theme-select" className="font-bold text-stone-700 text-xs block">Mandap & Stage Decoration Theme</label>
                <select
                  id="booking-decoration-theme-select"
                  aria-label="Mandap and Stage Decoration Theme"
                  value={decorationTheme}
                  onChange={(e) => setDecorationTheme(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50"
                >
                  <option value="Grand Royal Floral Stage">Grand Royal Floral Stage (Marigold, Rose & LED Tunnel)</option>
                  <option value="Contemporary Pastel Minimalist">Contemporary Pastel Minimalist (Lilac, Orchids & Fairy Lights)</option>
                  <option value="Traditional Rajasthani Rajwada">Traditional Rajasthani Rajwada Mandap & Drapes</option>
                  <option value="Corporate Executive Conference Setup">Corporate Executive Conference Backdrop & Podium</option>
                </select>
                <p className="text-[11px] text-stone-500">
                  Includes in-house entry gate, backdrop, stage carpets & ambient spot lights: <strong>{formatINR(decorationCost)}</strong>
                </p>
              </div>

              {/* Additional Services Checklist */}
              <div className="space-y-2 pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-700 text-xs block">Enhance Your Event with Add-on Services</span>
                <div className="space-y-2">
                  {availableAddons.map((addon) => {
                    const isChecked = selectedAddOns.some(a => a.id === addon.id);
                    return (
                      <label
                        key={addon.id}
                        className={`flex items-center justify-between p-3 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                          isChecked
                            ? 'border-amber-500 bg-amber-50/70 text-stone-900'
                            : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAddon(addon)}
                            className="accent-amber-600 rounded"
                          />
                          <span className="font-medium">{addon.name}</span>
                        </div>
                        <span className="font-bold text-amber-900">{formatINR(addon.cost)}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Special instructions */}
              <div className="pt-2 border-t border-stone-200">
                <label htmlFor="booking-special-requests-textarea" className="font-bold text-stone-700 text-xs block mb-1">Special Requests or Instructions</label>
                <textarea
                  id="booking-special-requests-textarea"
                  aria-label="Special Requests or Instructions"
                  rows={2}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Jain food counter needed, wheelchair assistance for grandparents, baraat entry timing..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs bg-stone-50"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-50 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>

                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Estimate & Pay</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PRICE BREAKDOWN & PAYMENT GATEWAY SIMULATION */}
          {step === 'payment' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left: Itemized Price Breakdown (per requirement #7 example) */}
                <div className="lg:col-span-6 bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3 text-xs">
                  <h3 className="font-display font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                    Itemized Cost Breakdown
                  </h3>

                  <div className="space-y-2 text-stone-700">
                    <div className="flex justify-between">
                      <span>Venue Package ({selectedPackage?.name}):</span>
                      <strong className="text-stone-900">{formatINR(packagePrice)}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Catering ({guestCount} guests @ ₹{plateCost}):</span>
                      <strong className="text-stone-900">{formatINR(cateringTotal)}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Mandap & Theme Decoration:</span>
                      <strong className="text-stone-900">{formatINR(decorationCost)}</strong>
                    </div>

                    <div className="flex justify-between">
                      <span>Additional Services ({selectedAddOns.length} items):</span>
                      <strong className="text-stone-900">{formatINR(addOnsTotal)}</strong>
                    </div>

                    {appliedDiscount > 0 && (
                      <div className="flex justify-between text-emerald-700 font-semibold">
                        <span>Celebration Discount ({couponCode}):</span>
                        <span>-{formatINR(appliedDiscount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-stone-500 pt-1 border-t border-stone-200">
                      <span>Subtotal before Tax:</span>
                      <span>{formatINR(taxableAmount)}</span>
                    </div>

                    <div className="flex justify-between text-stone-600">
                      <span>GST (18% Indian Hospitality Tax):</span>
                      <span>{formatINR(gstAmount)}</span>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-stone-950 pt-2 border-t-2 border-stone-300">
                      <span>Total Payable:</span>
                      <span className="text-amber-900">{formatINR(grandTotal)}</span>
                    </div>
                  </div>

                  {/* Coupon Code Input */}
                  <div className="pt-3 border-t border-stone-200">
                    <div className="flex gap-2">
                      <input
                        aria-label="Promo or Coupon Code"
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="Coupon: SHUBHARAMBH"
                        className="flex-1 p-2 rounded-lg border border-stone-300 text-xs uppercase font-bold"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800 cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>
                    {couponMessage && (
                      <p className="text-[10px] text-emerald-700 font-medium mt-1">
                        {couponMessage}
                      </p>
                    )}
                  </div>
                </div>

                {/* Right: Payment Gateway Simulation (Requirement #9: UPI, Cards, NetBanking, Wallets) */}
                <div className="lg:col-span-6 space-y-4">
                  <h3 className="font-display font-bold text-stone-900 text-sm">
                    Select Indian Payment Gateway
                  </h3>

                  {/* Gateway Tabs */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi')}
                      className={`py-2 rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'upi' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-600'
                      }`}
                    >
                      UPI
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      className={`py-2 rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'card' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-600'
                      }`}
                    >
                      Cards
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('netbanking')}
                      className={`py-2 rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'netbanking' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-600'
                      }`}
                    >
                      NetBanking
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('wallet')}
                      className={`py-2 rounded-lg transition-colors cursor-pointer ${
                        paymentMethod === 'wallet' ? 'bg-white shadow-xs text-amber-900' : 'text-stone-600'
                      }`}
                    >
                      Wallets
                    </button>
                  </div>

                  {/* 1. UPI Tab */}
                  {paymentMethod === 'upi' && (
                    <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-stone-700 font-semibold">
                        <QrCode className="w-4 h-4 text-amber-600" />
                        <span>Pay via UPI (GPay, PhonePe, Paytm, BHIM)</span>
                      </div>
                      
                      <div className="space-y-1">
                        <label htmlFor="booking-upi-vpa-input" className="text-stone-500 block text-[11px]">Enter Virtual Payment Address (VPA / UPI ID)</label>
                        <input
                          id="booking-upi-vpa-input"
                          aria-label="Virtual Payment Address (VPA / UPI ID)"
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="yourname@okhdfcbank"
                          className="w-full p-2 rounded-lg border border-stone-300 font-mono bg-white"
                        />
                      </div>

                      <div className="p-2.5 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Instant 0% transaction fee via BHIM UPI rails</span>
                      </div>
                    </div>
                  )}

                  {/* 2. Card Tab */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <div className="flex items-center gap-2 text-stone-700 font-semibold">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        <span>RuPay, Visa, MasterCard, Amex</span>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label htmlFor="booking-card-number-input" className="text-stone-500 block text-[11px]">Card Number</label>
                          <input
                            id="booking-card-number-input"
                            aria-label="Card Number"
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            className="w-full p-2 rounded-lg border border-stone-300 font-mono bg-white"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label htmlFor="booking-card-expiry-input" className="text-stone-500 block text-[11px]">Expiry</label>
                            <input
                              id="booking-card-expiry-input"
                              aria-label="Card Expiry"
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 font-mono bg-white"
                            />
                          </div>
                          <div>
                            <label htmlFor="booking-card-cvv-input" className="text-stone-500 block text-[11px]">CVV</label>
                            <input
                              id="booking-card-cvv-input"
                              aria-label="Card CVV"
                              type="password"
                              maxLength={4}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              className="w-full p-2 rounded-lg border border-stone-300 font-mono bg-white"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 3. Net Banking */}
                  {paymentMethod === 'netbanking' && (
                    <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <label htmlFor="booking-popular-banks-select" className="text-stone-500 block text-[11px]">Choose Bank</label>
                      <select
                        id="booking-popular-banks-select"
                        aria-label="Choose Bank"
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="State Bank of India">State Bank of India (SBI)</option>
                        <option value="HDFC Bank">HDFC Bank</option>
                        <option value="ICICI Bank">ICICI Bank</option>
                        <option value="Axis Bank">Axis Bank</option>
                        <option value="Punjab National Bank">Punjab National Bank (PNB)</option>
                        <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                      </select>
                    </div>
                  )}

                  {/* 4. Wallet */}
                  {paymentMethod === 'wallet' && (
                    <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-3 text-xs">
                      <p className="text-stone-600">Simulate link to Paytm Wallet or Amazon Pay balance.</p>
                      <div className="p-2.5 bg-stone-100 rounded text-stone-800 font-mono">
                        Linked Mobile: {hostPhone}
                      </div>
                    </div>
                  )}

                  {/* Pay Button */}
                  <button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleCompleteBooking}
                    className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessingPayment ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Securing Booking with Venue...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Pay {formatINR(grandTotal)} & Confirm Booking</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>256-Bit SSL Encrypted • 100% Guaranteed Booking on Date</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-start pt-2">
                <button
                  type="button"
                  onClick={() => setStep('addons')}
                  className="px-4 py-2 border border-stone-300 text-stone-700 font-semibold text-xs rounded-xl hover:bg-stone-50 cursor-pointer flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Services</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: CONFIRMATION & DOWNLOADABLE OFFICIAL RECEIPT */}
          {step === 'confirmation' && createdBooking && (
            <div className="space-y-6 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                  Booking Successfully Confirmed
                </span>
                <h3 className="text-2xl font-bold font-display text-stone-900 mt-2">
                  Your Event is Booked at {venue.name}!
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Confirmation SMS and Email sent to {createdBooking.userPhone} & {createdBooking.userEmail}
                </p>
              </div>

              {/* Printable Official GST Tax Invoice Card */}
              <div id="booking-receipt-print" className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-6 text-left max-w-xl mx-auto text-xs space-y-4 shadow-sm">
                <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                  <div>
                    <span className="font-display font-bold text-base text-stone-900">VenueBook India</span>
                    <p className="text-[10px] text-stone-500">Official GST Hospitality Tax Invoice</p>
                    <p className="text-[10px] text-stone-400">GSTIN: 10AAACV8921M1Z5</p>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-amber-900 text-xs block">Booking ID</span>
                    <span className="font-mono font-bold text-stone-800 text-sm">{createdBooking.bookingCode}</span>
                    <span className="text-[10px] text-stone-400 block">{formatDateIN(createdBooking.createdAt)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Host / Client</span>
                    <strong>{createdBooking.userName}</strong>
                    <p className="text-[11px] text-stone-500">{createdBooking.userPhone}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold block">Event Date & Shift</span>
                    <strong>{formatDateIN(createdBooking.eventDate)}</strong>
                    <p className="text-[11px] text-stone-500">{createdBooking.shift}</p>
                  </div>
                </div>

                <div className="border-t border-stone-200 pt-2 text-stone-700 space-y-1">
                  <div className="flex justify-between">
                    <span>Venue Base Package:</span>
                    <span>{formatINR(createdBooking.packagePrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Catering ({createdBooking.guestCount} Guests):</span>
                    <span>{formatINR(createdBooking.cateringTotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Decoration & Add-ons:</span>
                    <span>{formatINR(createdBooking.decorationCost + createdBooking.addOnsTotal)}</span>
                  </div>
                  {createdBooking.discount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Discount ({createdBooking.couponCode}):</span>
                      <span>-{formatINR(createdBooking.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-stone-500">
                    <span>GST (18%):</span>
                    <span>{formatINR(createdBooking.gstAmount)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-stone-900 border-t border-stone-200 pt-1 text-sm">
                    <span>Total Paid:</span>
                    <span className="text-amber-900">{formatINR(createdBooking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-stone-400 pt-1">
                    <span>Transaction Ref:</span>
                    <span className="font-mono">{createdBooking.paymentDetails.transactionId}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Done & Return to Venues
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
