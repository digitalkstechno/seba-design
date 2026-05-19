"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaMobileAlt, FaPlay } from "react-icons/fa";
import api from "@/lib/axios";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils";
import { setCookie, getCookie, deleteCookie } from "@/lib/cookies";

const Login: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(formatPhoneNumber(""));

  useEffect(() => {
    const name = getCookie("seba_user_name");
    const mob = getCookie("seba_user_mobile");
    if (name && mob) {
      router.replace("/home");
    }
  }, [router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const cleanedMobile = cleanPhoneNumber(mobile);

    if (cleanedMobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setLoading(true);
    setError("");

    // Always store details to skip splash next time if needed
    setCookie("seba_user_name", name);
    setCookie("seba_user_mobile", cleanedMobile);

    try {
      const response = await api.post("/seba/user/login", { name, mobile: cleanedMobile });
      if (response.data.status === "Success") {
        setCookie("seba_token", response.data.data.token);
      }
    } catch (err: any) {
      console.log("Not a member, proceeding as guest");
      // Clear token if it exists from a previous login
      deleteCookie("seba_token");
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  return (
    <>
      <div className="h-[100dvh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-[420px] h-full bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Header */}
          <p className="text-start mt-2 text-[15.5px] text-gray-700 pr-[110px] italic leading-tight font-normal">
            Welcome to <span className="font-bold italic text-black">SEBA</span> Digital
            Directory
          </p>

          {/* Profile with beautiful soft golden-yellow glow (enlarged profile card) */}
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

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src="/images/logo.png" alt="logo" className="w-[180px]" />
          </div>

          <p className="text-start ml-4 mt-5 text-[12.5px] italic text-gray-500 font-normal">
            One time registration -{" "}
            <span className="font-semibold not-italic text-black">SAFETY FIRST</span>
          </p>

          {error && <p className="text-red-500 text-xs text-center mt-2 font-normal">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 flex items-stretch relative">
            <div className="flex-1 space-y-2 relative z-0">
              {/* Name */}
              <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-[45px]">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-full shrink-0">
                  <FaUser className="text-white text-[17px]" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="flex-1 bg-transparent pl-4 pr-12 py-2 text-[15px] outline-none text-gray-600 font-normal"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden h-[45px]">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-full shrink-0">
                  <FaMobileAlt className="text-white text-[17px]" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="flex-1 bg-transparent pl-4 pr-12 py-2 text-[15px] outline-none text-gray-600 font-normal"
                  value={mobile}
                  onChange={(e) => setMobile(formatPhoneNumber(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Submit Button overlapping inputs to look like they end behind it */}
            <button
              type="submit"
              disabled={loading}
              className="w-[90px] bg-[#003944] rounded-[24px] relative shadow-lg flex items-center justify-center disabled:opacity-50 hover:scale-[1.02] transition-transform active:scale-95 z-10 ml-[-20px]"
            >
              <div className="absolute inset-[8px] border-[1.5px] border-white/60 rounded-[16px]" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#fff685] border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <div className="relative z-10 drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                  <FaPlay className="text-[#fff685] text-[34px] ml-1" />
                </div>
              )}
            </button>
          </form>

          {/* Middle Content */}
          <div className="text-center mt-8">
            <h2 className="text-[26px] leading-none text-gray-800">
              <span className="italic font-bold">SEBA</span>{" "}
              <span className="italic font-light text-gray-650">member's</span>
            </h2>
            <p className="text-gray-400 text-[15px] mt-1.5 font-normal">Digital Version</p>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto flex flex-col items-center pb-[60px]">
            {/* Arrow */}
            <div className="flex justify-center mb-1">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.35 18.25L2.15 3.5C1.35 2.45 2.1 0.95 3.4 0.95H28.6C29.9 0.95 30.65 2.45 29.85 3.5L18.65 18.25C17.45 19.85 14.55 19.85 13.35 18.25Z" fill="#ef4444" />
              </svg>
            </div>

            {/* Info */}
            <div className="text-center mb-4 text-[14px]">
              <p className="text-[#ef4444] font-semibold text-[17px] mb-0.5">
                :: Powered by ::
              </p>
              <p className="leading-5 text-gray-500 font-normal">
                Surat East Builders Association <br />
                Surat (Gujarat) INDIA
              </p>
            </div>
          </div>

          {/* Footer positioned absolute bottom to span edge-to-edge cleanly with no bottom/side spaces */}
          <div className="absolute bottom-0 left-0 right-0 bg-[#003944] text-center py-4 text-[14.5px] font-sans z-30">
            <span className="text-[#fff685]">Concept by :</span>{" "}
            <span className="font-bold text-white uppercase tracking-wider mx-1">D&G Technostep</span>{" "}
            <span className="text-[#fff685]">- Surat</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
