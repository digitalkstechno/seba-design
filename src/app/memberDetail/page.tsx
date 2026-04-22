'use client'

import { FaArrowLeft } from "react-icons/fa";
import { AiOutlineUser, AiOutlinePhone, AiOutlineHome } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { BsClock, BsGlobe, BsSend, BsShare } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";

export default function memberDetail() {
    const [isOn, setIsOn] = useState(true);
    const router = useRouter();

    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start ">
            <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

                {/* BACK */}
                <IoIosArrowBack onClick={() => router.back()} className="text-xl cursor-pointer" />

                {/* PROFILE */}
                <div className="flex justify-center mt-4">
                    <div className="w-[140px] h-[140px] rounded-full border-[8px] border-gray-300 overflow-hidden">
                        <img src="/images/member.webp" className="w-full h-full object-cover" />
                    </div>
                </div>

                {/* INFO BOXES */}
                <div className="mt-5 space-y-3 max-w-[500px]  p-5">

                    {/* NAME */}
                    <div className="flex items-stretch h-[35px]">
                        {/* ICON BOX - LEFT SHAPE */}
                        <div className="w-[40px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-400 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.1)] rounded-l-[20px]">
                            <AiOutlineUser className="text-[22px] text-gray-800" />
                        </div>
                        {/* SEPARATOR LINE */}
                        <div className="w-[1.5px] bg-gray-400"></div>
                        {/* TEXT BAR - RIGHT SHAPE */}
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-400 rounded-r-full shadow-[2px_4px_5px_rgba(0,0,0,0.15)] ml-[2px]">
                            <span className="text-[14px] font-bold text-black uppercase tracking-wide">
                                HIRENBHAI K. PATEL
                            </span>
                        </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-stretch h-[35px]">
                        <div className="w-[40px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-400 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.1)] rounded-l-[20px]">
                            <AiOutlinePhone className="text-[20px] text-gray-800" />
                        </div>
                        <div className="w-[1.5px] bg-gray-400"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-400 rounded-r-full shadow-[2px_4px_5px_rgba(0,0,0,0.15)] ml-[2px]">
                            <span className="text-[14px] font-bold text-black">9825222223</span>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-stretch h-[35px]">
                        <div className="w-[40px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-400 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.1)] rounded-l-[20px]">
                            <IoLocationOutline className="text-[20px] text-gray-800" />
                        </div>
                        <div className="w-[1.5px] bg-gray-400"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 py-1 border-y border-r border-gray-400 rounded-r-full shadow-[2px_4px_5px_rgba(0,0,0,0.15)] ml-[2px]">
                            <span className="text-[12px] font-bold text-black leading-tight">
                                B-86 Trikam Nagar Society, Near V-1<br />
                                Bombay Market, L.H Road, Surat -395003
                            </span>
                        </div>
                    </div>

                    {/* TIME */}
                    <div className="flex items-stretch h-[35px]">
                        <div className="w-[40px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-400 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.1)] rounded-l-[20px]">
                            <BsClock className="text-[20px] text-gray-800" />
                        </div>
                        <div className="w-[1.5px] bg-gray-400"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-400 rounded-r-full shadow-[2px_4px_5px_rgba(0,0,0,0.15)] ml-[2px]">
                            <span className="text-[14px] font-bold text-black">
                                10 am to 2 pm  &  5 pm to 7 pm
                            </span>
                        </div>
                    </div>

                    {/* WEBSITE */}
                    <div className="flex items-stretch h-[35px]">
                        <div className="w-[40px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-400 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.1)] rounded-l-[20px]">
                            <BsSend className="text-[18px] text-gray-800 -rotate-45" />
                        </div>
                        <div className="w-[1.5px] bg-gray-400"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-400 rounded-r-full shadow-[2px_4px_5px_rgba(0,0,0,0.15)] ml-[2px]">
                            <span className="text-[14px] font-bold text-black">www.mkgroup.com</span>
                        </div>
                    </div>

                </div>


                {/* OUTER LIGHT FRAME */}
                <div className="mt-6 bg-[#e5e5e5] p-2 rounded-2xl inline-block">
                    <div className="border-[3px] border-[#0b2f2f] rounded-xl p-[3px]">
                        <div className="border border-white/80 rounded-lg p-[2px]">
                            <div className="bg-[#003c3c] rounded-md px-14 py-5 flex justify-center items-center">
                                <img
                                    src="/images/mk-group-logo.png"
                                    alt="Logo"
                                    className="h-16 object-contain"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Radio button */}
                <div className="flex items-center justify-between mt-5 px-2">
                    {/* SHARE */}
                    <div className="flex flex-col items-center">

                        <div className="w-[55px] h-[50px] bg-[#e5e5e5] rounded-xl flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2)] border border-gray-300">
                            <BsShare className="text-[20px] text-gray-700" />
                        </div>
                        <span className="text-[11px] mt-1 text-gray-700">Share</span>
                    </div>


                    {/* TOGGLE (INLINE) */}
                    <div className="flex items-center justify-center flex-1">
                        <div
                            onClick={() => setIsOn(!isOn)}
                            className="relative w-[180px] h-[50px] rounded-full p-[3px] cursor-pointer flex items-center transition-all duration-300"
                        >
                            <div
                                className="absolute inset-[4px] rounded-full overflow-hidden"
                                style={{
                                    backgroundColor: "#bebebe",
                                    boxShadow: "inset 0 6px 12px rgba(0,0,0,0.3)",
                                    borderTop: "3px solid #999"
                                }}
                            >
                                <div
                                    className={`absolute inset-0 transition-opacity duration-500 ${isOn ? "opacity-100" : "opacity-0"}`}
                                    style={{
                                        background: "linear-gradient(to bottom, #28b446, #1e9a3a)",
                                        boxShadow: "inset 0 4px 8px rgba(0,0,0,0.2)"
                                    }}
                                />
                            </div>

                            <div
                                className="absolute h-[40px] w-[90px] rounded-full transition-all duration-500 flex items-center px-[5px]"
                                style={{
                                    transform: isOn ? "translateX(2px)" : "translateX(87px)",
                                    background: "linear-gradient(to bottom, #ffffff, #e0e0e0)",
                                    boxShadow: "0 6px 15px rgba(0,0,0,0.3), inset 0 2px 2px white",
                                    zIndex: 1
                                }}
                            >
                                <div
                                    className="w-[46px] h-[36px] rounded-full transition-all duration-500"
                                    style={{
                                        background: "radial-gradient(circle at 30% 30%, #ffffff, #d4d4d4)",
                                        boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(0,0,0,0.1)",
                                        transform: isOn ? "translateX(0px)" : "translateX(39px)"
                                    }}
                                />
                            </div>

                            <span
                                className="absolute font-bold text-xl text-white"
                                style={{
                                    right: isOn ? "25px" : "105px",
                                    textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                                }}
                            >
                                {isOn ? "ON" : "OFF"}
                            </span>
                        </div>
                    </div>


                    {/* EDIT */}
                    <div className="flex flex-col items-center">

                        <div className="w-[55px] h-[50px] bg-[#e5e5e5] rounded-xl flex items-center justify-center shadow-[inset_0_3px_6px_rgba(0,0,0,0.2),0_2px_4px_rgba(0,0,0,0.2)] border border-gray-300">
                            <LuLayoutDashboard className="text-[20px] text-gray-700" />
                        </div>

                        <span className="text-[11px] mt-1 text-gray-700">Edit</span>
                    </div>

                </div>



                {/* Bottom Navigation Bar */}
                <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">
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
                        onClick={() => router.push('/advertisement')}
                        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
                        <BsShare className="text-lg" />
                        <span className="text-[10px] mt-1">share</span>
                    </button>
                </div>
            </div>


        </div>
    );
}