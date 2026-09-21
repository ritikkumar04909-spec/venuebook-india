import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Bot, 
  Send, 
  Building2, 
  Calculator, 
  ArrowRight, 
  CheckCircle2, 
  HelpCircle,
  Users,
  IndianRupee
} from 'lucide-react';
import { Venue } from '../types';
import { formatINR } from '../utils/formatters';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectVenue: (venue: Venue) => void;
  venues: Venue[];
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onSelectVenue,
  venues
}) => {
  if (!isOpen) return null;

  const [activeMode, setActiveMode] = useState<'recommend' | 'planner'>('recommend');
  
  // Recommend Mode State
  const [recommendQuery, setRecommendQuery] = useState('Suggest wedding venues in Patna for 300 guests with catering and grand lawn');
  const [isRecommending, setIsRecommending] = useState(false);
  const [recommendResults, setRecommendResults] = useState<{
    matchedVenues: Venue[];
    aiInsights: string;
  } | null>(null);

  // Planner Mode State
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    {
      sender: 'ai',
      text: 'Namaste! I am your AI Indian Event Planner powered by Gemini. Ask me anything: how much catering is needed for 400 guests, stage decor ideas for a Sangeet, or how to budget a 500-person vivah celebration.'
    }
  ]);
  const [userPlannerInput, setUserPlannerInput] = useState('');
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);

  const handleRunRecommendation = async (queryText?: string) => {
    const q = queryText || recommendQuery;
    if (!q.trim()) return;
    setIsRecommending(true);

    try {
      const res = await fetch('/api/ai/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });
      const data = await res.json();
      setRecommendResults({
        matchedVenues: data.recommendedVenues || [],
        aiInsights: data.aiInsights || 'Here are the best matching venues tailored for your celebration.'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSendPlannerMessage = async () => {
    if (!userPlannerInput.trim() || isAssistantThinking) return;

    const userText = userPlannerInput;
    setUserPlannerInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsAssistantThinking(true);

    try {
      const res = await fetch('/api/ai/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText })
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { sender: 'ai', text: data.reply || 'Here are my event suggestions.' }]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev, 
        { sender: 'ai', text: 'Apologies, I encountered a temporary connection issue. Please feel free to ask again.' }
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex justify-center p-2 sm:p-4 md:p-6">
      <div className="bg-white w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col my-auto border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base flex items-center gap-2">
                <span>Gemini AI Event & Venue Concierge</span>
              </h3>
              <p className="text-[11px] text-stone-400">
                Powered by Gemini 2.5 Flash for smart Indian celebrations
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-300 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 p-1 bg-stone-100 border-b border-stone-200 text-xs font-semibold">
          <button
            onClick={() => setActiveMode('recommend')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'recommend' ? 'bg-white text-amber-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Smart Venue Recommender</span>
          </button>

          <button
            onClick={() => setActiveMode('planner')}
            className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
              activeMode === 'planner' ? 'bg-white text-amber-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Bot className="w-4 h-4 text-amber-600" />
            <span>AI Budget & Event Planner</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh]">
          
          {/* MODE 1: SMART VENUE RECOMMENDER */}
          {activeMode === 'recommend' && (
            <div className="space-y-4">
              <div>
                <label className="font-bold text-stone-800 text-xs block mb-1">
                  Describe your dream event in natural language:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={recommendQuery}
                    onChange={(e) => setRecommendQuery(e.target.value)}
                    placeholder="e.g. Suggest banquet in Patna for 300 guests under 1 lakh with lawn"
                    className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    disabled={isRecommending}
                    onClick={() => handleRunRecommendation()}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {isRecommending ? (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Search AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Sample Queries Chips */}
              <div className="flex flex-wrap gap-1.5 text-[11px] text-stone-600">
                <span className="font-semibold text-stone-400 self-center">Try:</span>
                {[
                  'Royal wedding in Patna for 500 guests',
                  'Corporate conference in Bangalore under 80000',
                  'Beach resort in Goa for 150 guests',
                  'Budget banquet hall with AC and valet'
                ].map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setRecommendQuery(chip);
                      handleRunRecommendation(chip);
                    }}
                    className="px-2.5 py-1 bg-stone-100 hover:bg-amber-50 hover:text-amber-800 rounded-lg transition-colors cursor-pointer text-stone-700"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Results */}
              {recommendResults && (
                <div className="space-y-4 pt-4 border-t border-stone-200">
                  {/* AI Reasoning Summary */}
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-amber-900">
                      <Sparkles className="w-3.5 h-3.5" />
                      AI Analysis & Selection Rationale
                    </span>
                    <p className="leading-relaxed text-stone-700">{recommendResults.aiInsights}</p>
                  </div>

                  {/* Matched Venue Cards */}
                  <div className="space-y-3">
                    <span className="font-bold text-stone-900 text-xs block">
                      Recommended Matches ({recommendResults.matchedVenues.length})
                    </span>

                    {recommendResults.matchedVenues.map((venue) => (
                      <div
                        key={venue.id}
                        className="bg-white border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between hover:border-amber-400 transition-all text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className="w-20 h-20 rounded-xl object-cover shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold uppercase text-amber-700">{venue.city}</span>
                            <h4 className="font-bold text-stone-900 text-sm">{venue.name}</h4>
                            <p className="text-stone-500 line-clamp-1">{venue.tagline}</p>
                            <div className="flex items-center gap-3 mt-1 text-stone-600 text-[11px]">
                              <span>Capacity: <strong>{venue.minCapacity}–{venue.maxCapacity}</strong></span>
                              <span>Starting: <strong className="text-amber-900">{formatINR(venue.startingPrice)}</strong></span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectVenue(venue);
                            onClose();
                          }}
                          className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold cursor-pointer shrink-0 flex items-center gap-1 shadow-xs"
                        >
                          <span>Inspect Venue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* MODE 2: AI EVENT ASSISTANT CHAT */}
          {activeMode === 'planner' && (
            <div className="space-y-4">
              <div className="space-y-3 min-h-[250px] max-h-[350px] overflow-y-auto p-2">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-amber-600 text-white rounded-br-xs'
                          : 'bg-stone-100 text-stone-800 rounded-bl-xs border border-stone-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAssistantThinking && (
                  <div className="flex justify-start">
                    <div className="bg-stone-100 rounded-2xl p-3 text-xs text-stone-500 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                      <span>Gemini is calculating Indian event budget and logistics...</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2 pt-2 border-t border-stone-200">
                <input
                  type="text"
                  value={userPlannerInput}
                  onChange={(e) => setUserPlannerInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendPlannerMessage()}
                  placeholder="Ask e.g. How much food for 350 guests? What is the ideal budget breakdown for a 5-lakh shaadi?"
                  className="flex-1 p-2.5 rounded-xl border border-stone-300 text-xs"
                />
                <button
                  type="button"
                  onClick={handleSendPlannerMessage}
                  className="px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
