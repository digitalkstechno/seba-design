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
          <p className="text-start mt-2 text-[14px] italic">
            Welcome to <span className="font-semibold">SEBA</span> Digital
            Directory
          </p>

          {/* Profile */}
          <div className="absolute right-4 top-4">
            <div className="p-[3px] rounded-full bg-yellow-300 shadow-[0_0_15px_#facc15]">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                <img
                  src="/images/user-profile.jpg"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mt-6">
            <img src="/images/logo.png" alt="logo" className="w-[180px]" />
          </div>

          <p className="text-start ml-4 mt-2 text-[13px] italic">
            One time registration -{" "}
            <span className="font-bold">SAFETY FIRST</span>
          </p>
          
          {error && <p className="text-red-500 text-xs text-center mt-2">{error}</p>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-2 flex items-stretch">
            <div className="w-[80%] space-y-3">
              {/* Name */}
              <div className="flex items-center bg-gray-200 rounded overflow-hidden">
                <div className="bg-[#0b4b4b] p-3">
                  <FaUser className="text-white text-[16px]" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                  required
                />
              </div>

              {/* Mobile */}
              <div className="flex items-center bg-gray-200 rounded overflow-hidden">
                <div className="bg-[#0b4b4b] p-3">
                  <FaMobileAlt className="text-white text-[16px]" />
                </div>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Mobile Number"
                  className="w-full bg-transparent px-3 py-2 text-sm outline-none"
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
              className="w-[20%] bg-[#0b4b4b] rounded-xl border-2 border-[#083737] relative shadow-md flex items-center justify-center disabled:opacity-50"
            >
              <div className="absolute inset-1 border border-white/30 rounded-lg" />
              {loading ? (
                 <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin relative z-10" />
              ) : (
                <FaPlay className="text-yellow-400 text-[32px] relative z-10" />
              )}
            </button>
          </form>

          {/* Middle Content */}
          <div className="text-center mt-5">
            <h2 className="text-[26px]">
              <span className="italic font-extrabold">SEBA</span>{" "}
              <span className="italic">member's</span>
            </h2>
            <p className="text-gray-800 mt-1">Digital Version</p>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mt-4">
            <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[18px] border-l-transparent border-r-transparent border-t-red-600" />
          </div>

          {/* Info */}
          <div className="text-center mt-4 text-[14px]">
            <p className="text-red-500 font-bold text-[16px]">
              :: Powered by ::
            </p>
            <p className="leading-5">
              Surat East Builders Association <br />
              Surat (Gujarat) INDIA
            </p>
          </div>

          {/* Footer */}
          <div className="bg-[#0b4b4b] text-center text-white py-3 text-sm mt-auto -mx-5">
            <span className="text-yellow-400">Concept by :</span>{" "}
            <span className="font-semibold">D&G Technostep</span>{" "}
            <span className="text-yellow-400">- Surat</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
