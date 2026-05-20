'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import Footer from "@/components/Footer"

// Types
type Member = {
  name: string
  company: string
  address: string
  img: string
  hasNfcCard?: boolean
  cardId?: string | null
}

// Dummy Data (safe copy)
const MEMBERS: Member[] = Array.from({ length: 6 }, (_, i) => ({
  name: i < 3 ? "HIRENBHAI K. PATEL - Media Head" : "HIRENBHAI K. PATEL - Media Head (No NFC)",
  company: "M K GROUP",
  address: "B-86 Trikam Nagar Society, Near V-1 .....",
  img: "/images/auth_page_1.png",
  hasNfcCard: i < 3,
  cardId: i < 3 ? "dummy-card-id" : null
}))

const MemberCard: FC<{ member: Member }> = ({ member }) => {
  const handleCardClick = () => {
    if (member.hasNfcCard && member.cardId) {
      window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`
    }
  }

  return (
    <div className="flex items-center relative pr-2">
      {/* Profile */}
      <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden p-[1px] bg-[#eeeeee] shrink-0 z-10 shadow-sm relative">
        <img
          src={member.img}
          alt={member.name}
          className="w-full h-full rounded-full object-cover"
        />
      </div>

      {/* Card */}
      <div
        onClick={handleCardClick}
        className={`bg-white rounded-r-[20px] rounded-l-[35px] flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 ml-[-35px] pl-[45px] pr-2 overflow-hidden ${
          member.hasNfcCard ? "cursor-pointer mr-8" : "cursor-default"
        }`}
      >
        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="border-b-[1.5px] border-[#00a9e0] pb-[1px] mb-[1px]">
            <p className="font-bold text-[12px] truncate uppercase leading-tight text-black pr-8">
              {member.name}
            </p>
          </div>

          <div className="border-b-[1.5px] border-[#00a9e0] py-[1px]">
            <p className="text-[11px] font-bold truncate uppercase text-gray-800 leading-tight pr-8">
              {member.company}
            </p>
          </div>

          <p className="text-[11px] font-semibold truncate text-gray-500 mt-[2px] italic leading-tight pr-8">
            {member.address}
          </p>
        </div>
      </div>

      {/* Arrow Image */}
      {member.hasNfcCard && (
        <img
          onClick={handleCardClick}
          src="/images/arrow-01.png"
          alt="NFC Card"
          className="absolute -right-[12px] top-1/2 -translate-y-1/2 z-10 w-[70px] h-[70px] object-contain cursor-pointer active:scale-95 transition-transform"
        />
      )}
    </div>
  )
}


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
        <div className="px-4 py-2 flex justify-center">
          <img 
            src="/images/text-01.png"
            alt="Alphabetically NFC card holder name come first"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-20">

          {MEMBERS.map((member, index) => (
            <MemberCard
              key={index}
              member={member}
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
