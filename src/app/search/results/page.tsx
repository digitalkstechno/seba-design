'use client'

import { FC, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import Footer from "@/components/Footer"
import FooterSponsors from "@/components/FooterSponsors"

// Types
type Member = {
  id: string
  name: string
  company: string
  category?: string
  subCategory?: string
  natureOfBusiness?: string
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
  const urlSubCategory = searchParams.get('subCategory') || ''
  const urlArea = searchParams.get('area') || ''

  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  // Handle bfcache restore and back navigation data fetch seamlessly
  useEffect(() => {
    const checkAndFetch = () => {
      try {
        if (typeof window !== 'undefined' && localStorage.getItem('seba:navigatedToCard') === 'true') {
          localStorage.removeItem('seba:navigatedToCard');
          setRefreshTrigger(prev => prev + 1);
        }
      } catch (e) {}
    };

    checkAndFetch();

    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setRefreshTrigger(prev => prev + 1);
      } else {
        checkAndFetch();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkAndFetch();
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let query = `/seba/member?`
        if (urlCategory) query += `category=${encodeURIComponent(urlCategory)}&`
        if (urlSubCategory) query += `subCategory=${encodeURIComponent(urlSubCategory)}&`
        if (urlArea && urlArea !== "All Area") query += `area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          setMembers(data.data.map((item: any) => ({
            id: item.memberId,
            name: item.name,
            company: item.company,
            category: item.category,
            subCategory: item.subCategory,
            natureOfBusiness: item.natureOfBusiness,
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
  }, [urlCategory, urlArea, refreshTrigger])

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center">
      <div className="w-[420px] h-full bg-[#eeeeee] px-5 pt-5 shadow-md flex flex-col relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="text-2xl cursor-pointer text-gray-800 hover:text-black transition-colors"
          />
          <p className="text-[16px] font-black text-gray-800 uppercase tracking-tight ml-1 truncate">
            {urlCategory && urlCategory !== 'All Categories' ? (
              urlSubCategory ? `${urlCategory.toUpperCase()} - ${urlSubCategory.toUpperCase()}` : urlCategory.toUpperCase()
            ) : "SEBA MEMBERS"}
          </p>
        </div>

        {/* Info Banner */}
        <div className="px-1 mb-3 flex justify-center">
          <img 
            src="/images/text-01.png"
            alt="Alphabetically NFC card holder name come first"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-1 py-2 space-y-3 no-scrollbar pb-32">
          {loading ? (
             <div className="flex justify-center py-10"><p className="text-gray-400 italic">Searching members...</p></div>
          ) : members.length === 0 ? (
             <div className="flex justify-center py-10"><p className="text-gray-400 italic">No members found in this area.</p></div>
          ) : members.map((member) => (
            <div key={member.id} className="flex items-center relative pr-2">
              {/* Profile */}
              <div className="w-[70px] h-[70px] rounded-full border-[1.5px] border-[#00a9e0] overflow-hidden p-[1px] bg-[#eeeeee] shrink-0 z-10 shadow-sm relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                />
              </div>

              {/* Card */}
              <div 
                onClick={() => {
                  if (member.hasNfcCard && member.cardId) {
                    try {
                      localStorage.setItem('seba:navigatedToCard', 'true');
                    } catch (e) {}
                    window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`;
                  }
                }}
                className={`bg-white rounded-r-[10px] rounded-l-[5px] flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 ml-[-35px] pl-[45px] pr-2 overflow-hidden ${member.hasNfcCard ? "cursor-pointer mr-3" : "cursor-default"}`}
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
                    {[member.address, member.area, member.city, member.state, member.pincode].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {/* Detail Arrow - Only for NFC Card holders */}
              {member.hasNfcCard && (
                <img 
                  onClick={() => {
                    if (member.cardId) {
                      try {
                        localStorage.setItem('seba:navigatedToCard', 'true');
                      } catch (e) {}
                      window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`;
                    }
                  }}
                  src="/images/arrow-01.png"
                  alt="NFC Card"
                  className="absolute -right-[22px] top-1/2 -translate-y-1/2 z-10 w-[70px] h-[70px] object-contain cursor-pointer active:scale-95 transition-transform"
                />
              )}
            </div>
          ))}

        </div>

        <FooterSponsors type="co-sponsor" />
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
