'use client';

import { FaEye, FaFacebookF, FaInstagram } from "react-icons/fa";
import { BsShare, BsGlobe } from "react-icons/bs";
import { AiOutlineHome } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu"; // Dropbox icon mate substitute
import { useRouter } from "next/navigation";

const Home = () => {
    const router = useRouter();
    const menu = [
        { label: 'Associated', img: 'https://cdn-icons-png.flaticon.com/512/1055/1055644.png', path: '/accociated' },
        { label: 'Members', img: 'https://cdn-icons-png.flaticon.com/512/33/33308.png', path: '/member' },
        { label: 'New Member', img: 'https://cdn-icons-png.flaticon.com/512/1250/1250592.png', path: '/newMember' },
        { label: 'Search', icon: <FiSearch className="text-red-600 text-lg" />, path: '/search' }
    ];
    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start ">

            <div className="w-[420px] h-screen bg-[#f8f9fa] relative px-5 pt-6 shadow-2xl overflow-hidden border border-gray-200 flex flex-col">

                {/* Top Section */}
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[15px] italic text-gray-700">
                            Welcome to <span className="font-bold text-black">SEBA</span> digital directory
                        </p>
                        {/* View Counter */}
                        <div className="flex items-center gap-2 mt-2">
                            <FaEye className="text-[#3b5998] text-[20px]" />
                            <span className="tracking-[0.2em] text-[22px] font-mono font-bold text-gray-700">
                                002345
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
                    {/* Facebook */}
                    <div className="relative z-30 flex items-center bg-[#3bb2e6] text-white pl-2 pr-6 py-1.5 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
                        <div className="bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center">
                            <FaFacebookF className="text-[#3bb2e6] text-[13px]" />
                        </div>
                        <span className="text-[13px] font-semibold italic ml-2">facebook</span>
                    </div>
                    {/* Instagram */}
                    <div className="relative z-20 -mt-5 flex items-center bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500 text-white pl-2 pr-6 py-1.5 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
                        <div className="bg-white rounded-full w-[26px] h-[26px] flex items-center justify-center">
                            <FaInstagram className="text-pink-500 text-[13px]" />
                        </div>
                        <span className="text-[13px] font-semibold italic ml-2">instagram</span>
                    </div>
                    {/* Events */}
                    <div className="relative z-10 -mt-5 flex items-center bg-green-600 text-white pl-2 pr-6 py-1.5 rounded-l-full shadow-lg transform -rotate-[14deg] origin-right">
                        <div className="bg-black rounded-full w-[26px] h-[26px] flex items-center justify-center">
                            <div className="w-[14px] h-[14px] bg-yellow-400 rounded-full"></div>
                        </div>
                        <span className="text-[13px] font-semibold italic ml-2 text-cyan-300">events</span>
                    </div>
                </div>




                <div className="grid grid-cols-4 gap-4 mt-8 justify-items-center">
                    {menu.map((item, idx) => (
                        <div
                            key={idx}
                            onClick={() => router.push(item.path)}
                            className="flex flex-col items-center cursor-pointer"
                        >

                            <div className="bg-gray-200/70 rounded-lg w-[50px] h-[50px] flex justify-center items-center shadow-sm border border-gray-100 hover:bg-gray-300 transition">
                                {item.img ? (
                                    <img src={item.img} alt={item.label} className="h-6 w-6 object-contain" />
                                ) : (
                                    item.icon
                                )}
                            </div>

                            <p className="text-[11px] mt-2 italic text-gray-600">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tagline */}
                <p className="text-center italic mt-8 text-[16px] font-medium text-gray-700">
                    Your Digital Partner to Grow
                </p>

                {/* Sponsor Section */}
                <div className="text-center mt-6 px-4">
                    <p className="text-[14px] text-gray-600 font-medium">:: Sponsor ::</p>
                    <div className="bg-[#003d3d] rounded-2xl py-6 mt-2 shadow-inner flex justify-center">
                        <img
                            src="/images/ananta-height.png"
                            alt="ANANTA"
                            className="h-[90px] object-contain"
                        />
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
};

export default Home;