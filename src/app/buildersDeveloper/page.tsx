'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import { RiWifiFill } from "react-icons/ri"
import Footer from "@/components/Footer"

// Types
type Member = {
  name: string
  company: string
  address: string
  img: string
}

// Dummy Data (safe copy)
const MEMBERS: Member[] = Array.from({ length: 6 }, () => ({
  name: "HIRENBHAI K. PATEL - Media Head",
  company: "M K GROUP",
  address: "B-86 Trikam Nagar Society, Near V-1 .....",
  img: "/images/auth_page_1.png"
}))

// Components
const MemberCard: FC<{ member: Member; onClick: () => void }> = ({ member, onClick }) => (
  <div className="flex items-center">

    {/* Card */}
    <div
      onClick={onClick}
      className="bg-white cursor-pointer rounded-xl flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 overflow-hidden"
    >
      {/* Profile */}
      <div className="pl-2">
        <div className="w-[62px] h-[62px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden">
          <img
            src={member.img}
            alt={member.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 ml-3 pr-2">
        <div className="border-b border-[#00a9e0]">
          <p className="font-bold text-[12px] truncate">
            {member.name}
          </p>
        </div>

        <div className="border-b border-[#00a9e0] py-[1px]">
          <p className="text-[11px] font-semibold">
            {member.company}
          </p>
        </div>

        <p className="text-[11px] font-semibold truncate">
          {member.address}
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
)


// Main Component
const BuildersDeveloper: FC = () => {
  const router = useRouter()

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center">
      <div className="w-[420px] h-full bg-[#eeeeee] px-5 pt-5 shadow-md flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="text-xl cursor-pointer"
          />
          <p className="text-[14px] italic">
            Welcome to <span className="font-semibold">SEBA</span> Members List
          </p>
        </div>

        {/* Info Banner */}
        <div className="px-4 py-2">
          <div className="bg-white rounded-full py-1 border flex justify-center">
            <p className="text-[12px] font-bold italic text-[#3b4db0]">
              Alphabetically <span className="font-bold">NFC card holder name</span> come first
            </p>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-20">

          {MEMBERS.map((member, index) => (
            <MemberCard
              key={index}
              member={member}
              onClick={() => router.push('/memberDetail')}
            />
          ))}

          {/* Banner */}
          <div className="mt-4 pb-4 bg-[#f4c655] border rounded-md p-2">
            <img
              src="/images/anat-busness-logo.png"
              alt="banner"
              className="w-full h-[85px] object-cover rounded-lg"
            />
          </div>

        </div>

        <Footer />

      </div>
    </div>
  )
}

export default BuildersDeveloper
