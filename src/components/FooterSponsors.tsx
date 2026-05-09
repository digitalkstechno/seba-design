"use client";

import { useEffect, useState } from "react";
import api from "@/lib/axios";

const FooterSponsors = ({ type }: { type?: 'sponsor' | 'co-sponsor' }) => {
  const [sponsors, setSponsors] = useState<any[]>([]);

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

  const mainSponsor = sponsors.find(s => s.type === 'sponsor');
  const coSponsor = sponsors.find(s => s.type === 'co-sponsor');

  // Logic based on prop
  let activeSponsor = null;
  let label = "";

  if (type === 'sponsor') {
    activeSponsor = mainSponsor;
    label = "Sponsor";
  } else if (type === 'co-sponsor') {
    activeSponsor = coSponsor;
    label = "Co-Sponsor";
  } else {
    // Default priority logic for Home if no type specified (or explicitly for Home)
    activeSponsor = mainSponsor || coSponsor;
    label = mainSponsor ? "Sponsor" : "Co-Sponsor";
  }

  if (!activeSponsor) return null;

  const isCoSponsor = type === 'co-sponsor';

  return (
    <div className={`mt-auto ${isCoSponsor ? "px-2" : "px-4"} pb-20`}>
      <p className="text-center text-[12px] text-gray-800 font-bold italic mb-2 tracking-tight">
        :: {isCoSponsor ? "Co-Sponsored by" : label} ::
      </p>
      <div 
        className={`rounded-2xl shadow-xl flex justify-center overflow-hidden border ${
          isCoSponsor 
            ? "bg-white/90 border-[#d4b958] h-[140px]" 
            : "bg-white/80 border-[#0b4b4b] h-[120px]"
        }`}
      >
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${activeSponsor.image}`}
          alt={label}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  );
};

export default FooterSponsors;
