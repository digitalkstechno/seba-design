'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome, AiOutlineSearch } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import Footer from "@/components/Footer"

// Types
type Member = {
  id: string
  name: string
  company: string
  address: string
  img: string
  hasNfcCard?: boolean
  cardId?: string | null
}

// Safe dummy data
const MEMBERS: Member[] = Array.from({ length: 6 }, (_, i) => ({
  id: `member-${i}`,
  name: i < 3 ? "HIRENBHAI K. PATEL - Media Head" : "HIRENBHAI K. PATEL - Media Head (No NFC)",
  company: "M K GROUP",
  address: "B-86 Trikam Nagar Society, Near V-1 .....",
  img: "/images/auth_page_1.png",
  hasNfcCard: i < 3,
  cardId: i < 3 ? "dummy-card-id" : null
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
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-20">

          {MEMBERS.map((item) => {
            const handleCardClick = () => {
              if (item.hasNfcCard && item.cardId) {
                window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${item.cardId}?view=home`
              }
            }

            return (
              <div key={item.id} className="flex items-center relative pr-2">
                {/* Profile */}
                <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden p-[1px] bg-[#eeeeee] shrink-0 z-10 shadow-sm relative">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>

                {/* Card */}
                <div 
                  onClick={handleCardClick}
                  className={`bg-white rounded-r-[20px] rounded-l-[35px] flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 ml-[-35px] pl-[45px] pr-2 overflow-hidden ${
                    item.hasNfcCard ? "cursor-pointer mr-8" : "cursor-default"
                  }`}
                >
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="border-b-[1.5px] border-[#00a9e0] pb-[1px] mb-[1px]">
                      <p className="font-bold text-[12px] truncate uppercase leading-tight text-black pr-8">
                        {item.name}
                      </p>
                    </div>

                    <div className="border-b-[1.5px] border-[#00a9e0] py-[1px]">
                      <p className="text-[11px] font-bold truncate uppercase text-gray-800 leading-tight pr-8">
                        {item.company}
                      </p>
                    </div>

                    <p className="text-[11px] font-semibold truncate text-gray-500 mt-[2px] italic leading-tight pr-8">
                      {item.address}
                    </p>
                  </div>
                </div>

                {/* Arrow Image */}
                {item.hasNfcCard && (
                  <img
                    onClick={handleCardClick}
                    src="/images/arrow-01.png"
                    alt="NFC Card"
                    className="absolute -right-[12px] top-1/2 -translate-y-1/2 z-10 w-[70px] h-[70px] object-contain cursor-pointer active:scale-95 transition-transform"
                  />
                )}
              </div>
            )
          })}

        </div>

        <Footer />

      </div>
    </div>
  )
}

export default MultiSearch
