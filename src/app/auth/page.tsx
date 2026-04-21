'use client';

import { useRouter } from 'next/navigation';
import { FaUser, FaMobileAlt, FaPlay } from "react-icons/fa";

const Login = () => {
    const router = useRouter();
    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start ">

            {/* Card */}
              <div className="w-[420px] h-screen bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl overflow-hidden border border-gray-200 flex flex-col">

                {/* Top Text */}
                <p className="text-center text-[14px] italic">
                    Welcome to <span className="font-semibold">SEBA</span> Digital Directory
                </p>

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

                {/* Logo */}
                <div className="flex justify-center mt-6">
                    <img src="/images/logo.png" className="w-[180px]" alt="logo" />
                </div>

                {/* Tagline */}
                <p className="text-center mt-4 text-[13px] italic">
                    One time registration -{" "}
                    <span className="font-bold">SAFETY FIRST</span>
                </p>

                {/* Form Section */}
                <div className="mt-6 flex items-center">

                    {/* Inputs */}
                    <div className="flex-1 space-y-3">

                        {/* Name */}
                        <div className="flex items-center bg-gray-200 rounded overflow-hidden">
                            <div className="bg-[#0b4b4b] p-3">
                                <FaUser className="text-white text-[16px]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Name"
                                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                            />
                        </div>

                        {/* Mobile */}
                        <div className="flex items-center bg-gray-200 rounded overflow-hidden">
                            <div className="bg-[#0b4b4b] p-3">
                                <FaMobileAlt className="text-white text-[16px]" />
                            </div>
                            <input
                                type="text"
                                placeholder="Mobile Number"
                                className="w-full bg-transparent px-3 py-2 text-sm outline-none"
                            />
                        </div>

                    </div>

                    {/* Play Button */}
                    <button
                        onClick={() => router.push('/home')}
                        className="bg-[#0b4b4b] p-4 rounded-xl border-2 border-[#083737] relative shadow-md ">
                        <div className="absolute inset-1 border border-white/30 rounded-lg"></div>
                        <FaPlay className="text-yellow-400 text-[22px] relative z-10 cursor-pointer" />
                    </button>

                </div>

                {/* Middle Text */}
                <div className="text-center mt-10">
                    <h2 className="text-[26px]">
                        <span className="italic font-extrabold">SEBA</span>{" "}
                        <span className="italic">member's</span>
                    </h2>
                    <p className="text-gray-800 mt-1">Digital Version</p>
                </div>

                {/* Triangle */}
                <div className="flex justify-center mt-4">
                    <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[18px] border-l-transparent border-r-transparent border-t-red-600"></div>
                </div>

                {/* Powered */}
                <div className="text-center mt-4 text-[14px]">
                    <p className="text-red-500">:: Powered by ::</p>
                    <p className="leading-5">
                        Surat East Builders Association- <br />
                        Surat (Gujarat) INDIA
                    </p>
                </div>

                {/* Footer (FULL WIDTH - FIXED) */}
                 <div className="bg-[#0b4b4b] text-center text-white py-3 text-sm mt-30 -mx-5">
                    <span className="text-yellow-400">Concept by :</span>{" "}
                    <span className="font-semibold">D&G Technostep</span>{" "}
                    <span className="text-yellow-400">- Surat</span>
                </div>

            </div>
        </div>
    );
};

export default Login;