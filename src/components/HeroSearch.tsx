import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, Sparkles, Filter, CheckCircle2 } from 'lucide-react';
import { SearchFilters } from '../types';
import { POPULAR_EVENT_TYPES, INDIAN_STATES_CITIES } from '../utils/formatters';

interface HeroSearchProps {
  filters: SearchFilters;
  onSearch: (updated: Partial<SearchFilters>) => void;
  onQuickSearch: (query: string, eventType?: string) => void;
  onOpenAiRecommendation: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onSearch,
  onQuickSearch,
  onOpenAiRecommendation
}) => {
  const [localLocation, setLocalLocation] = useState(filters.location);
  const [localEventType, setLocalEventType] = useState(filters.eventType || 'Weddings / Shaadi');
  const [localDate, setLocalDate] = useState(filters.date);
  const [localGuests, setLocalGuests] = useState(filters.guests || 250);
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);

  const popularCities = [
    'Patna',
    'Delhi NCR',
    'Bangalore',
    'Mumbai',
    'Jaipur',
    'Hyderabad',
    'Goa',
    'Lucknow',
    'Kolkata',
    'Pune',
    'Chandigarh'
  ];

  const handleExecuteSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      location: localLocation,
      eventType: localEventType,
      date: localDate,
      guests: Number(localGuests)
    });
  };

  return (
    <div className="relative bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Indian pattern subtle background overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:20px_20px]" />

      <div className="relative max-w-5xl mx-auto text-center space-y-4">
        {/* Trust badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-800/80 border border-stone-700/80 text-amber-300 text-xs font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
          <span>India’s Most Trusted Venue & Resort Booking Network</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white font-display">
          Find Your Perfect Celebration Venue <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200">
            Anywhere Across India
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-base">
          Book verified banquet halls, heritage havelis, luxury resorts, corporate convention centers, and scenic farmhouses with transparent pricing & guaranteed dates.
        </p>

        {/* The Prominent 5-part Search Box */}
        <div className="pt-4 text-left">
          <form
            onSubmit={handleExecuteSearch}
            className="bg-white rounded-2xl p-3 sm:p-4 shadow-2xl shadow-black/50 border border-stone-200 text-stone-900 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center"
          >
            {/* 1. Location Search */}
            <div className="relative lg:col-span-4 border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0 sm:pr-3">
              <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                Location / City / PIN
              </label>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  type="text"
                  value={localLocation}
                  onChange={(e) => {
                    setLocalLocation(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  placeholder="e.g. Patna, Delhi, Whitefield, 801503"
                  className="w-full text-sm font-semibold text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
                />
              </div>

              {/* Location autocomplete pills dropdown */}
              {showLocationSuggestions && (
                <div
                  onMouseLeave={() => setShowLocationSuggestions(false)}
                  className="absolute left-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 p-3 z-50 text-xs"
                >
                  <div className="font-semibold text-stone-500 mb-2 flex items-center justify-between">
                    <span>Popular Hubs</span>
                    <button
                      type="button"
                      onClick={() => setShowLocationSuggestions(false)}
                      className="text-stone-400 hover:text-stone-700 cursor-pointer text-[10px]"
                    >
                      Close
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularCities.map((city) => (
                      <button
                        key={city}
                        type="button"
                        onClick={() => {
                          setLocalLocation(city);
                          setShowLocationSuggestions(false);
                        }}
                        className="px-2.5 py-1 rounded-md bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Event Type Selector */}
            <div className="lg:col-span-3 border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0 sm:pr-3">
              <label htmlFor="hero-event-type-select" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                Event Type
              </label>
              <div className="flex items-center gap-1.5">
                <select
                  id="hero-event-type-select"
                  aria-label="Event Type"
                  value={localEventType}
                  onChange={(e) => setLocalEventType(e.target.value)}
                  className="w-full text-sm font-semibold text-stone-900 focus:outline-none bg-transparent cursor-pointer"
                >
                  {POPULAR_EVENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Date Selector */}
            <div className="lg:col-span-2 border-b sm:border-b-0 sm:border-r border-stone-200 pb-2 sm:pb-0 sm:pr-3">
              <label htmlFor="hero-event-date-input" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                Event Date
              </label>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  id="hero-event-date-input"
                  aria-label="Event Date"
                  type="date"
                  value={localDate}
                  onChange={(e) => setLocalDate(e.target.value)}
                  className="w-full text-xs font-semibold text-stone-800 focus:outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            {/* 4. Guests Selector */}
            <div className="lg:col-span-1 pb-2 sm:pb-0">
              <label htmlFor="hero-guest-count-input" className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
                Guests
              </label>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-amber-600 shrink-0" />
                <input
                  id="hero-guest-count-input"
                  aria-label="Number of Guests"
                  type="number"
                  min={10}
                  max={5000}
                  step={25}
                  value={localGuests}
                  onChange={(e) => setLocalGuests(Number(e.target.value))}
                  className="w-full text-xs font-semibold text-stone-900 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* 5. Search Action Button */}
            <div className="lg:col-span-2 flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-900/30 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Quick Search Chips & AI Prompt trigger */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-300">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-stone-400 font-medium">Quick Searches:</span>
              <button
                type="button"
                onClick={() => onQuickSearch('Patna', 'Weddings / Shaadi')}
                className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950/60 hover:text-amber-300 border border-stone-700 transition-colors cursor-pointer"
              >
                💍 Wedding in Patna
              </button>
              <button
                type="button"
                onClick={() => onQuickSearch('Delhi', 'Birthday Party')}
                className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950/60 hover:text-amber-300 border border-stone-700 transition-colors cursor-pointer"
              >
                🎉 Party in Delhi
              </button>
              <button
                type="button"
                onClick={() => onQuickSearch('Bangalore', 'Corporate Meeting')}
                className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950/60 hover:text-amber-300 border border-stone-700 transition-colors cursor-pointer"
              >
                💼 Corporate in Bangalore
              </button>
              <button
                type="button"
                onClick={() => onQuickSearch('Jaipur', 'Weddings / Shaadi')}
                className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950/60 hover:text-amber-300 border border-stone-700 transition-colors cursor-pointer hidden md:inline-block"
              >
                🏰 Haveli in Jaipur
              </button>
              <button
                type="button"
                onClick={() => onQuickSearch('Goa', 'Reception')}
                className="px-2.5 py-1 rounded-full bg-stone-800 hover:bg-amber-950/60 hover:text-amber-300 border border-stone-700 transition-colors cursor-pointer hidden md:inline-block"
              >
                🌴 Beach Resort in Goa
              </button>
            </div>

            {/* Smart AI Prompt Trigger */}
            <button
              type="button"
              onClick={onOpenAiRecommendation}
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium cursor-pointer transition-colors bg-amber-950/40 border border-amber-800/60 px-3 py-1 rounded-full"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI: "Wedding in Patna for 300 under ₹2 Lakh"</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
