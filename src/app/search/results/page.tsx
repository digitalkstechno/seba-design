'use client'

import { FC, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import { RiWifiFill } from "react-icons/ri"
import Footer from "@/components/Footer"

// Types
type Member = {
  id: string
  name: string
  company: string
  address: string
  area?: string
  city?: string
  state?: string
  pincode?: string
  image: string
  hasNfcCard: boolean
  cardId: string | null
}

const ResultsContent: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || ''
  const urlArea = searchParams.get('area') || ''

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let query = `/seba/member?`
        if (urlCategory) query += `category=${encodeURIComponent(urlCategory)}&`
        if (urlArea) query += `area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          setMembers(data.data.map((item: any) => ({
            id: item.memberId,
            name: item.name,
            company: item.company,
            address: item.address,
            area: item.area,
            city: item.city,
            state: item.state,
            pincode: item.pincode,
            image: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/member.webp",
            hasNfcCard: item.hasNfcCard,
            cardId: item.cardId
          })).sort((a: any, b: any) => {
            if (a.hasNfcCard === b.hasNfcCard) {
              return a.name.localeCompare(b.name);
            }
            return a.hasNfcCard ? -1 : 1;
          }))
        }
      } catch (err) {
        console.error("Failed to fetch members", err)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [urlCategory, urlArea])

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center">
      <div className="w-[420px] h-full bg-[#eeeeee] px-5 pt-5 shadow-md flex flex-col relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <div 
            onClick={() => router.back()}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer"
          >
            <IoIosArrowBack className="text-xl text-gray-700" />
          </div>
          <p className="text-[16px] font-black text-[#0b4b4b] uppercase tracking-tight ml-2">
            {(urlCategory && urlCategory !== 'All Categories') ? urlCategory.toUpperCase() : "SEBA MEMBERS"}
          </p>
        </div>


        {/* List */}
        <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3 no-scrollbar pb-32">
          {loading ? (
             <div className="flex justify-center py-10"><p className="text-gray-400 italic">Searching members...</p></div>
          ) : members.length === 0 ? (
             <div className="flex justify-center py-10"><p className="text-gray-400 italic">No members found in this area.</p></div>
          ) : members.map((member) => (
            <div key={member.id} className="flex items-center">
              {/* Card */}
              <div className="bg-white rounded-[35px] flex items-center shadow-sm border border-gray-100 h-[75px] flex-1 overflow-hidden relative">
                {/* Profile */}
                <div className="pl-2 shrink-0">
                  <div className="w-[62px] h-[62px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden p-[1px]">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 ml-3 pr-8 min-w-0 flex flex-col justify-center">
                  <div className="border-b-[1.5px] border-[#00a9e0] pb-[1px] mb-[1px]">
                    <p className="font-bold text-[12px] truncate uppercase leading-tight text-black">
                      {member.name}
                    </p>
                  </div>
                  <div className="border-b-[1.5px] border-[#00a9e0] py-[1px]">
                    <p className="text-[11px] font-bold truncate uppercase text-gray-800 leading-tight">
                      {member.company}
                    </p>
                  </div>
                  <p className="text-[10px] font-semibold truncate text-gray-500 mt-[2px] italic leading-tight">
                    {[member.address, member.area, member.city, member.state, member.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>

                {/* Detail Arrow - Only for NFC Card holders */}
                {member.hasNfcCard && (
                  <div 
                    onClick={() => {
                      if (member.cardId) {
                        window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}`;
                      } else {
                        router.push(`/memberDetail?id=${member.id}`);
                      }
                    }}
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center cursor-pointer active:scale-95 transition-transform"
                  >
                    <div
                      className="relative w-[40px] h-[52px] flex items-center justify-center drop-shadow-lg"
                      style={{
                        clipPath: 'polygon(0% 0%, 100% 50%, 0% 100%)',
                        background: 'linear-gradient(to right, #e31e24, #881519)'
                      }}
                    >
                      <div className="absolute left-[4px] top-1/2 -translate-y-1/2 w-[6px] h-[6px] bg-white rounded-full shadow-sm" />
                      <RiWifiFill
                        className="text-white text-[22px] ml-[6px]"
                        style={{ transform: "rotate(90deg)" }}
                      />
                    </div>
                  </div>
                )}

              </div>
            </div>
          ))}

        </div>

        <Footer />

      </div>
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

const ResultsPage: FC = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <ResultsContent />
  </Suspense>
)

export default ResultsPage
