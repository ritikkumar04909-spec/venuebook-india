import React, { useState } from 'react';
import { 
  SlidersHorizontal, 
  RotateCcw, 
  Map, 
  LayoutGrid, 
  Star, 
  Users, 
  IndianRupee,
  Check,
  ChevronDown
} from 'lucide-react';
import { SearchFilters, VenueCategory } from '../types';
import { INDIAN_STATES_CITIES, POPULAR_EVENT_TYPES, formatINR } from '../utils/formatters';

interface FilterBarProps {
  filters: SearchFilters;
  onChange: (updated: Partial<SearchFilters>) => void;
  onReset: () => void;
  totalMatches: number;
  viewMode: 'grid' | 'map';
  setViewMode: (mode: 'grid' | 'map') => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onChange,
  onReset,
  totalMatches,
  viewMode,
  setViewMode
}) => {
  const [expanded, setExpanded] = useState(false);

  const categories: ('All' | VenueCategory)[] = [
    'All',
    'Banquet Hall',
    'Resort',
    'Luxury Hotel',
    'Farmhouse',
    'Heritage Palace',
    'Conference Hall',
    'Rooftop Lounge'
  ];

  const states = ['All', ...Object.keys(INDIAN_STATES_CITIES)];

  // Count how many non-default filters are active
  const activeFiltersCount = [
    filters.location,
    filters.state !== 'All' ? filters.state : null,
    filters.eventType !== 'All' ? filters.eventType : null,
    filters.category !== 'All' ? filters.category : null,
    filters.minPrice > 0 ? filters.minPrice : null,
    filters.maxPrice < 500000 ? filters.maxPrice : null,
    filters.rating > 0 ? filters.rating : null,
    filters.indoorOutdoor !== 'all' ? filters.indoorOutdoor : null,
    filters.acOnly,
    filters.parking,
    filters.swimmingPool,
    filters.wifi,
    filters.roomsAvailable,
    filters.djMusic,
    filters.conferenceFacilities
  ].filter(Boolean).length;

  return (
    <div className="bg-white border-b border-stone-200 sticky top-18 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Top filter row: quick pills, results counter, sort, and view switch */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Result count & Filter Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setExpanded(!expanded)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                expanded || activeFiltersCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-700" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={onReset}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}

            <div className="text-xs text-stone-600 hidden sm:inline">
              Showing <strong className="text-stone-900 font-semibold">{totalMatches}</strong> verified venues in India
            </div>
          </div>

          {/* Center: Venue Category quick tabs (scrollable) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {categories.slice(0, 6).map((cat) => (
              <button
                key={cat}
                onClick={() => onChange({ category: cat })}
                className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
                  filters.category === cat
                    ? 'bg-stone-900 text-white font-medium shadow-xs'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Right: Sort By & View Mode Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center text-xs">
              <label htmlFor="filter-sort-by-select" className="text-stone-500 mr-1.5 hidden md:inline">Sort:</label>
              <select
                id="filter-sort-by-select"
                aria-label="Sort venues by"
                value={filters.sortBy}
                onChange={(e) => onChange({ sortBy: e.target.value as any })}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-xs rounded-lg px-2.5 py-1.5 font-medium focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
              >
                <option value="popular">Popularity & Rating</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Top Rated (4.8+)</option>
                <option value="capacity">Largest Capacity</option>
              </select>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`p-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  viewMode === 'map'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="India Map Discovery View"
              >
                <Map className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Deep Filters Drawer */}
        {expanded && (
          <div className="mt-4 pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* 1. State & City */}
            <div className="space-y-1.5">
              <label htmlFor="filter-state-select" className="font-bold text-stone-700 block">State in India</label>
              <select
                id="filter-state-select"
                aria-label="State in India"
                value={filters.state}
                onChange={(e) => onChange({ state: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none"
              >
                {states.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Venue Category */}
            <div className="space-y-1.5">
              <label htmlFor="filter-venue-category-select" className="font-bold text-stone-700 block">Venue Category</label>
              <select
                id="filter-venue-category-select"
                aria-label="Venue Category"
                value={filters.category}
                onChange={(e) => onChange({ category: e.target.value })}
                className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-stone-800 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Budget Range */}
            <div className="space-y-1.5">
              <div className="flex justify-between font-bold text-stone-700">
                <span>Budget Limit</span>
                <span className="text-amber-700">{formatINR(filters.maxPrice)}</span>
              </div>
              <input
                aria-label="Budget Limit"
                type="range"
                min={25000}
                max={500000}
                step={25000}
                value={filters.maxPrice}
                onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>₹25K</span>
                <span>₹2.5 Lakh</span>
                <span>₹5 Lakh+</span>
              </div>
            </div>

            {/* 4. Indoor vs Outdoor */}
            <div className="space-y-1.5">
              <span className="font-bold text-stone-700 block">Space Type</span>
              <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg">
                {(['all', 'indoor', 'outdoor'] as const).map((space) => (
                  <button
                    key={space}
                    onClick={() => onChange({ indoorOutdoor: space })}
                    className={`py-1.5 rounded text-center capitalize font-medium transition-colors cursor-pointer ${
                      filters.indoorOutdoor === space
                        ? 'bg-white shadow-xs text-amber-900'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {space}
                  </button>
                ))}
              </div>
            </div>

            {/* Amenities Multi-checkbox grid (span across columns) */}
            <div className="col-span-1 sm:col-span-2 lg:col-span-4 pt-2 border-t border-stone-100">
              <span className="font-bold text-stone-700 block mb-2">Amenities & Facilities Checklist</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {[
                  { key: 'acOnly', label: 'Centrally AC' },
                  { key: 'parking', label: 'Valet / Parking' },
                  { key: 'swimmingPool', label: 'Pool Access' },
                  { key: 'wifi', label: 'High-speed Wi-Fi' },
                  { key: 'roomsAvailable', label: 'Guest Rooms' },
                  { key: 'djMusic', label: 'DJ / Sound System' },
                  { key: 'conferenceFacilities', label: 'AV Projector' }
                ].map((item) => (
                  <label
                    key={item.key}
                    className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs cursor-pointer select-none transition-colors ${
                      (filters as any)[item.key]
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-medium'
                        : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!(filters as any)[item.key]}
                      onChange={(e) => onChange({ [item.key]: e.target.checked })}
                      className="accent-amber-600 rounded"
                    />
                    <span className="truncate">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
