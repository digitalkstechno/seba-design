import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { FaArrowLeft, FaEye } from "react-icons/fa"
import { LuLayoutDashboard } from "react-icons/lu"

const accociated = () => {
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

                {/* Grid Section */}

                <div className="grid grid-cols-3 gap-4 mt-13">

                    {[
                        { name: "ARCHITECT ASSOCIATION", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "HARDWARE ASSOCIATION", img: "/images/member.webp" },
                        { name: "INTERIOR DESIGNER ", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
                        { name: "INTERIOR DESIGNER ASSOCIATION", img: "/images/member.webp" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">

                            {/* Image */}
                            <div className="h-[110px] overflow-hidden">
                                <img
                                    src={item.img}
                                    className="w-full h-full object-cover object-top"
                                    alt={item.name}
                                />
                            </div>

                            {/* Label */}
                            <div className="bg-[#d1d5db] text-center text-[11px] py-2 font-medium leading-tight px-1">
                                {item.name}
                            </div>

                        </div>
                    ))}

                </div>


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
    )
}
export default accociated