"use client";

import { FC, FormEvent, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaUser, FaMobileAlt, FaPlay } from "react-icons/fa";
import api from "@/lib/axios";
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils";

const Login: FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobile, setMobile] = useState(formatPhoneNumber(""));

  useEffect(() => {
    const name = sessionStorage.getItem("seba_user_name");
    const mob = sessionStorage.getItem("seba_user_mobile");
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
    sessionStorage.setItem("seba_user_name", name);
    sessionStorage.setItem("seba_user_mobile", cleanedMobile);

    try {
      const response = await api.post("/seba/user/login", { name, mobile: cleanedMobile });
      if (response.data.status === "Success") {
        sessionStorage.setItem("seba_token", response.data.data.token);
      }
    } catch (err: any) {
      console.log("Not a member, proceeding as guest");
      // Clear token if it exists from a previous login
      sessionStorage.removeItem("seba_token");
    } finally {
      setLoading(false);
      router.push("/home");
    }
  };

  return (
    <>
      <div className="h-screen bg-[#d9d9d9] flex flex-col items-center">
        <div className="w-[420px] h-full bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <p className="text-start mt-2 text-[15px] text-gray-800">
            Welcome to <span className="font-black italic">SEBA</span> Digital
            Directory
          </p>

          {/* Profile */}
          <div className="absolute right-5 top-5">
            <img
              src="/images/auth_page_1.png"
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src="/images/logo.png" alt="logo" className="w-[180px]" />
          </div>

          <p className="text-start ml-4 mt-6 text-[14px] italic">
            One time registration -{" "}
            <span className="font-bold not-italic">SAFETY FIRST</span>
          </p>

          {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 flex items-stretch gap-2">
            <div className="flex-1 space-y-2">
              {/* Name */}
              <div className="flex items-center bg-[#e5e7eb] rounded-lg overflow-hidden h-[45px]">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-lg">
                  <FaUser className="text-white text-[18px]" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="flex-1 bg-transparent px-4 py-2 text-[15px] outline-none text-gray-700 font-medium"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="flex items-center bg-[#e5e7eb] rounded-lg overflow-hidden h-[45px]">
                <div className="bg-[#003944] h-full w-[50px] flex items-center justify-center rounded-l-lg">
                  <FaMobileAlt className="text-white text-[18px]" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="flex-1 bg-transparent px-4 py-2 text-[15px] outline-none text-gray-700 font-medium"
                  value={mobile}
                  onChange={(e) => setMobile(formatPhoneNumber(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-[90px] bg-[#003944] rounded-[24px] relative shadow-xl flex items-center justify-center disabled:opacity-50 hover:scale-[1.02] transition-transform active:scale-95"
            >
              <div className="absolute inset-[8px] border-[1.5px] border-white/60 rounded-[16px]" />
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#fff685] border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <div className="relative z-10 drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
                  <FaPlay className="text-[#fff685] text-[34px] ml-1" />
                </div>
              )}
            </button>
          </form>

          {/* Middle Content */}
          <div className="text-center mt-12">
            <h2 className="text-[36px] leading-none">
              <span className="italic font-black">SEBA</span>{" "}
              <span className="italic font-normal">member's</span>
            </h2>
            <p className="text-gray-500 text-[20px] mt-2 font-medium">Digital Version</p>
          </div>

          {/* Bottom Section */}
          <div className="mt-auto flex flex-col items-center">
            {/* Arrow */}
            <div className="flex justify-center mb-1">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.35 18.25L2.15 3.5C1.35 2.45 2.1 0.95 3.4 0.95H28.6C29.9 0.95 30.65 2.45 29.85 3.5L18.65 18.25C17.45 19.85 14.55 19.85 13.35 18.25Z" fill="#ef4444" />
              </svg>
            </div>

            {/* Info */}
            <div className="text-center mb-8 text-[14px]">
              <p className="text-[#ef4444] font-bold text-[18px] mb-1">
                :: Powered by ::
              </p>
              <p className="leading-5 text-gray-600 font-medium">
                Surat East Builders Association <br />
                Surat (Gujarat) INDIA
              </p>
            </div>

            {/* Footer */}
            <div className="bg-[#003944] w-full text-center py-4 text-[15px] -mx-5 px-5">
              <span className="text-[#fff685]">Concept by :</span>{" "}
              <span className="font-bold text-white uppercase tracking-wider mx-1">D&G Technostep</span>{" "}
              <span className="text-[#fff685]">- Surat</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
