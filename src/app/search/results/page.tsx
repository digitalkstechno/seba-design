'use client'

import { FC, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import Footer from "@/components/Footer"

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
  status: string
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
            cardId: item.cardId,
            status: item.status
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
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-[100vw] h-[100vh] bg-[#eeeeee] px-[5vw] pt-[5vw] shadow-2xl flex flex-col relative overflow-hidden pb-[18vw] border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-[2vw] mb-[4vw]">
          <IoIosArrowBack
            onClick={() => router.back()}
            className="text-[6vw] cursor-pointer text-gray-800 hover:text-black transition-colors"
          />
          <p className="text-[4vw] font-black text-gray-800 uppercase tracking-tight ml-[1vw] truncate">
            {urlCategory && urlCategory !== 'All Categories' ? (
              urlSubCategory ? `${urlCategory.toUpperCase()} - ${urlSubCategory.toUpperCase()}` : urlCategory.toUpperCase()
            ) : "SEBA MEMBERS"}
          </p>
        </div>

        {/* Info Banner */}
        <div className="px-[1vw] mb-[3vw] flex justify-center">
          <img 
            src="/images/text-01.png"
            alt="Alphabetically NFC card holder name come first"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-[1vw] py-[2vw] space-y-[3vw] no-scrollbar pb-[4vw]">
          {loading ? (
             <div className="flex justify-center py-[10vw]"><p className="text-gray-400 italic text-[3.5vw]">Searching members...</p></div>
          ) : members.length === 0 ? (
             <div className="flex justify-center py-[10vw]"><p className="text-gray-400 italic text-[3.5vw]">No members found in this area.</p></div>
          ) : members.map((member) => {
             const isNfcActive = member.hasNfcCard && member.cardId && member.status === 'active';

             return (
               <div key={member.id} className="flex items-center relative pr-[2vw]">
                 {/* Profile */}
                 <div className="w-[16vw] h-[16vw] rounded-full border-[0.4vw] border-[#00a9e0] overflow-hidden p-[0.3vw] bg-[#eeeeee] shrink-0 z-10 shadow-sm relative">
                   <img
                     src={member.image}
                     alt={member.name}
                     className="w-full h-full rounded-full object-cover"
                   />
                 </div>

                 {/* Card */}
                 <div 
                   onClick={() => {
                     if (isNfcActive) {
                       try {
                         localStorage.setItem('seba:navigatedToCard', 'true');
                       } catch (e) {}
                       window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`;
                     }
                   }}
                   className={`bg-white rounded-r-[2.5vw] rounded-l-[1vw] flex items-center shadow-sm border border-gray-100 h-[16vw] flex-1 ml-[-8vw] pl-[10vw] pr-[2vw] overflow-hidden ${isNfcActive ? "cursor-pointer mr-[3vw]" : "cursor-default"}`}
                 >
                   {/* Content */}
                   <div className="flex-1 min-w-0 flex flex-col justify-center">
                     <div className="border-b-[0.3vw] border-[#00a9e0] pb-[0.3vw] mb-[0.3vw]">
                       <p className="font-bold text-[3vw] truncate uppercase leading-tight text-black pr-[8vw]">
                         {member.name}
                       </p>
                     </div>
                     <div className="border-b-[0.3vw] border-[#00a9e0] py-[0.3vw]">
                       <p className="text-[2.8vw] font-bold truncate uppercase text-gray-800 leading-tight pr-[8vw]">
                         {member.company}
                       </p>
                     </div>
                     <p className="text-[2.8vw] font-semibold truncate text-gray-500 mt-[0.5vw] italic leading-tight pr-[8vw]">
                       {[member.address, member.area, member.city, member.state, member.pincode].filter(Boolean).join(', ')}
                     </p>
                   </div>
                 </div>

                 {/* Detail Arrow - Only for active NFC Card holders */}
                 {isNfcActive && (
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
                     className="absolute -right-[3vw] top-1/2 -translate-y-1/2 z-10 w-[11vw] h-[11vw] object-contain cursor-pointer active:scale-95 transition-transform"
                   />
                 )}
               </div>
             );
          })}
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
