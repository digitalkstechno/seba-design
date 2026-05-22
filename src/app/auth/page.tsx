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
      <style>{`
        .auth-card {
          padding-left: min(5vw, 20px) !important;
          padding-right: min(5vw, 20px) !important;
          padding-top: min(6vw, 24px) !important;
        }
        .auth-header {
          font-size: min(3.875vw, 15.5px) !important;
          padding-right: min(27.5vw, 110px) !important;
          margin-top: min(2vw, 8px) !important;
        }
        .auth-profile-wrapper {
          right: min(5vw, 20px) !important;
          top: min(4vw, 16px) !important;
        }
        .auth-profile-glow {
          width: min(23.5vw, 94px) !important;
          height: min(23.5vw, 94px) !important;
        }
        .auth-profile-image {
          width: min(21.5vw, 86px) !important;
          height: min(21.5vw, 86px) !important;
        }
        .auth-logo {
          width: min(35vw, 140px) !important;
          margin-top: min(3vw, 12px) !important;
        }
        .auth-subtitle {
          font-size: min(3.125vw, 12.5px) !important;
          margin-top: min(3vw, 12px) !important;
          margin-left: min(4vw, 16px) !important;
        }
        .auth-form {
          margin-top: min(3vw, 12px) !important;
        }
        .auth-input-row {
          height: min(11.25vw, 45px) !important;
        }
        .auth-input-icon-box {
          width: min(12.5vw, 50px) !important;
        }
        .auth-input-icon {
          font-size: min(4.25vw, 17px) !important;
        }
        .auth-input {
          font-size: min(3.75vw, 15px) !important;
          padding-left: min(4vw, 16px) !important;
          padding-right: min(12vw, 48px) !important;
        }
        .auth-button {
          width: min(22.5vw, 90px) !important;
          border-radius: min(6vw, 24px) !important;
          margin-left: calc(-1 * min(5vw, 20px)) !important;
        }
        .auth-button-border {
          inset: min(2vw, 8px) !important;
          border-radius: min(4vw, 16px) !important;
        }
        .auth-button-icon {
          font-size: min(8.5vw, 34px) !important;
        }
        .auth-middle-title {
          font-size: min(6.5vw, 26px) !important;
        }
        .auth-middle-sub {
          font-size: min(3.75vw, 15px) !important;
        }
      `}</style>
      <div className="min-h-[100dvh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-[420px] h-[100dvh] bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl border border-gray-200 flex flex-col overflow-y-auto overflow-x-hidden pb-0 scrollbar-none auth-card">
          {/* Header */}
          <p className="text-start mt-2 text-[15.5px] text-gray-700 pr-[110px] italic leading-tight font-normal auth-header">
            Welcome to <span className="font-bold italic text-black">SEBA</span> Digital
            Directory
          </p>

          {/* Profile with beautiful soft golden-yellow glow (enlarged profile card) */}
          <div className="absolute right-5 top-4 z-20 auth-profile-wrapper">
            <div className="relative w-[94px] h-[94px] flex items-center justify-center auth-profile-glow">
              {/* Soft, decent background glow (subtle opacity and wider blur) */}
              <div className="absolute inset-0 rounded-full bg-[#facc15] blur-[18px] opacity-45" />
              {/* Image rendered directly to preserve its native circular shape and border without double-borders or white backgrounds */}
              <img
                src="/images/auth_page_1.png"
                alt="profile"
                className="relative z-10 w-[86px] h-[86px] object-contain drop-shadow-[0_2px_8px_rgba(250,204,21,0.25)] auth-profile-image"
              />
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mt-3">
            <img src="/images/logo.png" alt="logo" className="w-[140px] auth-logo" />
          </div>

          <p className="text-start ml-4 mt-3 text-[12.5px] italic text-gray-500 font-normal auth-subtitle">
            One time registration -{" "}
            <span className="font-semibold not-italic text-black">SAFETY FIRST</span>
          </p>

          {error && <p className="text-red-500 text-xs text-center mt-2 font-normal">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-3 flex items-stretch relative auth-form w-full min-w-0">
            <div className="flex-1 space-y-2 relative z-0 min-w-0">
              {/* Name */}
              <div className="flex items-center bg-white border border-gray-200 rounded-l-full overflow-hidden h-[45px] auth-input-row min-w-0">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-full shrink-0 auth-input-icon-box">
                  <FaUser className="text-white text-[17px] auth-input-icon" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="flex-1 bg-transparent pl-4 pr-12 py-2 text-[15px] outline-none text-gray-600 font-normal auth-input min-w-0"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="flex items-center bg-white border border-gray-200  rounded-l-full overflow-hidden h-[45px] auth-input-row min-w-0">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-full shrink-0 auth-input-icon-box">
                  <FaMobileAlt className="text-white text-[17px] auth-input-icon" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="flex-1 bg-transparent pl-4 pr-12 py-2 text-[15px] outline-none text-gray-600 font-normal auth-input min-w-0"
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
              className="w-[90px] shrink-0 bg-[#003944] rounded-[24px] relative shadow-lg flex items-center justify-center disabled:opacity-50 hover:scale-[1.02] transition-transform active:scale-95 z-10 ml-[-20px] auth-button"
            >
              <div className="absolute inset-[8px] border-[1.5px] border-white/60 rounded-[16px] auth-button-border" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#fff685] border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <div className="relative z-10 drop-shadow-[0_3px_3px_rgba(0,0,0,0.4)]">
                  <FaPlay className="text-[#fff685] text-[34px] ml-1 auth-button-icon" />
                </div>
              )}
            </button>
          </form>

          {/* Middle Content */}
          <div className="text-center mt-4">
            <h2 className="text-[26px] leading-none text-gray-800 auth-middle-title">
              <span className="italic font-bold">SEBA</span>{" "}
              <span className="italic font-light text-gray-650">member's</span>
            </h2>
            <p className="text-gray-400 text-[15px] mt-1.5 font-normal auth-middle-sub">Digital Version</p>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto flex flex-col items-center pt-2 pb-0">
            {/* Arrow */}
            <div className="flex justify-center mb-0.5">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.35 18.25L2.15 3.5C1.35 2.45 2.1 0.95 3.4 0.95H28.6C29.9 0.95 30.65 2.45 29.85 3.5L18.65 18.25C17.45 19.85 14.55 19.85 13.35 18.25Z" fill="#ef4444" />
              </svg>
            </div>

            {/* Info */}
            <div className="text-center mb-1 text-[14px]">
              <p className="text-[#ef4444] font-semibold text-[17px] mb-0.5">
                :: Powered by ::
              </p>
              <p className="leading-5 text-gray-500 font-normal">
                Surat East Builders Association <br />
                Surat (Gujarat) INDIA
              </p>
            </div>
          </div>

          {/* Footer in normal flow with negative margins to span edge-to-edge cleanly */}
          <div className="bg-[#003944] text-center py-3 text-[14px] font-sans z-30 border-t border-white/5 -mx-5">
            <span className="text-[#fff685]">Concept by :</span>{" "}
            <span className="font-bold text-white uppercase tracking-wider mx-1">D&G TECHNOSTEP</span>{" "}
            <span className="text-[#fff685]">- Surat</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
