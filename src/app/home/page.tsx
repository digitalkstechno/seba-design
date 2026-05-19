"use client";

import { FaEye, FaFacebookF, FaInstagram } from "react-icons/fa";
import { BsShare, BsGlobe } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu"; // Dropbox icon mate substitute
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import FooterSponsors from "@/components/FooterSponsors";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getCookie } from "@/lib/cookies";

const HomeContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewCount, setViewCount] = useState<string>("000000");
  const [sponsors, setSponsors] = useState<any[]>([]);

  const menu = [
    {
      label: "Associated",
      img: "/images/Associated.png",
      path: "/accociated",
    },
    {
      label: "Members",
      img: "/images/member.png",
      path: "/member",
    },
    {
      label: "New Member",
      img: "/images/new_member.png",
      path: "/newMember",
    },
    {
      label: "Search",
      img: "/images/search.png",
      path: "/search",
    },
  ];

  useEffect(() => {
    const incrementViewCount = async () => {
      try {
        const { data } = await api.post("/seba/view");
        if (data.status === "Success") {
          setViewCount(String(data.data.viewCount).padStart(6, '0'));
        }
      } catch (err) {
        console.error("Failed to increment view count", err);
      }
    };

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

    incrementViewCount();
    fetchSponsors();
  }, []);

  useEffect(() => {
    if (searchParams.get('restricted') === 'true') {
      setShowRestriction(true);
    }
  }, [searchParams]);

  const [showRestriction, setShowRestriction] = useState(false);

  const handleMenuClick = (item: any) => {
    if (item.label === "Members") {
      const token = getCookie("seba_token");
      if (!token) {
        setShowRestriction(true);
        return;
      }
    }
    router.push(item.path);
  };

  const mainSponsor = sponsors.find(s => s.type === 'sponsor');
  const coSponsor = sponsors.find(s => s.type === 'co-sponsor');

  return (
    <>
      <div className="h-[100dvh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-[420px] h-full bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl overflow-hidden border border-gray-200 flex flex-col">

          {/* Restriction Modal */}
          {showRestriction && (
            <div 
              onClick={() => setShowRestriction(false)}
              className="absolute inset-0 bg-black/65 backdrop-blur-[3px] z-[100] flex items-center justify-center p-6 cursor-pointer"
            >
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[310px] animate-in zoom-in-95 duration-300 flex flex-col items-center text-center relative border border-gray-100"
              >
                {/* Close X */}
                <button 
                  onClick={() => setShowRestriction(false)}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors text-lg"
                >
                  ✕
                </button>

                {/* Only and Only SEBA Logo */}
                <img 
                  src="/images/logo.png" 
                  alt="SEBA Logo" 
                  className="w-[125px] object-contain mb-5" 
                />

                {/* Only That Specific Text */}
                <p className="text-[14.5px] font-bold text-gray-800 tracking-wide whitespace-nowrap">
                  Only for the SEBA members
                </p>
              </div>
            </div>
          )}

          {/* Profile with beautiful soft golden-yellow glow (same size as auth page) */}
          <div className="absolute right-5 top-4 z-20">
            <div className="relative w-[94px] h-[94px] flex items-center justify-center">
              {/* Soft, decent background glow (subtle opacity and wider blur) */}
              <div className="absolute inset-0 rounded-full bg-[#facc15] blur-[18px] opacity-45" />
              {/* Image rendered directly to preserve its native circular shape and border without double-borders or white backgrounds */}
              <img
                src="/images/auth_page_1.png"
                alt="profile"
                className="relative z-10 w-[86px] h-[86px] object-contain drop-shadow-[0_2px_8px_rgba(250,204,21,0.25)]"
              />
            </div>
          </div>

          {/* Top Section */}
          <div className="flex justify-between items-start mb-2">
            <div className="pr-[110px]">
              <p className="text-[13.5px] italic text-gray-700">
                Welcome to <span className="font-bold text-black not-italic">SEBA</span> digital directory
              </p>
              {/* View Counter */}
              <div className="flex items-center mt-2.5 w-fit">
                <div className="mr-2 flex items-center justify-center shrink-0">
                  <Image
                    src="/images/eyes.png"
                    alt="Eye"
                    width={31}
                    height={31}
                    className="object-contain"
                  />
                </div>
                <div className="flex space-x-[6px] ml-0.5 items-center">
                  {viewCount
                    .split("")
                    .map((n, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-center font-['Digital7'] text-[24px] text-gray-800"
                      >
                        {n}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src="/images/logo.png" className="w-[180px]" alt="logo" />
          </div>

          {/* Floating Social Media Tabs - EXACT MATCH (Pixel-perfect, compact, and slightly smaller) */}
          <div className="absolute right-[-15px] top-[180px] flex flex-col items-end gap-3 z-40">
            {/* facebook */}
            <div className="relative flex items-center bg-[#1877f2] hover:bg-[#166fe5] h-[28px] pl-[32px] pr-4 rounded-l-full shadow-md transform -rotate-[12deg] origin-right transition-transform hover:-translate-x-1 cursor-pointer">
              <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center shadow-sm border border-gray-100/50">
                <FaFacebookF className="text-[#1877f2] text-[14px]" />
              </div>
              <span className="text-[11.5px] font-bold italic text-white font-sans tracking-wide">facebook</span>
            </div>
            {/* instagram */}
            <div className="relative flex items-center bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] h-[28px] pl-[32px] pr-4 rounded-l-full shadow-md transform -rotate-[12deg] origin-right transition-transform hover:-translate-x-1 cursor-pointer">
              <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 bg-white rounded-full w-[30px] h-[30px] flex items-center justify-center shadow-sm border border-gray-100/50">
                <FaInstagram className="text-[#e1306c] text-[15px]" />
              </div>
              <span className="text-[11.5px] font-bold italic text-white font-sans tracking-wide">instagram</span>
            </div>
            {/* events */}
            <div className="relative flex items-center bg-[#00a859] hover:bg-[#009650] h-[28px] pl-[32px] pr-4 rounded-l-full shadow-md transform -rotate-[12deg] origin-right transition-transform hover:-translate-x-1 cursor-pointer">
              <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 bg-black rounded-full w-[30px] h-[30px] flex items-center justify-center shadow-sm border border-yellow-500/25">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="scale-[1.05]">
                  <path d="M3 21h18" />
                  <path d="M5 21V10l4-3v14" />
                  <path d="M9 21V12l4-1v10" />
                  <path d="M13 21V5l6 3v13" />
                </svg>
              </div>
              <span className="text-[11.5px] font-bold italic text-[#ccff00] font-sans tracking-wide">events</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 justify-items-center">
            {menu.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleMenuClick(item)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="bg-white rounded-xl w-[70px] h-[70px] flex justify-center items-center shadow-md border border-gray-200 group-hover:bg-gray-50 transition-all overflow-hidden relative">
                  <Image
                    src={item.img}
                    alt={item.label}
                    width={150}
                    height={150}
                    className="object-contain max-w-none scale-[2.1]"
                  />
                </div>

                <p className="text-[12px] mt-2 italic font-bold text-gray-700">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-center mt-6 text-[19px] font-georgia italic font-bold text-[#1a1a1a] tracking-wide">
            Your Digital Partner to Grow
          </p>

          <FooterSponsors type="sponsor" />

          <Footer />
        </div>
      </div>
    </>
  );
};

const Home = () => {
  return (
    <Suspense fallback={<div className="h-screen bg-[#d9d9d9] flex justify-center items-center">Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
};

export default Home;
