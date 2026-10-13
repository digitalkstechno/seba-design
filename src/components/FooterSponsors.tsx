"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

interface FooterSponsorsProps {
  type?: 'sponsor' | 'co-sponsor';
  className?: string;
}

const FooterSponsors = ({ type, className = "" }: FooterSponsorsProps) => {
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [withTransition, setWithTransition] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [isScrolling, setIsScrolling] = useState<boolean | null>(null);
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

  let activeSponsors: any[] = [];
  let label = "";

  if (type === 'sponsor') {
    activeSponsors = mainSponsors;
    label = "Sponsor";
  } else if (type === 'co-sponsor') {
    activeSponsors = coSponsors;
    label = "Co-Sponsor";
  } else {
    activeSponsors = mainSponsors.length > 0 ? mainSponsors : coSponsors;
    label = mainSponsors.length > 0 ? "Sponsor" : "Co-Sponsor";
  }

  const isCoSponsor = label === "Co-Sponsor";
  const hasMultiple = activeSponsors.length > 1;

  // Extended sponsors array with circular clones for infinite sliding
  const extendedSponsors = hasMultiple
    ? [activeSponsors[activeSponsors.length - 1], ...activeSponsors, activeSponsors[0]]
    : activeSponsors;

  // Reset index to 1 when sponsors list changes
  useEffect(() => {
    if (hasMultiple) {
      setCurrentIndex(1);
      setWithTransition(false);
    } else {
      setCurrentIndex(0);
    }
  }, [activeSponsors.length, hasMultiple]);

  // Auto-slide every 4 seconds when not dragging
  useEffect(() => {
    if (!hasMultiple || isDragging) return;

    const timer = setInterval(() => {
      setWithTransition(true);
      setCurrentIndex(prev => prev + 1);
    }, 4000);

    return () => clearInterval(timer);
  }, [hasMultiple, isDragging, currentIndex]);

  // Handle circular jump when transition ends
  const handleTransitionEnd = () => {
    if (!hasMultiple) return;

    if (currentIndex === 0) {
      // Reached leading clone -> jump to actual last item seamlessly
      setWithTransition(false);
      setCurrentIndex(activeSponsors.length);
    } else if (currentIndex === extendedSponsors.length - 1) {
      // Reached trailing clone -> jump to actual first item seamlessly
      setWithTransition(false);
      setCurrentIndex(1);
    }
  };

  // Ensure modal is closed if user navigates away (fixes BFCache blank screen issue)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setSelectedAd(null);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('popstate', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('popstate', handleVisibilityChange);
    };
  }, []);

  if (activeSponsors.length === 0) return null;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (!hasMultiple) return;
    setWithTransition(false);
    setIsDragging(true);
    setHasMoved(false);
    setIsScrolling(null);
    setDragOffset(0);

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setStartX(clientX);
    setStartY(clientY);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const diffX = clientX - startX;
    const diffY = clientY - startY;

    if (isScrolling === null && 'touches' in e) {
      if (Math.abs(diffY) > Math.abs(diffX) && Math.abs(diffY) > 6) {
        setIsScrolling(true);
        setIsDragging(false);
        setDragOffset(0);
        return;
      } else if (Math.abs(diffX) > 6) {
        setIsScrolling(false);
      }
    }

    if (isScrolling === true) return;

    if (Math.abs(diffX) > 6) {
      setHasMoved(true);
    }

    setDragOffset(diffX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 40;

    if (dragOffset < -threshold) {
      // Swiped left -> Next sponsor
      setWithTransition(true);
      setCurrentIndex(prev => prev + 1);
    } else if (dragOffset > threshold) {
      // Swiped right -> Previous sponsor
      setWithTransition(true);
      setCurrentIndex(prev => prev - 1);
    } else {
      // Snap back to current sponsor
      setWithTransition(true);
    }

    setDragOffset(0);
  };

  return (
    <div className={`mt-auto mb-8 ${className}`}>
      <p className="text-center text-[12px] text-gray-800 font-bold italic mb-2 tracking-tight">
        :: {isCoSponsor ? "Co-Sponsored by" : label} ::
      </p>

      {/* Smooth Touch Carousel Track */}
      <div
        className="relative w-full overflow-hidden select-none touch-pan-y cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div
          className="flex w-full"
          style={{
            transform: hasMultiple
              ? `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`
              : "none",
            transition: withTransition
              ? "transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)"
              : "none",
            willChange: "transform",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {extendedSponsors.map((sponsor, idx) => (
            <div
              key={`${sponsor._id || idx}-${idx}`}
              className="w-full shrink-0 flex justify-center items-center"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${sponsor.image}`}
                alt={label}
                draggable={false}
                className={`w-full h-auto select-none ${sponsor.adImage ? 'cursor-pointer' : ''}`}
                onClick={(e) => {
                  if (hasMoved) {
                    e.preventDefault();
                    return;
                  }
                  if (sponsor.adImage) {
                    setSelectedAd({ image: sponsor.adImage, cardId: sponsor.cardId });
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ad Modal */}
      {selectedAd && (
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] z-[100] bg-black/85 flex items-center justify-center p-4 shadow-2xl">
          <button
            onClick={() => setSelectedAd(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-[110] p-2 bg-black/50 rounded-full cursor-pointer"
            aria-label="Close Advertisement"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
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
