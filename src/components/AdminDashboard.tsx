import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Building, 
  Users, 
  Calendar, 
  IndianRupee, 
  CheckCircle, 
  XCircle, 
  Star, 
  Sparkles, 
  AlertTriangle,
  FileBarChart,
  Eye
} from 'lucide-react';
import { Venue, Booking, UserProfile, Complaint } from '../types';
import { formatINR, formatDateIN } from '../utils/formatters';

interface AdminDashboardProps {
  venues: Venue[];
  bookings: Booking[];
  users: UserProfile[];
  complaints: Complaint[];
  onApproveVenue: (id: string) => void;
  onRejectVenue: (id: string) => void;
  onToggleFeatureVenue: (id: string) => void;
  onResolveComplaint: (id: string, resolution: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  venues,
  bookings,
  users,
  complaints,
  onApproveVenue,
  onRejectVenue,
  onToggleFeatureVenue,
  onResolveComplaint
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'venues' | 'complaints' | 'bookings'>('stats');
  const [resolutionText, setResolutionText] = useState<Record<string, string>>({});

  // Aggregated platform stats
  const totalRevenue = bookings
    .filter(b => b.paymentStatus === 'paid' && b.bookingStatus !== 'cancelled')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const pendingVenues = venues.filter(v => v.status === 'pending');
  const approvedVenues = venues.filter(v => v.status === 'approved');
  const featuredVenues = venues.filter(v => v.isFeatured);
  const openComplaints = complaints.filter(c => c.status === 'open' || c.status === 'investigating');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-6 rounded-3xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-600 flex items-center justify-center text-white">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-display">Super Admin Command Center</h2>
              <span className="bg-red-500/20 text-red-300 border border-red-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                Restricted Access
              </span>
            </div>
            <p className="text-xs text-stone-400">
              India-wide monitoring, venue vetting, dispute resolution, and platform revenue
            </p>
          </div>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'stats' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Key Metrics & Analytics
        </button>
        <button
          onClick={() => setActiveTab('venues')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'venues' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Venues & Approvals</span>
          {pendingVenues.length > 0 && (
            <span className="bg-amber-500 text-stone-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {pendingVenues.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('complaints')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'complaints' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <span>Disputes & Complaints</span>
          {openComplaints.length > 0 && (
            <span className="bg-red-500 text-white font-bold px-1.5 py-0.2 rounded-full text-[10px]">
              {openComplaints.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'bookings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          All India Bookings ({bookings.length})
        </button>
      </div>

      {/* TAB 1: METRICS & ANALYTICS */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Gross Platform GMV</span>
              <div className="text-2xl font-extrabold text-amber-900 font-display">
                {formatINR(totalRevenue)}
              </div>
              <p className="text-[10px] text-emerald-700">Processed across India</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Active Venues</span>
              <div className="text-2xl font-extrabold text-stone-900 font-display">
                {venues.length}
              </div>
              <p className="text-[10px] text-stone-500">{featuredVenues.length} Featured on Home</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Confirmed Bookings</span>
              <div className="text-2xl font-extrabold text-stone-900 font-display">
                {bookings.length}
              </div>
              <p className="text-[10px] text-stone-500">Across 10+ States</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Registered Accounts</span>
              <div className="text-2xl font-extrabold text-stone-900 font-display">
                {users.length}
              </div>
              <p className="text-[10px] text-stone-500">Hosts, Venues & Planners</p>
            </div>
          </div>

          {/* Regional distribution insights */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
            <h3 className="font-display font-bold text-stone-900 text-base">Regional Booking Hubs & Occupancy</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block text-sm">North India (Delhi / Jaipur)</span>
                <p className="text-stone-500">Highest wedding volume: Average spend ₹3,80,000 / event.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block text-sm">East India (Patna / Kolkata)</span>
                <p className="text-stone-500">Rapid growth in grand luxury lawns & Shaadi resort bookings.</p>
              </div>
              <div className="p-4 bg-stone-50 rounded-xl space-y-1">
                <span className="font-bold text-stone-900 block text-sm">South & West (Bangalore / Goa)</span>
                <p className="text-stone-500">Leading destination beach weddings & corporate tech summits.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VENUES & APPROVAL MANAGEMENT */}
      {activeTab === 'venues' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-display font-bold text-stone-900 text-base">
                Venue Catalog & Partner Onboarding ({venues.length})
              </h3>
              <p className="text-stone-500">Verify partner license, set featured tags, or ban non-compliant listings</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Venue Name & City</th>
                  <th className="py-2.5 px-3">Owner Contact</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Base Price</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Featured</th>
                  <th className="py-2.5 px-3 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {venues.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3">
                      <strong className="block text-stone-900">{v.name}</strong>
                      <span className="text-stone-500">{v.locality}, {v.city}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="block text-stone-800 font-medium">{v.ownerName}</span>
                      <span className="text-stone-400">{v.ownerPhone}</span>
                    </td>
                    <td className="py-3 px-3 font-medium">{v.category}</td>
                    <td className="py-3 px-3 font-bold text-amber-900">{formatINR(v.startingPrice)}</td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        v.status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => onToggleFeatureVenue(v.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                          v.isFeatured ? 'bg-amber-500 text-stone-950' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                        }`}
                      >
                        {v.isFeatured ? '★ Featured' : 'Standard'}
                      </button>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex justify-end gap-1.5">
                        {v.status === 'pending' ? (
                          <>
                            <button
                              onClick={() => onApproveVenue(v.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => onRejectVenue(v.id)}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-bold cursor-pointer"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-stone-400 font-semibold">Live in Catalog</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: DISPUTES & COMPLAINTS */}
      {activeTab === 'complaints' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <h3 className="font-display font-bold text-stone-900 text-base">
            Customer Disputes & Concierge Tickets ({complaints.length})
          </h3>

          <div className="space-y-4">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <strong className="text-stone-900 text-sm block">{c.subject}</strong>
                    <span className="text-stone-400">By {c.userName} ({c.userEmail}) • Ref: {c.bookingId || 'Direct Inquiry'}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    c.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <p className="text-stone-700 bg-white p-3 rounded-lg border border-stone-200">
                  {c.description}
                </p>

                {c.resolution ? (
                  <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded border-l-2 border-emerald-500">
                    <strong>Admin Resolution:</strong> {c.resolution}
                  </div>
                ) : (
                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Enter official refund or dispute resolution notes..."
                      value={resolutionText[c.id] || ''}
                      onChange={(e) => setResolutionText({ ...resolutionText, [c.id]: e.target.value })}
                      className="flex-1 p-2 rounded-lg border border-stone-300 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => onResolveComplaint(c.id, resolutionText[c.id] || 'Resolved per platform policy')}
                      className="px-4 py-2 bg-stone-900 text-white rounded-lg font-bold hover:bg-stone-800 cursor-pointer"
                    >
                      Resolve & Close Ticket
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL INDIA BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-white p-6 rounded-2xl border border-stone-200 space-y-4 text-xs">
          <h3 className="font-display font-bold text-stone-900 text-base">
            System-Wide Reservations Log ({bookings.length})
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">Code</th>
                  <th className="py-2.5 px-3">Venue</th>
                  <th className="py-2.5 px-3">Host Name</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Paid Amount</th>
                  <th className="py-2.5 px-3">Payment Ref</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-stone-50">
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">{b.bookingCode}</td>
                    <td className="py-3 px-3 font-medium">{b.venueName}</td>
                    <td className="py-3 px-3">{b.userName}</td>
                    <td className="py-3 px-3">{formatDateIN(b.eventDate)}</td>
                    <td className="py-3 px-3 font-bold text-amber-900">{formatINR(b.totalAmount)}</td>
                    <td className="py-3 px-3 font-mono text-[10px] text-stone-400">{b.paymentDetails.transactionId}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
