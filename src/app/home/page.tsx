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

const HomeContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewCount, setViewCount] = useState<string>("000000");
  const [sponsors, setSponsors] = useState<any[]>([]);

  const menu = [
    {
      label: "Associated",
      img: "https://cdn-icons-png.flaticon.com/512/1055/1055644.png",
      path: "/accociated",
    },
    {
      label: "Members",
      img: "https://cdn-icons-png.flaticon.com/512/33/33308.png",
      path: "/member",
    },
    {
      label: "New Member",
      img: "https://cdn-icons-png.flaticon.com/512/1250/1250592.png",
      path: "/newMember",
    },
    {
      label: "Search",
      icon: <FiSearch className="text-red-600 text-lg" />,
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
      const token = localStorage.getItem("seba_token");
      const registered = localStorage.getItem("seba_registered");
      if (!token && !registered) {
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
      <div className="h-screen bg-[#d9d9d9] flex flex-col items-center">
        <div className="w-[420px] min-h-screen bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl overflow-hidden border border-gray-200 flex flex-col">
          
          {/* Restriction Modal */}
          {showRestriction && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-[100] flex items-center justify-center p-6">
              <div className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-[320px] animate-in zoom-in-95 duration-300 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                   <div className="w-8 h-8 rounded-full border-4 border-red-500 border-t-transparent animate-spin-slow" />
                   <span className="absolute text-red-500 font-bold text-2xl">!</span>
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Access Restricted</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  To view our digital directory, you must first <span className="font-bold text-gray-800">Become a SEBA Member</span>.
                </p>
                
                <div className="flex flex-col gap-3 w-full">
                  <button 
                    onClick={() => router.push("/newMember")}
                    className="w-full bg-[#0b4b4b] text-white py-3.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all"
                  >
                    Register Now
                  </button>
                  <button 
                    onClick={() => setShowRestriction(false)}
                    className="w-full bg-gray-100 text-gray-600 py-3.5 rounded-xl font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all"
                  >
                    Maybe Later
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Top Section */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[14px] italic text-gray-800">
                Welcome to <span className="font-bold">SEBA</span> digital directory
              </p>
              {/* View Counter */}
              <div className="flex items-center gap-2 mt-1">
                <FaEye className="text-[#3b5998] text-[20px]" />
                <span className="text-[28px] font-mono font-medium text-gray-900 tracking-[1px]">
                  {viewCount}
                </span>
              </div>
            </div>

            {/* Profile */}
            <div className="absolute right-4 top-4">
              <div className="p-[3px] rounded-full bg-yellow-300 shadow-[0_0_15px_#facc15]">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                  <img
                    src="/images/user-profile.jpg"
                    className="w-full h-full object-cover"
                    alt="profile"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src="/images/logo.png" className="w-[180px]" alt="logo" />
          </div>

          {/* Floating Social Media Tabs - EXACT MATCH */}
          <div className="absolute right-[-18px] top-[180px] flex flex-col items-end gap-[30px]">
            {/* facebook */}
            <div className="relative z-30 flex items-center bg-[#33a1f2] text-white pl-2 pr-6 py-1 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
              <div className="bg-[#3b5998] rounded-full w-[24px] h-[24px] flex items-center justify-center border border-white/20">
                <FaFacebookF className="text-white text-[11px]" />
              </div>
              <span className="text-[12px] font-bold italic ml-2">facebook</span>
            </div>
            {/* instagram */}
            <div className="relative z-20 -mt-5 flex items-center bg-gradient-to-r from-[#f09433] via-[#e6683c] to-[#bc1888] text-white pl-2 pr-6 py-1 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
              <div className="bg-white rounded-full w-[24px] h-[24px] flex items-center justify-center">
                <FaInstagram className="text-[#e1306c] text-[12px]" />
              </div>
              <span className="text-[12px] font-bold italic ml-2">instagram</span>
            </div>
            {/* events */}
            <div className="relative z-10 -mt-5 flex items-center bg-[#00a859] text-white pl-2 pr-6 py-1 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
              <div className="bg-black rounded-full w-[24px] h-[24px] flex items-center justify-center">
                <div className="w-[12px] h-[12px] bg-yellow-400 rounded-full"></div>
              </div>
              <span className="text-[12px] font-bold italic ml-2 text-[#ccff00]">events</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6 justify-items-center">
            {menu.map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleMenuClick(item)}
                className="flex flex-col items-center cursor-pointer group"
              >
                <div className="bg-gray-200/60 rounded-xl w-[70px] h-[65px] flex justify-center items-center shadow-md border border-gray-100 group-hover:bg-gray-300 transition-all active:scale-95">
                   {item.img ? (
                     <img
                       src={item.img}
                       alt={item.label}
                       className="h-7 w-7 object-contain"
                     />
                   ) : (
                     item.icon
                   )}
                </div>

                <p className="text-[12px] mt-2 italic font-bold text-gray-700">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          {/* Tagline */}
          <p className="text-center italic mt-6 text-[18px] font-extrabold text-[#003d3d]">
            Your Digital Partner to Grow
          </p>

          <FooterSponsors type="sponsor" />

          {/* Bottom Navigation Bar */}
          <div className="bg-[#003d3d] -mx-5 px-6 py-3 flex justify-between items-center text-white">
            <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
              <AiOutlineHome className="text-xl" />
              <span className="text-[10px] mt-1">home</span>
            </div>

            <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
              <img
                src="/images/seba-link1.png"
                alt="home"
                className="w-8 h-8  object-contain"
              />
              <span className="text-[10px] -mt-1 ">App Link</span>
            </div>

            <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
              <BsGlobe className="text-xl" />
              <span className="text-[10px] mt-1">www.seba</span>
            </div>

            <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
              <LuLayoutDashboard className="text-xl" />
              <span className="text-[10px] mt-1">dropbox</span>
            </div>

            <button
              onClick={() => router.push("/advertisement")}
              className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100"
            >
              <BsShare className="text-lg" />
              <span className="text-[10px] mt-1">share</span>
            </button>
          </div>
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
