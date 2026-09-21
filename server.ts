import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { INITIAL_VENUES, INITIAL_REVIEWS } from './src/data/initialVenues.ts';
import { Venue, Booking, Review, Complaint, UserProfile } from './src/types.ts';

dotenv.config();

const PORT = 3000;

// Lazy initialization of Gemini API
let aiClient: GoogleGenAI | null = null;
function getGemini(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// In-memory data store seeded with initial Indian venues
let venues: Venue[] = [...INITIAL_VENUES];
let reviews: Review[] = [...INITIAL_REVIEWS];

let bookings: Booking[] = [
  {
    id: 'book-demo-1',
    bookingCode: 'VB-2026-IND-7421',
    venueId: 'venue-patna-1',
    venueName: 'Royal Palace Resort & Convention',
    venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
    venueCity: 'Patna, Bihar',
    venueAddress: 'Near Saguna More, Danapur Khagaul Road, Patna',
    userId: 'usr-ritik',
    userName: 'Ritik Kumar',
    userEmail: 'ritikkumar04909@gmail.com',
    userPhone: '+91 98351 22345',
    eventType: 'Weddings / Shaadi',
    eventDate: '2026-11-20',
    shift: 'Evening (6 PM - 12 AM)',
    guestCount: 450,
    packageId: 'pkg-rp-gold',
    packageName: 'Royal Shaadi Grand Package',
    packagePrice: 95000,
    cateringType: 'both',
    cateringPlateCost: 1100,
    cateringTotal: 495000,
    decorationOption: 'Royal Floral Stage & Entrance Theme',
    decorationCost: 35000,
    addOns: [
      { id: 'addon-1', name: 'Drone Photography & Live Stream', cost: 15000 },
      { id: 'addon-2', name: 'Valet Parking Team (5 drivers)', cost: 6000 }
    ],
    addOnsTotal: 21000,
    subtotal: 646000,
    discount: 25000,
    couponCode: 'SHUBHARAMBH',
    gstAmount: 111780, // 18%
    totalAmount: 732780,
    paymentMethod: 'upi',
    paymentDetails: {
      transactionId: 'UPI-AXIS-9823419087',
      upiId: 'ritik@okaxis',
      paidAt: '2026-09-18T14:32:00Z'
    },
    bookingStatus: 'confirmed',
    paymentStatus: 'paid',
    specialRequests: 'Special pure veg buffet counter on the left side of the lawn for elders.',
    createdAt: '2026-09-18T14:30:00Z'
  }
];

let complaints: Complaint[] = [
  {
    id: 'comp-1',
    bookingCode: 'VB-2026-IND-7421',
    venueName: 'Royal Palace Resort & Convention',
    userName: 'Ritik Kumar',
    userEmail: 'ritikkumar04909@gmail.com',
    subject: 'Inquiry regarding DJ permission extension past 10:30 PM',
    description: 'Wanted to check if indoor banquet hall sound system can operate till 11:30 PM with low decibels.',
    status: 'resolved',
    createdAt: '2026-09-19T10:00:00Z'
  }
];

let users: UserProfile[] = [
  {
    id: 'usr-ritik',
    name: 'Ritik Kumar',
    email: 'ritikkumar04909@gmail.com',
    phone: '+91 98351 22345',
    city: 'Patna',
    role: 'customer',
    savedVenueIds: ['venue-patna-1', 'venue-delhi-1', 'venue-jaipur-1'],
    createdAt: '2026-01-10'
  },
  {
    id: 'owner-patna-1',
    name: 'Vikramaditya Singh',
    email: 'royalpalace@patnavenues.com',
    phone: '+91 98350 44219',
    city: 'Patna',
    role: 'venue_owner',
    savedVenueIds: [],
    createdAt: '2026-01-15'
  },
  {
    id: 'admin-1',
    name: 'Platform Administrator',
    email: 'admin@venuebookindia.in',
    phone: '+91 98111 00000',
    city: 'New Delhi',
    role: 'admin',
    savedVenueIds: [],
    createdAt: '2025-12-01'
  }
];

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // --- Venues API ---
  app.get('/api/venues', (req, res) => {
    let result = [...venues];

    const {
      q,
      location,
      state,
      city,
      eventType,
      date,
      minGuests,
      maxGuests,
      minPrice,
      maxPrice,
      category,
      indoor,
      outdoor,
      ac,
      parking,
      swimmingPool,
      wifi,
      roomsAvailable,
      djMusic,
      conferenceFacilities,
      rating,
      sortBy
    } = req.query;

    if (q) {
      const searchTerm = String(q).toLowerCase();
      result = result.filter(v =>
        v.name.toLowerCase().includes(searchTerm) ||
        v.city.toLowerCase().includes(searchTerm) ||
        v.locality.toLowerCase().includes(searchTerm) ||
        v.state.toLowerCase().includes(searchTerm) ||
        v.pinCode.includes(searchTerm) ||
        v.description.toLowerCase().includes(searchTerm)
      );
    }

    if (location) {
      const locTerm = String(location).toLowerCase();
      result = result.filter(v =>
        v.city.toLowerCase().includes(locTerm) ||
        v.locality.toLowerCase().includes(locTerm) ||
        v.state.toLowerCase().includes(locTerm) ||
        v.pinCode.includes(locTerm)
      );
    }

    if (state && state !== 'All') {
      result = result.filter(v => v.state.toLowerCase() === String(state).toLowerCase());
    }

    if (city && city !== 'All') {
      result = result.filter(v => v.city.toLowerCase().includes(String(city).toLowerCase()));
    }

    if (category && category !== 'All') {
      result = result.filter(v => v.category === category);
    }

    if (eventType && eventType !== 'All') {
      result = result.filter(v => v.supportedEventTypes.includes(eventType as any));
    }

    if (minGuests) {
      result = result.filter(v => v.maxCapacity >= Number(minGuests));
    }

    if (minPrice) {
      result = result.filter(v => v.startingPrice >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter(v => v.startingPrice <= Number(maxPrice));
    }

    if (rating) {
      result = result.filter(v => v.rating >= Number(rating));
    }

    if (indoor === 'true') {
      result = result.filter(v => v.features.indoor);
    }
    if (outdoor === 'true') {
      result = result.filter(v => v.features.outdoor);
    }
    if (ac === 'true') {
      result = result.filter(v => v.features.ac);
    }
    if (parking === 'true') {
      result = result.filter(v => v.amenities.includes('Parking') || v.amenities.includes('Valet Parking'));
    }
    if (swimmingPool === 'true') {
      result = result.filter(v => v.amenities.includes('Swimming Pool'));
    }
    if (wifi === 'true') {
      result = result.filter(v => v.amenities.includes('Wi-Fi'));
    }
    if (roomsAvailable === 'true') {
      result = result.filter(v => v.features.guestRooms > 0 || v.amenities.includes('Rooms Available'));
    }
    if (djMusic === 'true') {
      result = result.filter(v => v.amenities.includes('DJ / Music'));
    }
    if (conferenceFacilities === 'true') {
      result = result.filter(v => v.amenities.includes('Conference Facilities'));
    }

    if (date) {
      const targetDate = String(date);
      // Filter out venues explicitly booked on this date
      result = result.filter(v => v.calendar[targetDate] !== 'booked');
    }

    // Sorting
    if (sortBy === 'price_low') {
      result.sort((a, b) => a.startingPrice - b.startingPrice);
    } else if (sortBy === 'price_high') {
      result.sort((a, b) => b.startingPrice - a.startingPrice);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'capacity') {
      result.sort((a, b) => b.maxCapacity - a.maxCapacity);
    } else {
      // Default: featured first, then rating
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.rating - a.rating);
    }

    res.json(result);
  });

  app.get('/api/venues/:id', (req, res) => {
    const venue = venues.find(v => v.id === req.params.id);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    const venueReviews = reviews.filter(r => r.venueId === venue.id);
    res.json({ ...venue, reviews: venueReviews });
  });

  app.post('/api/venues', (req, res) => {
    const newVenue: Venue = {
      ...req.body,
      id: `venue-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
      status: req.body.status || 'pending',
      calendar: req.body.calendar || {},
      createdAt: new Date().toISOString().split('T')[0]
    };
    venues.unshift(newVenue);
    res.status(201).json(newVenue);
  });

  app.put('/api/venues/:id', (req, res) => {
    const index = venues.findIndex(v => v.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    venues[index] = { ...venues[index], ...req.body };
    res.json(venues[index]);
  });

  app.delete('/api/venues/:id', (req, res) => {
    venues = venues.filter(v => v.id !== req.params.id);
    res.json({ success: true, message: 'Venue deleted' });
  });

  // Calendar availability management
  app.post('/api/venues/:id/calendar', (req, res) => {
    const venue = venues.find(v => v.id === req.params.id);
    if (!venue) return res.status(404).json({ error: 'Venue not found' });

    const { date, status } = req.body; // status: 'available' | 'booked' | 'limited'
    if (!date) return res.status(400).json({ error: 'Date is required' });

    if (status === 'available') {
      delete venue.calendar[date];
    } else {
      venue.calendar[date] = status;
    }
    res.json({ success: true, calendar: venue.calendar });
  });

  // --- Bookings API ---
  app.get('/api/bookings', (req, res) => {
    const { userId, venueId } = req.query;
    let result = [...bookings];
    if (userId) {
      result = result.filter(b => b.userId === userId);
    }
    if (venueId) {
      result = result.filter(b => b.venueId === venueId);
    }
    res.json(result);
  });

  app.post('/api/bookings', (req, res) => {
    const bookingData = req.body;
    const venue = venues.find(v => v.id === bookingData.venueId);
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }

    // Check availability to prevent double-booking
    if (venue.calendar[bookingData.eventDate] === 'booked') {
      return res.status(409).json({ error: 'This venue is already booked for the selected date.' });
    }

    const newBooking: Booking = {
      ...bookingData,
      id: `book-${Date.now()}`,
      bookingCode: `VB-2026-IND-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      createdAt: new Date().toISOString()
    };

    // Mark venue calendar as booked for that date
    venue.calendar[bookingData.eventDate] = 'booked';

    bookings.unshift(newBooking);
    res.status(201).json(newBooking);
  });

  app.patch('/api/bookings/:id/cancel', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Free up the venue calendar
    const venue = venues.find(v => v.id === booking.venueId);
    if (venue && venue.calendar[booking.eventDate] === 'booked') {
      delete venue.calendar[booking.eventDate];
    }

    res.json(booking);
  });

  app.patch('/api/bookings/:id/status', (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });

    booking.bookingStatus = req.body.status;
    res.json(booking);
  });

  // --- Reviews API ---
  app.get('/api/reviews/:venueId', (req, res) => {
    const venueReviews = reviews.filter(r => r.venueId === req.params.venueId);
    res.json(venueReviews);
  });

  app.post('/api/reviews', (req, res) => {
    const { venueId, userId, userName, userCity, rating, ratingsBreakdown, comment, eventType, eventDate } = req.body;
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      venueId,
      userId,
      userName: userName || 'Guest User',
      userCity: userCity || 'India',
      rating: Number(rating) || 5,
      ratingsBreakdown: ratingsBreakdown || { food: 5, ambiance: 5, service: 5, value: 5 },
      comment,
      eventType: eventType || 'Celebration',
      eventDate: eventDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      verifiedStay: true
    };

    reviews.unshift(newReview);

    // Update venue rating
    const venue = venues.find(v => v.id === venueId);
    if (venue) {
      const venueReviews = reviews.filter(r => r.venueId === venueId);
      const avg = venueReviews.reduce((acc, r) => acc + r.rating, 0) / venueReviews.length;
      venue.rating = Number(avg.toFixed(1));
      venue.reviewCount = venueReviews.length;
    }

    res.status(201).json(newReview);
  });

  app.post('/api/reviews/:id/response', (req, res) => {
    const review = reviews.find(r => r.id === req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    review.ownerResponse = {
      comment: req.body.comment,
      date: new Date().toISOString().split('T')[0]
    };
    res.json(review);
  });

  // --- Complaints API ---
  app.get('/api/complaints', (req, res) => {
    res.json(complaints);
  });

  app.post('/api/complaints', (req, res) => {
    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      ...req.body,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    complaints.unshift(newComplaint);
    res.status(201).json(newComplaint);
  });

  app.patch('/api/complaints/:id', (req, res) => {
    const comp = complaints.find(c => c.id === req.params.id);
    if (!comp) return res.status(404).json({ error: 'Complaint not found' });
    comp.status = req.body.status;
    res.json(comp);
  });

  // --- Admin Analytics API ---
  app.get('/api/admin/stats', (req, res) => {
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.bookingStatus === 'confirmed');
    const totalGMV = bookings.reduce((sum, b) => (b.paymentStatus === 'paid' ? sum + b.totalAmount : sum), 0);
    const platformCommission = Math.round(totalGMV * 0.10); // 10% platform fee
    const activeVenues = venues.filter(v => v.status === 'approved').length;
    const pendingVenues = venues.filter(v => v.status === 'pending').length;

    res.json({
      totalBookings,
      confirmedCount: confirmedBookings.length,
      totalGMV,
      platformCommission,
      activeVenues,
      pendingVenues,
      complaintsCount: complaints.filter(c => c.status === 'open').length,
      citiesCovered: Array.from(new Set(venues.map(v => v.city))).length
    });
  });

  // --- Users API ---
  app.get('/api/users', (req, res) => {
    res.json(users);
  });

  app.patch('/api/users/:id/block', (req, res) => {
    const u = users.find(user => user.id === req.params.id);
    if (!u) return res.status(404).json({ error: 'User not found' });
    u.isBlocked = req.body.isBlocked;
    res.json(u);
  });

  // --- AI Features with @google/genai (model: gemini-3.8-flash) ---
  app.post('/api/ai/recommend', async (req, res) => {
    const { prompt, location, eventType, budget, guestCount } = req.body;
    const gemini = getGemini();

    const venuesSummary = venues
      .filter(v => v.status === 'approved')
      .map(v => ({
        id: v.id,
        name: v.name,
        city: v.city,
        locality: v.locality,
        state: v.state,
        startingPrice: v.startingPrice,
        minCapacity: v.minCapacity,
        maxCapacity: v.maxCapacity,
        supportedEvents: v.supportedEventTypes,
        amenities: v.amenities,
        rating: v.rating,
        tagline: v.tagline
      }));

    if (gemini) {
      try {
        const aiPrompt = `You are the lead Indian hospitality and venue specialist for "VenueBook India".
A user asked: "${prompt || `Looking for ${eventType || 'event'} venue in ${location || 'India'} for ${guestCount || 200} guests within ₹${budget || 100000}`}".

Here is the current live catalog of venues in India:
${JSON.stringify(venuesSummary, null, 2)}

Recommend the top 1 to 3 best matching venues from the catalog above.
Return a valid JSON object matching this schema strictly:
{
  "recommendations": [
    {
      "venueId": "id-from-catalog",
      "matchScore": 95,
      "highlightReason": "Why this venue fits the location, budget, capacity, and event type",
      "budgetAnalysis": "Estimated cost breakdown analysis for the user query",
      "proTip": "Useful tip about this venue (catering, lawn setup, or timing)"
    }
  ],
  "expertAdvice": "Warm, professional hospitality advice regarding Indian event planning, auspicious dates/muhurat or guest management."
}`;

        const response = await gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: aiPrompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          return res.json(parsed);
        }
      } catch (err) {
        console.error('Gemini recommend error, executing robust heuristic matcher:', err);
      }
    }

    // Algorithmic Fallback Recommender (always reliable)
    const userQuery = (prompt || `${location || ''} ${eventType || ''}`).toLowerCase();
    const ranked = venues
      .filter(v => v.status === 'approved')
      .map(v => {
        let score = 70;
        if (location && (v.city.toLowerCase().includes(location.toLowerCase()) || v.state.toLowerCase().includes(location.toLowerCase()))) {
          score += 25;
        } else if (userQuery.includes(v.city.toLowerCase())) {
          score += 25;
        }
        if (eventType && v.supportedEventTypes.includes(eventType as any)) {
          score += 20;
        }
        if (guestCount && guestCount >= v.minCapacity && guestCount <= v.maxCapacity) {
          score += 15;
        }
        if (budget && v.startingPrice <= Number(budget)) {
          score += 15;
        }
        return {
          venueId: v.id,
          matchScore: Math.min(score, 99),
          highlightReason: `Prime choice in ${v.city} accommodating ${v.minCapacity}-${v.maxCapacity} guests with renowned in-house hospitality and amenities like ${v.amenities.slice(0, 3).join(', ')}.`,
          budgetAnalysis: `Starting packages at ₹${v.startingPrice.toLocaleString('en-IN')}, well aligned with standard Indian celebration budgets.`,
          proTip: 'Book at least 30-45 days ahead during auspicious Vivah Muhurat peak dates.'
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    res.json({
      recommendations: ranked,
      expertAdvice: `For ${eventType || 'events'} in ${location || 'India'}, we recommend finalizing your guest list early to optimize catering plate pricing and reserving the morning or evening shift according to ritual muhurat timings.`
    });
  });

  // Interactive AI Event Assistant
  app.post('/api/ai/assistant', async (req, res) => {
    const { message, history } = req.body;
    const gemini = getGemini();

    const systemContext = `You are 'ShubhAayojan AI', the dedicated event and venue concierge for 'VenueBook India'.
You help users plan weddings, corporate summits, birthday bashes, and family functions across India (Patna, Delhi NCR, Bangalore, Mumbai, Jaipur, Hyderabad, Goa, Lucknow, etc.).
Guide them with realistic Indian hospitality metrics:
- Average veg plate ₹650 - ₹1,800, non-veg plate ₹850 - ₹2,500
- Recommended venue budget: 40% of total budget
- Catering: 35%, Decor: 15%, Sound & Add-ons: 10%
- Highlight famous venues on VenueBook India like Royal Palace Resort (Patna), Grand Imperial Ballroom (Delhi), Maharaja Haveli (Jaipur), Silicon Summit (Bangalore).
Be courteous, concise, knowledgeable, and distinctly Indian hospitality oriented.`;

    if (gemini) {
      try {
        const response = await gemini.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `${systemContext}\n\nUser: ${message}`,
        });
        return res.json({ reply: response.text });
      } catch (err) {
        console.error('Gemini assistant error:', err);
      }
    }

    // Fallback conversational reply
    const lower = (message || '').toLowerCase();
    let reply = `Namaste! I'd love to help you plan your event on VenueBook India. `;
    if (lower.includes('patna') || lower.includes('bihar')) {
      reply += `For Patna, we highly recommend **Royal Palace Resort & Convention** on Bailey Road for grand weddings up to 1,200 guests, or **Ganga View Banquet** near Fraser Road for central corporate seminars and ring ceremonies.`;
    } else if (lower.includes('delhi') || lower.includes('ncr')) {
      reply += `In Delhi NCR, **The Grand Imperial Ballroom** in Chhatarpur is perfect for luxury weddings, while **Green Meadows Farmhouse** in Sohna Road is popular for private pool parties and weekend retreats.`;
    } else if (lower.includes('bangalore') || lower.includes('bengaluru')) {
      reply += `For tech summits and corporate retreats in Bangalore, **Silicon Summit Convention** in Whitefield offers gigabit networking and 4K AV facilities.`;
    } else if (lower.includes('budget') || lower.includes('cost') || lower.includes('price')) {
      reply += `As a general rule of thumb for Indian celebrations: allocate 40% of your budget for the venue rental & basic decor, 35% for catering (veg plates typically start around ₹650-₹950, non-veg around ₹850-₹1,400), and 25% for photography, music, and contingency.`;
    } else {
      reply += `Whether you are planning a Shaadi in Jaipur, a corporate conference in Bengaluru, or an intimate birthday party in Delhi, tell me your preferred city, guest count, and budget, and I'll find you the perfect venue!`;
    }
    res.json({ reply });
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`VenueBook India server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
