export function formatINR(amount: number): string {
  if (isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDateIN(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

export const INDIAN_STATES_CITIES: Record<string, string[]> = {
  'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
  'Delhi NCR': ['Delhi', 'Gurgaon', 'Noida', 'Faridabad', 'Ghaziabad'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore'],
  'Telangana': ['Hyderabad', 'Secunderabad', 'Warangal'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Pushkar', 'Jaisalmer'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Noida'],
  'Goa': ['Goa', 'Panaji', 'Candolim', 'Margao', 'Calangute'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur'],
  'Punjab': ['Chandigarh', 'Amritsar', 'Ludhiana', 'Jalandhar'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
};

export const POPULAR_EVENT_TYPES = [
  'Weddings / Shaadi',
  'Engagement',
  'Birthday Party',
  'Anniversary',
  'Corporate Meeting',
  'Conference',
  'Seminar',
  'College Event',
  'Family Function',
  'Reception',
  'Other'
];
