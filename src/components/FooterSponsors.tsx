"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const FooterSponsors = ({ type }: { type?: 'sponsor' | 'co-sponsor' }) => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAd, setSelectedAd] = useState<{ image: string, cardId?: string } | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const { data } = await api.get("/seba/sponsor");
        if (data.status === "Success") {
          setSponsors(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch sponsors", err);
      }
    };
    fetchSponsors();
  }, []);

  const mainSponsors = sponsors.filter(s => s.type === 'sponsor');
  const coSponsors = sponsors.filter(s => s.type === 'co-sponsor');

  // Logic based on prop
  let activeSponsors: any[] = [];
  let label = "";

  if (type === 'sponsor') {
    activeSponsors = mainSponsors;
    label = "Sponsor";
  } else if (type === 'co-sponsor') {
    activeSponsors = coSponsors;
    label = "Co-Sponsor";
  } else {
    // Default priority logic for Home if no type specified (or explicitly for Home)
    activeSponsors = mainSponsors.length > 0 ? mainSponsors : coSponsors;
    label = mainSponsors.length > 0 ? "Sponsor" : "Co-Sponsor";
  }

  useEffect(() => {
    if (activeSponsors.length <= 1) return;
    
    // Increased timing to 4 seconds
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSponsors.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [activeSponsors.length]);

  // Ensure modal is closed if user navigates away (fixes BFCache blank screen issue)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setSelectedAd(null);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    // Also listen for popstate just in case
    window.addEventListener('popstate', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleVisibilityChange);
    };
  }, []);

  if (activeSponsors.length === 0) return null;

  // Ensure index is within bounds (in case arrays change)
  const safeIndex = currentIndex % activeSponsors.length;
  const activeSponsor = activeSponsors[safeIndex];
  const isCoSponsor = label === "Co-Sponsor";

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeSponsors.length) % activeSponsors.length);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeSponsors.length);
  };

  return (
    <div className={`mt-auto px-4 pb-20`}>
      <p className="text-center text-[12px] text-gray-800 font-bold italic mb-2 tracking-tight">
        :: {isCoSponsor ? "Co-Sponsored by" : label} ::
      </p>
      
      <div className="relative w-full">
        {/* Previous Arrow */}
        {activeSponsors.length > 1 && (
          <button 
            onClick={handlePrev} 
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 transition-colors cursor-pointer z-10"
            aria-label="Previous Sponsor"
          >
            <svg width="12" height="50" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 10 6 30 18 50"></polyline>
            </svg>
          </button>
        )}

        {/* Sponsor Image Box */}
        <div 
          className={`rounded-2xl shadow-xl flex justify-center overflow-hidden border w-full ${
            isCoSponsor 
              ? "bg-white/90 border-[#d4b958] h-[140px]" 
              : "bg-white/80 border-[#0b4b4b] h-[120px]"
          }`}
        >
          <img
            key={activeSponsor._id || safeIndex}
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${activeSponsor.image}`}
            alt={label}
            className={`h-full w-full object-cover ${activeSponsor.adImage ? 'cursor-pointer' : ''}`}
            onClick={() => {
              if (activeSponsor.adImage) {
                setSelectedAd({ image: activeSponsor.adImage, cardId: activeSponsor.cardId });
              }
            }}
            style={{ animation: "fadeIn 0.5s ease-in-out" }}
          />
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0.8; }
              to { opacity: 1; }
            }
          `}</style>
        </div>

        {/* Next Arrow */}
        {activeSponsors.length > 1 && (
          <button 
            onClick={handleNext} 
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-700 transition-colors cursor-pointer z-10"
            aria-label="Next Sponsor"
          >
            <svg width="12" height="50" viewBox="0 0 24 60" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 10 18 30 6 50"></polyline>
            </svg>
          </button>
        )}
      </div>

      {/* Ad Modal */}
      {selectedAd && (
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-[100] bg-black/85 flex items-center justify-center p-4 shadow-2xl">
          <button 
            onClick={() => setSelectedAd(null)} 
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] p-2 bg-black/50 rounded-full"
            aria-label="Close Advertisement"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          <a
            href={selectedAd.cardId ? `${process.env.NEXT_PUBLIC_CARD_URL}/${selectedAd.cardId}?view=home` : '#'}
            onClick={(e) => {
              if (!selectedAd.cardId) {
                e.preventDefault();
              }
            }}
            className="contents"
          >
            <img 
              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${selectedAd.image}`} 
              alt="Advertisement"
              className={`max-w-full max-h-full rounded-lg shadow-2xl object-contain ${selectedAd.cardId ? 'cursor-pointer' : ''}`}
            />
          </a>
        </div>
      )}
    </div>
  );
};

export default FooterSponsors;
