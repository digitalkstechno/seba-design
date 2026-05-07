'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import { RiWifiFill } from "react-icons/ri"

// Types
type Member = {
  id: string
  name: string
  company: string
  address: string
  img: string
}

// Safe dummy data
const MEMBERS: Member[] = Array.from({ length: 6 }, (_, i) => ({
  id: `member-${i}`,
  name: "HIRENBHAI K. PATEL - Media Head",
  company: "M K GROUP",
  address: "B-86 Trikam Nagar Society, Near V-1 .....",
  img: "/images/user-profile.jpg"
}))

const MultiSearch: FC = () => {
  const router = useRouter()

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">

      <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

        {/* Back */}
        <IoIosArrowBack
          onClick={() => router.back()}
          className="text-xl cursor-pointer"
        />

        {/* Search */}
        <div className="px-4 mt-3">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-200">
            <input
              type="text"
              placeholder="Name / Company / Catagory / Building / Mobile No."
              className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent"
            />
            <AiOutlineSearch className="text-[#3b4db0] text-lg" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3">

          {MEMBERS.map((item) => (
            <div key={item.id} className="flex items-center">

              {/* Card */}
              <div className="bg-white rounded-xl flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 overflow-hidden">

                {/* Profile */}
                <div className="pl-2">
                  <div className="w-[62px] h-[62px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 ml-3 flex flex-col justify-center pr-2">
                  <div className="border-b border-[#00a9e0]">
                    <p className="font-bold text-[12px] truncate">
                      {item.name}
                    </p>
                  </div>

                  <div className="border-b border-[#00a9e0] py-[1px]">
                    <p className="text-[11px] font-semibold">
                      {item.company}
                    </p>
                  </div>

                  <p className="text-[11px] font-semibold truncate">
                    {item.address}
                  </p>
                </div>

              </div>

              {/* Triangle */}
              <div className="ml-[2px] flex items-center">
                <div
                  className="relative w-[25px] h-[30px] flex items-center justify-center"
                  style={{
                    clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                    background: 'linear-gradient(to bottom, #e31e24 50%, #a11c1f 50%)'
                  }}
                >
                  <div className="absolute left-[2px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] bg-white border border-[#a11c1f] rounded-full" />

                  <RiWifiFill
                    className="text-white text-[12px] ml-[4px]"
                    style={{ transform: "rotate(90deg)" }}
                  />
                </div>
              </div>

            </div>
          ))}

        </div>

        {/* Bottom Nav */}
        <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <AiOutlineHome className="text-xl" />
            <span className="text-[10px] mt-1">home</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <img
              src="/images/seba-link1.png"
              alt="app"
              className="w-8 h-8 object-contain"
            />
            <span className="text-[10px] -mt-1">App Link</span>
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
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'SEBA - Search Zone',
                  url: window.location.href
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }
            }}
            className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100"
          >
            <BsShare className="text-lg" />
            <span className="text-[10px] mt-1 font-bold">share</span>
          </button>

        </div>

      </div>
    </div>
  )
}

export default MultiSearch