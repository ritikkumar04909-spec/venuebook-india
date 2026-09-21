import React from 'react';
import { 
  Building2, 
  Sparkles, 
  Heart, 
  User, 
  ShieldCheck, 
  Briefcase, 
  Bot, 
  MapPin, 
  PlusCircle,
  Menu,
  X
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  currentUser: UserProfile;
  onSelectRole: (role: 'customer' | 'venue_owner' | 'admin') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  savedCount: number;
  onOpenAiAssistant: () => void;
  onOpenRegisterVenue: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  onSelectRole,
  activeTab,
  setActiveTab,
  savedCount,
  onOpenAiAssistant,
  onOpenRegisterVenue
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-200">
      {/* Top micro-bar with India service assurance & quick role switch */}
      <div className="bg-stone-900 text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium text-white">VenueBook India</span>
          <span className="text-stone-400 hidden sm:inline">— 500+ Verified Banquets, Resorts & Lawns Across India</span>
        </div>

        <div className="flex items-center gap-4 text-stone-300">
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-stone-400">Viewing as:</span>
            <select
              aria-label="Select user role"
              value={currentUser.role}
              onChange={(e) => onSelectRole(e.target.value as any)}
              className="bg-stone-800 text-amber-400 text-xs font-semibold rounded px-2 py-0.5 border border-stone-700 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-400"
            >
              <option value="customer">Customer (Ritik Kumar)</option>
              <option value="venue_owner">Venue Owner (Vikramaditya)</option>
              <option value="admin">Platform Admin (National)</option>
            </select>
          </div>
          <span className="text-stone-500 hidden md:inline">|</span>
          <div className="hidden md:flex items-center gap-1 text-stone-400">
            <MapPin className="w-3 h-3 text-amber-400" />
            <span>Pan-India 24/7 Concierge: +91 1800-200-8899</span>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => setActiveTab('explore')}
          className="flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-600 flex items-center justify-center text-white shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-display text-xl font-bold tracking-tight text-stone-900">
                Venue<span className="text-amber-700">Book</span>
              </span>
              <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded ml-1">
                India
              </span>
            </div>
            <p className="text-[11px] text-stone-500 leading-none">Resorts & Venue Booking</p>
          </div>
        </button>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-stone-700">
          <button
            onClick={() => setActiveTab('explore')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-amber-50 text-amber-900 font-semibold'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            Explore Venues
          </button>

          <button
            onClick={() => setActiveTab('ai_recommend')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'ai_recommend'
                ? 'bg-amber-50 text-amber-900 font-semibold'
                : 'hover:bg-stone-100 text-stone-700'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Matchmaker</span>
          </button>

          {currentUser.role === 'customer' && (
            <button
              onClick={() => setActiveTab('my_bookings')}
              className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'my_bookings'
                  ? 'bg-amber-50 text-amber-900 font-semibold'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              My Bookings
            </button>
          )}

          {currentUser.role === 'venue_owner' && (
            <button
              onClick={() => setActiveTab('owner_dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'owner_dashboard'
                  ? 'bg-stone-900 text-white font-semibold'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>Owner Dashboard</span>
            </button>
          )}

          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveTab('admin_dashboard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'admin_dashboard'
                  ? 'bg-red-950 text-amber-200 font-semibold'
                  : 'hover:bg-stone-100 text-stone-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Admin Center</span>
            </button>
          )}
        </nav>

        {/* Right CTA / Assistant */}
        <div className="hidden lg:flex items-center gap-3">
          {/* AI Event Assistant button */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-stone-100 hover:bg-amber-100/70 text-stone-800 text-xs font-semibold border border-stone-200 transition-all cursor-pointer shadow-xs"
          >
            <Bot className="w-4 h-4 text-amber-700" />
            <span>ShubhAayojan AI</span>
          </button>

          {/* Saved Venues */}
          <button
            onClick={() => setActiveTab('saved_venues')}
            className={`p-2.5 rounded-lg border border-stone-200 relative hover:bg-stone-50 cursor-pointer transition-colors ${
              activeTab === 'saved_venues' ? 'bg-amber-50 text-amber-700 border-amber-300' : 'text-stone-600'
            }`}
            title="Saved Venues"
          >
            <Heart className={`w-4 h-4 ${savedCount > 0 ? 'fill-red-500 text-red-500' : ''}`} />
            {savedCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </button>

          {/* List Venue / Partner with us */}
          {currentUser.role !== 'admin' && (
            <button
              onClick={onOpenRegisterVenue}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>List Venue</span>
            </button>
          )}

          {/* User Account / Profile button */}
          <button
            onClick={() => setActiveTab('user_profile')}
            className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border cursor-pointer transition-colors ${
              activeTab === 'user_profile'
                ? 'bg-amber-50 border-amber-400 text-amber-900'
                : 'border-stone-200 hover:bg-stone-50 text-stone-700'
            }`}
          >
            <div className="w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold flex items-center justify-center">
              {currentUser.name.charAt(0)}
            </div>
            <span className="text-xs font-semibold">{currentUser.name.split(' ')[0]}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenAiAssistant}
            className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200"
            title="AI Assistant"
          >
            <Bot className="w-4 h-4 text-amber-700" />
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-600 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-4 space-y-2">
          <button
            onClick={() => { setActiveTab('explore'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            Explore Venues
          </button>
          <button
            onClick={() => { setActiveTab('ai_recommend'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 flex items-center gap-2 text-amber-800"
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            AI Venue Matchmaker
          </button>
          <button
            onClick={() => { setActiveTab('my_bookings'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100"
          >
            My Bookings & Receipts
          </button>
          <button
            onClick={() => { setActiveTab('saved_venues'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 flex items-center justify-between"
          >
            <span>Saved Venues</span>
            <span className="text-xs bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">{savedCount}</span>
          </button>
          <button
            onClick={() => { setActiveTab('owner_dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 flex items-center gap-2"
          >
            <Briefcase className="w-4 h-4 text-amber-700" />
            Venue Owner Dashboard
          </button>
          <button
            onClick={() => { setActiveTab('admin_dashboard'); setMobileMenuOpen(false); }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium hover:bg-stone-100 flex items-center gap-2 text-red-900"
          >
            <ShieldCheck className="w-4 h-4 text-red-700" />
            Platform Admin Center
          </button>
          <button
            onClick={() => { onOpenRegisterVenue(); setMobileMenuOpen(false); }}
            className="w-full text-center px-4 py-2.5 rounded-lg bg-stone-900 text-white text-sm font-semibold mt-2"
          >
            List Your Venue (+91)
          </button>
        </div>
      )}
    </header>
  );
};
