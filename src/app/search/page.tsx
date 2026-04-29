'use client';

import { useState, useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import { BsGlobe, BsShare } from "react-icons/bs";
import { IoCaretDownOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { AiOutlineHome } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import api from "@/lib/axios";

const Search = () => {
    const router = useRouter();
    const [isOn, setIsOn] = useState(false);
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [category, setCategory] = useState("");
    const [area, setArea] = useState("");
    const [categories, setCategories] = useState<string[]>([]);
    const [areas, setAreas] = useState<string[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const { data } = await api.get('/seba/member');
                if (data.status === 'Success') {
                    const members = data.data;
                    const cats = Array.from(new Set(members.map((m: any) => m.category).filter(Boolean))) as string[];
                    const ars = Array.from(new Set(members.map((m: any) => m.area).filter(Boolean))) as string[];
                    setCategories(cats);
                    setAreas(ars);
                }
            } catch (err) {
                console.error("Failed to fetch search options", err);
            }
        };
        fetchOptions();
    }, []);

    const toggleDropdown = (type: string) => {
        setOpenDropdown(openDropdown === type ? null : type);
    };

    const handleToggle = () => {
        const newIsOn = !isOn;
        setIsOn(newIsOn);
        if (newIsOn) {
            let query = '';
            if (category && area) query = `?category=${category}&area=${area}`;
            else if (category) query = `?category=${category}`;
            else if (area) query = `?area=${area}`;
            
            setTimeout(() => {
                router.push(`/member${query}`);
            }, 500);
        }
    };

    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">
            <div className="w-[420px] h-full bg-[#eeeeee] relative px-4 pt-4 shadow-md flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <IoIosArrowBack onClick={() => router.back()} className="text-xl cursor-pointer" />
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

                {/* Title */}
                <div className="flex justify-center mt-10">
                    <h1 className="flex items-center text-[34px] tracking-[0.5px] font-[Poppins]">

                        {/* Styled S */}
                        <span className="text-red-600 font-extrabold text-[38px] leading-none mr-[2px] tracking-tight">
                            S
                        </span>

                        {/* earch */}
                        <span className="text-gray-800 font-bold font-medium">earch</span>

                        {/* Space */}
                        <span className="mx-[4px] text-gray-800 font-bold"></span>

                        {/* P */}
                        <span className="text-gray-700 font-medium">P</span>

                        {/* Search Icon */}
                        <FiSearch className="text-blue-500 text-[28px] mt-[6px] mx-[1px]" />

                        {/* int */}
                        <span className="text-gray-800 font-bold font-medium">int</span>

                    </h1>
                </div>

                {/* Dropdowns */}
                <div className="mt-8 flex flex-col gap-4">

                    {/* Category */}
                    <div className="relative">
                        <div
                            onClick={() => toggleDropdown("category")}
                            className="flex items-center justify-between px-4 py-1 rounded-full cursor-pointer"
                            style={{
                                background: "#f7f7f7",
                                boxShadow: "inset 0 2px 1px rgba(0,0,0,0.2), 0 2px 3px rgba(255,255,255,0.6)",
                                border: "1px solid #cfcfcf"
                            }}
                        >
                            <span className="text-gray-700 text-sm font-medium">
                                {category || "Category"}
                            </span>

                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow">
                                <IoCaretDownOutline className={`text-white text-lg transition ${openDropdown === "category" ? "rotate-180" : ""}`} />
                            </div>
                        </div>

                        {openDropdown === "category" && (
                            <div className="absolute w-full mt-2 rounded-xl z-10"
                                style={{
                                    background: "#f7f7f7",
                                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
                                }}
                            >
                                {categories.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setCategory(item);
                                            setOpenDropdown(null);
                                        }}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Area */}
                    <div className="relative">
                        <div
                            onClick={() => toggleDropdown("area")}
                            className="flex items-center justify-between px-4 py-1 rounded-full cursor-pointer"
                            style={{
                                background: "#f7f7f7",
                                boxShadow: "inset 0 2px 1px rgba(0,0,0,0.2), 0 2px 3px rgba(255,255,255,0.6)",
                                border: "1px solid #cfcfcf"
                            }}
                        >
                            <span className="text-gray-700 text-sm font-medium">
                                {area || "Area"}
                            </span>

                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow">
                                <IoCaretDownOutline className={`text-white text-lg transition ${openDropdown === "area" ? "rotate-180" : ""}`} />
                            </div>
                        </div>

                        {openDropdown === "area" && (
                            <div className="absolute w-full mt-2 rounded-xl z-10"
                                style={{
                                    background: "#f5f5f5",
                                    boxShadow: "0 6px 12px rgba(0,0,0,0.15)"
                                }}
                            >
                                {areas.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            setArea(item);
                                            setOpenDropdown(null);
                                        }}
                                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

                {/* Radio button */}
                <div className="flex justify-center mt-5">
                    <div
                        onClick={handleToggle}
                        className="relative w-[180px] h-[58px] rounded-full p-[3px] cursor-pointer flex items-center transition-all duration-300"
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
                                className={`absolute inset-0 transition-opacity duration-500 ${isOn ? "opacity-100" : "opacity-0"
                                    }`}
                                style={{
                                    background: "linear-gradient(to bottom, #28b446, #1e9a3a)",
                                    boxShadow: "inset 0 4px 8px rgba(0,0,0,0.2)"
                                }}
                            />
                        </div>
                        <div
                            className="absolute h-[46px] w-[90px] rounded-full transition-all duration-500 flex items-center px-[5px]"
                            style={{
                                transform: isOn ? "translateX(87px)" : "translateX(2px)",
                                backgroundColor: "#fcfcfc",
                                background: "linear-gradient(to bottom, #ffffff, #e0e0e0)",
                                boxShadow: "0 6px 15px rgba(0,0,0,0.3), inset 0 2px 2px white", // Pop-out effect
                                zIndex: 1
                            }}
                        >
                            <div
                                className="w-[46px] h-[36px] rounded-full transition-all duration-500"
                                style={{
                                    background: "radial-gradient(circle at 30% 30%, #ffffff, #d4d4d4)",
                                    boxShadow: "0 2px 4px rgba(0,0,0,0.2), inset -1px -1px 3px rgba(0,0,0,0.1)",
                                    transform: isOn ? "translateX(39px)" : "translateX(0px)"
                                }}
                            />
                        </div>
                        {/* Text ON / OFF */}
                        <span
                            className={`absolute transition-all duration-500 font-bold text-xl select-none text-white`}
                            style={{
                                zIndex: 5,
                                left: isOn ? "25px" : "115px",
                                opacity: 1,
                                textShadow: "0 1px 2px rgba(0,0,0,0.3)"
                            }}
                        >
                            {isOn ? "ON" : "OFF"}
                        </span>
                    </div>
                </div>

                {/* Sponsored */}
                <div className="mt-25 text-center text-md font-bold">
                    :: Co-Sponsored by ::
                </div>

                {/* Banner  */}
                <div className="mt-4 border-[1.5px] border-[#00aeef] rounded-2xl overflow-hidden bg-[#f3c14b]"
                    style={{
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}
                >
                    <div className="flex items-center h-[150px]">
                       
                        <div className="flex-1 h-full flex items-center justify-center p-2">
                            <img
                                src="/images/anant-logo.png"
                                className="max-w-full max-h-full object-contain"
                                alt="Anant Group"
                            />
                        </div>

                   
                        <div className="h-[70%] w-[1px] bg-gray-600/30"></div>

                    
                        <div className="flex-1 h-full flex items-center justify-center p-2">
                            <img
                                src="/images/niketan-logo.png"
                                className="max-w-full max-h-full object-contain"
                                alt="Niketan Realty"
                            />
                        </div>
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
    )
}

export default Search;