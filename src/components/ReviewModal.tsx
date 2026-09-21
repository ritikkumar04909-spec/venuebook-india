import React, { useState } from 'react';
import { X, Star, Upload, CheckCircle2, Sparkles } from 'lucide-react';
import { POPULAR_EVENT_TYPES } from '../utils/formatters';

interface ReviewModalProps {
  venueId: string;
  venueName: string;
  initialEventType?: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (reviewData: {
    venueId: string;
    rating: number;
    eventType: string;
    comment: string;
    photos?: string[];
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  venueId,
  venueName,
  initialEventType = 'Weddings / Shaadi',
  isOpen,
  onClose,
  onSubmitReview
}) => {
  if (!isOpen) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [eventType, setEventType] = useState(initialEventType);
  const [comment, setComment] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAddPhoto = () => {
    if (photoUrl.trim()) {
      setPhotos([...photos, photoUrl.trim()]);
      setPhotoUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview({
      venueId,
      rating,
      eventType,
      comment,
      photos
    });
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-stone-200 space-y-4 text-xs">
        <div className="flex justify-between items-center border-b border-stone-200 pb-3">
          <div>
            <h3 className="text-base font-bold font-display text-stone-900">Write Venue Review</h3>
            <p className="text-stone-500">{venueName}</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-stone-400 hover:text-stone-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-base font-bold text-stone-900">Thank You for Your Review!</h4>
            <p className="text-stone-500">Your feedback helps families choose the best celebration spaces across India.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star selector */}
            <div>
              <label className="font-bold text-stone-700 block mb-1">Your Overall Rating</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-2xl transition-transform hover:scale-110 cursor-pointer"
                  >
                    <Star
                      className={`w-7 h-7 ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="font-bold text-stone-800 ml-2 text-sm">{rating}.0 / 5.0</span>
              </div>
            </div>

            {/* Event type */}
            <div>
              <label htmlFor="review-event-type-select" className="font-bold text-stone-700 block mb-1">Event Celebrated</label>
              <select
                id="review-event-type-select"
                aria-label="Event Celebrated"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50"
              >
                {POPULAR_EVENT_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="review-experience-textarea" className="font-bold text-stone-700 block mb-1">Detailed Experience</label>
              <textarea
                id="review-experience-textarea"
                aria-label="Detailed Experience"
                required
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Describe catering taste, lawn maintenance, valet parking efficiency, and management cooperation..."
                className="w-full p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            {/* Optional Photo URL */}
            <div>
              <label htmlFor="review-event-photos-input" className="font-bold text-stone-700 block mb-1">Add Event Photos (URL)</label>
              <div className="flex gap-2">
                <input
                  id="review-event-photos-input"
                  aria-label="Event Photos URL"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="flex-1 p-2 rounded-xl border border-stone-300"
                />
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold cursor-pointer"
                >
                  Add
                </button>
              </div>
              {photos.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {photos.map((p, i) => (
                    <img key={i} src={p} alt="" className="w-12 h-12 rounded-lg object-cover border" />
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer text-sm"
            >
              Submit Verified Review
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
