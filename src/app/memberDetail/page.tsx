'use client'

import { useEffect, useState, Suspense } from "react";
import { AiOutlineUser, AiOutlinePhone, AiOutlineHome } from "react-icons/ai";
import { IoLocationOutline } from "react-icons/io5";
import { BsClock, BsGlobe, BsSend, BsShare } from "react-icons/bs";
import { useRouter, useSearchParams } from "next/navigation";
import { LuLayoutDashboard } from "react-icons/lu";
import { IoIosArrowBack } from "react-icons/io";
import api from "@/lib/axios";
import Footer from "@/components/Footer";

const MemberDetailContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [member, setMember] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isOn, setIsOn] = useState(true);

    useEffect(() => {
        if (!id) return;
        const fetchMember = async () => {
            try {
                const { data } = await api.get(`/seba/member/${id}`);
                if (data.status === 'Success') {
                    setMember(data.data);
                }
            } catch (err) {
                console.error("Failed to fetch member details", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMember();
    }, [id]);

    if (loading) return <div className="h-screen bg-[#eeeeee] flex items-center justify-center italic text-gray-500">Loading profile...</div>;
    if (!member) return <div className="h-screen bg-[#eeeeee] flex items-center justify-center text-red-500">Member not found.</div>;

    const profileImg = member.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${member.image}` : "/images/member.webp";

    return (
        <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">
            <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col overflow-y-auto no-scrollbar">

                {/* BACK */}
                <div 
                  onClick={() => router.back()}
                  className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer mb-2"
                >
                  <IoIosArrowBack className="text-xl text-gray-700" />
                </div>

                {/* PROFILE */}
                <div className="flex justify-center mt-2">
                    <div className="w-[140px] h-[140px] rounded-full border-[8px] border-white shadow-xl overflow-hidden bg-white">
                        <img src={profileImg} alt={member.name} className="w-full h-full object-contain" />
                    </div>
                </div>

                {/* INFO BOXES */}
                <div className="mt-6 space-y-4 px-2">

                    {/* NAME */}
                    <div className="flex items-stretch h-[40px]">
                        <div className="w-[45px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-300 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.05)] rounded-l-[20px]">
                            <AiOutlineUser className="text-[24px] text-gray-600" />
                        </div>
                        <div className="w-[1px] bg-gray-300"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-300 rounded-r-full shadow-sm ml-[1px]">
                            <span className="text-[13px] font-black text-gray-800 uppercase tracking-wide truncate">
                                {member.name}
                            </span>
                        </div>
                    </div>

                    {/* PHONE */}
                    <div className="flex items-stretch h-[40px]">
                        <div className="w-[45px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-300 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.05)] rounded-l-[20px]">
                            <AiOutlinePhone className="text-[22px] text-gray-600" />
                        </div>
                        <div className="w-[1px] bg-gray-300"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-300 rounded-r-full shadow-sm ml-[1px]">
                            <span className="text-[14px] font-bold text-gray-700 tracking-wider">{member.mobile}</span>
                        </div>
                    </div>

                    {/* ADDRESS */}
                    <div className="flex items-stretch min-h-[45px]">
                        <div className="w-[45px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-300 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.05)] rounded-l-[20px]">
                            <IoLocationOutline className="text-[22px] text-gray-600" />
                        </div>
                        <div className="w-[1px] bg-gray-300"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 py-2 border-y border-r border-gray-300 rounded-r-full shadow-sm ml-[1px]">
                            <span className="text-[11px] font-bold text-gray-700 leading-tight">
                                {[member.address, member.area, member.city, member.state, member.pincode].filter(Boolean).join(', ') || "No address provided"}
                            </span>
                        </div>
                    </div>

                    {/* TIME (Dynamic from position or default) */}
                    <div className="flex items-stretch h-[40px]">
                        <div className="w-[45px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-300 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.05)] rounded-l-[20px]">
                            <BsClock className="text-[20px] text-gray-600" />
                        </div>
                        <div className="w-[1px] bg-gray-300"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-300 rounded-r-full shadow-sm ml-[1px]">
                            <span className="text-[12px] font-bold text-gray-700">
                                10 am to 2 pm  &  5 pm to 7 pm
                            </span>
                        </div>
                    </div>

                    {/* WEBSITE */}
                    <div className="flex items-stretch h-[40px]">
                        <div className="w-[45px] bg-[#e8eff1] flex items-center justify-center border-y border-l border-gray-300 shadow-[inset_-2px_2px_4px_rgba(0,0,0,0.05)] rounded-l-[20px]">
                            <BsSend className="text-[20px] text-gray-600 -rotate-45" />
                        </div>
                        <div className="w-[1px] bg-gray-300"></div>
                        <div className="flex-1 bg-[#e8eff1] flex items-center px-4 border-y border-r border-gray-300 rounded-r-full shadow-sm ml-[1px]">
                            <span className="text-[12px] font-bold text-gray-700 truncate">
                                {member.emailWebsite || "www.seba.org"}
                            </span>
                        </div>
                    </div>

                </div>

                {/* COMPANY BOX */}
                <div className="mt-8 flex justify-center">
                    <div className="bg-[#e5e5e5] p-1.5 rounded-2xl shadow-md border border-white">
                        <div className="border-[3px] border-[#0b2f2f] rounded-xl p-[2px]">
                            <div className="bg-[#003c3c] rounded-lg px-12 py-6 flex flex-col items-center justify-center min-w-[280px]">
                                <span className="text-[#facc15] font-black text-2xl tracking-[0.1em] italic leading-none">MK</span>
                                <h4 className="text-white font-black text-2xl tracking-[0.2em] mt-1 uppercase">{member.company || "SEBA GROUP"}</h4>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Radio button / Actions */}
                <div className="flex items-center justify-between mt-8 mb-24 px-4">
                    <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
                        <div className="w-[50px] h-[50px] bg-[#e5e5e5] rounded-xl flex items-center justify-center shadow-md border border-white">
                            <BsShare className="text-[20px] text-gray-700" />
                        </div>
                        <span className="text-[11px] mt-1 font-bold text-gray-600 uppercase">Share</span>
                    </div>

                    <div className="flex items-center justify-center flex-1 mx-4">
                        <div
                            onClick={() => setIsOn(!isOn)}
                            className="relative w-[140px] h-[45px] rounded-full p-[3px] cursor-pointer flex items-center transition-all duration-300"
                        >
                            <div className="absolute inset-[3px] rounded-full overflow-hidden bg-[#bebebe] shadow-inner border-t-2 border-gray-400">
                                <div
                                    className={`absolute inset-0 transition-opacity duration-500 ${isOn ? "opacity-100" : "opacity-0"}`}
                                    style={{ background: "linear-gradient(to bottom, #28b446, #1e9a3a)" }}
                                />
                            </div>
                            <div
                                className={`absolute h-[36px] w-[65px] rounded-full bg-white shadow-lg transition-all duration-500 flex items-center justify-center ${isOn ? "translate-x-1" : "translate-x-[68px]"}`}
                            >
                                <div className="w-[40px] h-[30px] rounded-full bg-gray-100 shadow-inner" />
                            </div>
                            <span className={`absolute font-black text-sm text-white ${isOn ? "right-4" : "left-4"}`}>
                                {isOn ? "ON" : "OFF"}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform">
                        <div className="w-[50px] h-[50px] bg-[#e5e5e5] rounded-xl flex items-center justify-center shadow-md border border-white text-gray-700">
                            <LuLayoutDashboard size={20} />
                        </div>
                        <span className="text-[11px] mt-1 font-bold text-gray-600 uppercase">Edit</span>
                    </div>
                </div>

                <Footer />
            </div>
            
            <style jsx>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
            `}</style>
        </div>
    );
}

const MemberDetail = () => (
    <Suspense fallback={<div>Loading details...</div>}>
        <MemberDetailContent />
    </Suspense>
);

export default MemberDetail;
