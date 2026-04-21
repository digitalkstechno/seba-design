'use client';

import { AiOutlineHome } from "react-icons/ai";
import { BsGlobe, BsShare } from "react-icons/bs";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

const Member = () => {
    // Array of 10 items to test scrolling
    const members = Array.from({ length: 4 });

    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start ">

            <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <FaArrowLeft className="text-xl cursor-pointer" />
                        <p className="text-[14px] italic">
                            Welcome to <span className="font-semibold">SEBA</span> Members List
                        </p>
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

                {/* Search */}
                <div className="mt-8 mb-4 flex items-center bg-gray-200 rounded-full px-4 py-2">
                    <input
                        type="text"
                        placeholder="Search by Name / Surnames"
                        className="flex-1 bg-transparent outline-none text-sm"
                    />
                    <FaSearch className="text-gray-700" />
                </div>

                {/* --- SCROLLABLE AREA START --- */}
                {/* max-h-[580px] allows roughly 3 cards to show. 
                   overflow-y-auto enables scrolling.
                   scrollbar-hide is used to keep the clean look.
                */}
               <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
                    {members.map((_, i) => (
                        <div key={i} className="mb-4 border border-gray-300 bg-white">

                            <div className="flex p-2 gap-2">
                                {/* Image + ID */}
                                <div className="w-[70px] text-center text-[11px]">
                                    <img
                                        src="/images/member.webp"
                                        className="w-[60px] h-[70px] object-cover mx-auto"
                                    />
                                    <p className="mt-1 font-medium">SEBA00059</p>
                                    <p>25/01/1986</p>
                                </div>

                                {/* Details */}
                                <div className="flex-1 text-[12px] leading-5">
                                    <p className="font-semibold text-[13px]">
                                        HIRENBHAI K. PATEL - Media Head
                                    </p>
                                    <p>Builder & Developers</p>
                                    <p className="font-semibold">M K GROUP</p>
                                    <p>98252 22223</p>
                                    <p>
                                        B-86 Trikam Nagar Society, Near V-1 Bombay Market, L.H. Road,
                                        Surat - 395003
                                    </p>
                                </div>
                            </div>

                            {/* Footer strip */}
                            <div className="bg-[#015d82] text-white text-center text-[12px] py-1">
                                www.website / email :
                            </div>
                        </div>
                    ))}
                </div>
                {/* --- SCROLLABLE AREA END --- */}

                {/* Bottom Navigation Bar */}
               <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">
                    <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <AiOutlineHome className="text-xl" />
                        <span className="text-[10px] mt-1">home</span>
                    </div>

                    <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <div className="bg-white rounded-sm p-[2px]">
                            <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                        </div>
                        <span className="text-[10px] mt-1">app link</span>
                    </div>

                    <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <BsGlobe className="text-xl" />
                        <span className="text-[10px] mt-1">www.seba</span>
                    </div>

                    <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <LuLayoutDashboard className="text-xl" />
                        <span className="text-[10px] mt-1">dropbox</span>
                    </div>

                    <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <BsShare className="text-lg" />
                        <span className="text-[10px] mt-1">share</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Member;