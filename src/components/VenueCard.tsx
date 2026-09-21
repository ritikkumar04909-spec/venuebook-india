import React from 'react';
import { 
  Star, 
  MapPin, 
  Users, 
  Heart, 
  CheckCircle, 
  Sparkles, 
  ShieldCheck, 
  CalendarCheck,
  ArrowRight,
  Info
} from 'lucide-react';
import { Venue } from '../types';
import { formatINR } from '../utils/formatters';

interface VenueCardProps {
  venue: Venue;
  onViewDetails: (venue: Venue) => void;
  onCheckAvailability: (venue: Venue) => void;
  isSaved: boolean;
  onToggleSave: (venueId: string) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({
  venue,
  onViewDetails,
  onCheckAvailability,
  isSaved,
  onToggleSave
}) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image header with badges & heart button */}
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={venue.images[0]}
          alt={venue.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Category Pill top left */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className="bg-stone-900/80 backdrop-blur text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
            {venue.category}
          </span>
          {venue.isFeatured && (
            <span className="bg-amber-500 text-stone-950 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
        </div>

        {/* Save Heart Button top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(venue.id);
          }}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md transition-transform active:scale-90 cursor-pointer"
          title={isSaved ? 'Remove from saved' : 'Save venue'}
        >
          <Heart
            className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-stone-700'}`}
          />
        </button>

        {/* Location & Rating overlay at bottom of image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1 drop-shadow-md font-medium">
            <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="truncate">{venue.locality}, {venue.city}</span>
          </div>

          <div className="flex items-center gap-1 bg-black/50 backdrop-blur px-2 py-0.5 rounded-md text-amber-300 font-bold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{venue.rating}</span>
            <span className="text-stone-300 font-normal">({venue.reviewCount})</span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* State / City Subhead & Verified icon */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium mb-1">
            <span>{venue.city}, {venue.state}</span>
            {venue.isVerified && (
              <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                <ShieldCheck className="w-3 h-3" />
                Verified Partner
              </span>
            )}
          </div>

          {/* Venue Name */}
          <h3 
            onClick={() => onViewDetails(venue)}
            className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors line-clamp-1 cursor-pointer"
          >
            {venue.name}
          </h3>

          <p className="text-xs text-stone-600 line-clamp-2 mt-1">
            {venue.tagline}
          </p>

          {/* Key Metrics: Capacity & Starting Price */}
          <div className="mt-3 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-50 rounded-xl p-2">
              <span className="text-[10px] text-stone-500 font-semibold block uppercase">Guest Capacity</span>
              <div className="flex items-center gap-1 font-bold text-stone-900 mt-0.5">
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>{venue.minCapacity}–{venue.maxCapacity}</span>
              </div>
            </div>

            <div className="bg-amber-50/60 rounded-xl p-2 border border-amber-100/50">
              <span className="text-[10px] text-amber-800 font-semibold block uppercase">Starting From</span>
              <div className="font-extrabold text-amber-900 text-sm mt-0.5">
                {formatINR(venue.startingPrice)}
              </div>
            </div>
          </div>

          {/* Amenities chips preview */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {venue.amenities.slice(0, 4).map((amenity) => (
              <span
                key={amenity}
                className="text-[10px] font-medium bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md"
              >
                {amenity}
              </span>
            ))}
            {venue.amenities.length > 4 && (
              <span className="text-[10px] font-medium text-stone-400 self-center">
                +{venue.amenities.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Dual Action Buttons per Requirement: [View Details] & [Check Availability] */}
        <div className="pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onViewDetails(venue)}
            className="w-full py-2.5 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <Info className="w-3.5 h-3.5 text-stone-500" />
            <span>View Details</span>
          </button>

          <button
            type="button"
            onClick={() => onCheckAvailability(venue)}
            className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Availability</span>
          </button>
        </div>
      </div>
    </div>
  );
};
