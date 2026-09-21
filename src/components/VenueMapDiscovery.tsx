import React, { useState } from 'react';
import { MapPin, Navigation, Star, Users, IndianRupee, ArrowRight, ExternalLink } from 'lucide-react';
import { Venue } from '../types';
import { formatINR } from '../utils/formatters';

interface VenueMapDiscoveryProps {
  venues: Venue[];
  onSelectVenue: (venue: Venue) => void;
}

export const VenueMapDiscovery: React.FC<VenueMapDiscoveryProps> = ({
  venues,
  onSelectVenue
}) => {
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(venues[0] || null);
  const [activeCity, setActiveCity] = useState<string>('All');

  // Geographic projection scaling for India coordinates (Lat 8°N to 34°N, Lng 68°E to 96°E)
  const minLat = 10;
  const maxLat = 32;
  const minLng = 71;
  const maxLng = 90;

  const getPositionOnMap = (lat: number, lng: number) => {
    // Normalizing between 0% and 100%
    const x = ((lng - minLng) / (maxLng - minLng)) * 80 + 10;
    // Invert lat for Y axis (north at top)
    const y = ((maxLat - lat) / (maxLat - minLat)) * 80 + 10;
    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`
    };
  };

  const cities = ['All', ...Array.from(new Set(venues.map(v => v.city)))];

  const filteredVenues = activeCity === 'All' 
    ? venues 
    : venues.filter(v => v.city === activeCity);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
      {/* Map Control Header */}
      <div className="p-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 bg-stone-50">
        <div>
          <h3 className="font-display font-bold text-stone-900 text-base flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-600" />
            <span>Interactive India Venue Discovery Map</span>
          </h3>
          <p className="text-xs text-stone-500">
            Pinpoint venues across North, South, West & East India hubs
          </p>
        </div>

        {/* City Filter pills */}
        <div className="flex flex-wrap gap-1.5 text-xs">
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => setActiveCity(city)}
              className={`px-2.5 py-1 rounded-full transition-colors cursor-pointer ${
                activeCity === city
                  ? 'bg-amber-600 text-white font-semibold'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        {/* Interactive Map Visual Stage (Left 8 cols) */}
        <div className="lg:col-span-8 bg-stone-950 relative p-6 flex items-center justify-center overflow-hidden min-h-[420px]">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />

          {/* India Regional Outlines & Major River/Corridor Indicators */}
          <div className="relative w-full h-full max-w-[550px] aspect-[4/5] rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-4 flex flex-col justify-between">
            {/* Region labels */}
            <div className="text-[10px] text-stone-600 font-bold uppercase tracking-widest flex justify-between px-2">
              <span>North India (Delhi / NCR / Jaipur)</span>
              <span>East (Patna / Kolkata)</span>
            </div>

            <div className="text-[10px] text-stone-600 font-bold uppercase tracking-widest flex justify-between px-2">
              <span>West (Mumbai / Goa)</span>
              <span>South (Bangalore / Hyderabad)</span>
            </div>

            {/* Render venue coordinate pins */}
            {filteredVenues.map((v) => {
              const pos = getPositionOnMap(v.coordinates.lat, v.coordinates.lng);
              const isSelected = selectedVenue?.id === v.id;

              return (
                <div
                  key={v.id}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setSelectedVenue(v)}
                    className={`group relative flex items-center justify-center cursor-pointer transition-all ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                    }`}
                  >
                    {/* Ripple ring for selected marker */}
                    {isSelected && (
                      <span className="absolute w-8 h-8 rounded-full bg-amber-400/40 animate-ping" />
                    )}

                    <div
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg flex items-center gap-1 border transition-all ${
                        isSelected
                          ? 'bg-amber-500 text-stone-950 border-white ring-2 ring-amber-400'
                          : 'bg-stone-800 text-stone-200 border-stone-700 hover:bg-stone-700'
                      }`}
                    >
                      <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                      <span className="truncate max-w-[90px]">{v.city}</span>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="absolute bottom-3 left-3 bg-stone-900/80 backdrop-blur border border-stone-800 rounded-lg px-3 py-1.5 text-[11px] text-stone-400">
            Click any pin to inspect the venue & check live availability
          </div>
        </div>

        {/* Selected Venue Preview Drawer (Right 4 cols) */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-stone-50 border-t lg:border-t-0 lg:border-l border-stone-200">
          {selectedVenue ? (
            <div className="space-y-4">
              <div className="relative aspect-[16/10] rounded-xl overflow-hidden shadow-xs">
                <img
                  src={selectedVenue.images[0]}
                  alt={selectedVenue.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedVenue.category}
                </div>
                <div className="absolute bottom-2 right-2 bg-black/60 text-amber-300 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span>{selectedVenue.rating}</span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">
                  {selectedVenue.locality}, {selectedVenue.city}
                </span>
                <h4 className="text-base font-bold text-stone-900 mt-0.5">
                  {selectedVenue.name}
                </h4>
                <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                  {selectedVenue.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-semibold block">Capacity</span>
                  <div className="flex items-center gap-1 font-bold text-stone-800 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedVenue.minCapacity}–{selectedVenue.maxCapacity}</span>
                  </div>
                </div>

                <div className="bg-white p-2 rounded-lg border border-stone-200">
                  <span className="text-[10px] text-stone-400 font-semibold block">Starts At</span>
                  <div className="font-bold text-amber-900 mt-0.5">
                    {formatINR(selectedVenue.startingPrice)}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">Top Amenities</span>
                <div className="flex flex-wrap gap-1">
                  {selectedVenue.amenities.slice(0, 5).map(a => (
                    <span key={a} className="text-[10px] bg-white border border-stone-200 text-stone-700 px-2 py-0.5 rounded">
                      {a}
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectVenue(selectedVenue)}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Open Full Venue Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-stone-400 text-xs text-center p-6">
              Select a location pin on the map to explore venues
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
