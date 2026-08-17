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
  isSponsorNfc?: boolean
  nfcCardStatus?: string
  isCompany?: boolean
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
      } catch (e) { }
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
        let query = `/seba/member?status=active&`
        if (urlCategory) query += `category=${encodeURIComponent(urlCategory)}&`
        if (urlSubCategory) query += `subCategory=${encodeURIComponent(urlSubCategory)}&`
        if (urlArea && urlArea !== "All Area") query += `area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          const filtered = data.data
          setMembers(filtered.map((item: any) => ({
            id: item.memberId || item._id,
            name: item.name,
            company: item.company,
            isCompany: Boolean(item.isCompany),
            category: item.category,
            subCategory: item.subCategory,
            natureOfBusiness: item.natureOfBusiness,
            address: item.address,
            area: item.area,
            city: item.city,
            state: item.state,
            pincode: item.pincode,
            image: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/member.webp",
            hasNfcCard: Boolean(item.hasNfcCard),
            nfcCardStatus: item.nfcCardStatus || 'active',
            isSponsorNfc: Boolean(item.isSponsorNfc),
            cardId: item.cardId,
          })).sort((a: any, b: any) => {
            const getSortRank = (m: any) => {
              const isComp = Boolean(m.isCompany);
              const hasNfc = Boolean((m.hasNfcCard || m.isSponsorNfc) && m.nfcCardStatus !== 'inactive');
              if (isComp && hasNfc) return 1;    // 1: Company WITH NFC (Yellow Arrow)
              if (!isComp && hasNfc) return 2;   // 2: Member WITH NFC (Red Arrow)
              if (isComp && !hasNfc) return 3;   // 3: Company WITHOUT NFC
              return 4;                          // 4: Member WITHOUT NFC (including no SEBA number)
            };

            const rankA = getSortRank(a);
            const rankB = getSortRank(b);
            if (rankA !== rankB) {
              return rankA - rankB;
            }
            return (a.name || "").trim().localeCompare((b.name || "").trim(), undefined, { sensitivity: 'base' });
          }))
        }
      } catch (err) {
        console.error("Failed to fetch members", err)
      } finally {
        setLoading(false);
      }
    }
    fetchMembers()
  }, [urlCategory, urlSubCategory, urlArea, refreshTrigger])

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-[100vh] bg-[#eeeeee] relative px-4 pt-4 shadow-2xl flex flex-col overflow-hidden pb-[75px] border border-gray-200">

        {/* Header */}
        <div className="flex items-center gap-2 mb-3 cursor-pointer" onClick={() => router.push('/search')}>
          <IoIosArrowBack className="text-gray-700 text-lg" />
          <h1 className="text-base font-bold text-gray-900 tracking-wide uppercase">
            SEBA MEMBERS
          </h1>
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-1 py-2 space-y-3 no-scrollbar pb-4">
          {loading ? (
            <div className="flex justify-center py-10"><p className="text-gray-400 italic text-sm">Searching members...</p></div>
          ) : members.length === 0 ? (
            <div className="flex justify-center py-10"><p className="text-gray-400 italic text-sm">No members found in this area.</p></div>
          ) : members.map((member) => {
            const isNfcActive = (member.hasNfcCard || member.isSponsorNfc) && member.nfcCardStatus !== 'inactive';
            const isCompanyNfc = member.isCompany && isNfcActive;

            return (
              <div key={member.id} className="flex items-center relative pr-2">
                {/* Profile */}
                <div className="w-[60px] h-[60px] rounded-full border-[2px] border-[#00a9e0] overflow-hidden p-[1px] bg-[#eeeeee] shrink-0 z-10 shadow-sm relative">
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
                      } catch (e) { }
                      window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`;
                    }
                  }}
                  className={`bg-white rounded-r-xl rounded-l-md flex items-center shadow-sm border border-gray-100 min-h-[64px] flex-1 ml-[-30px] pl-[38px] pr-2 overflow-hidden ${isNfcActive ? "cursor-pointer mr-3" : "cursor-default"}`}
                >
                  {/* Content */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center py-1">
                    <div className="border-b-[1.5px] border-[#00a9e0] pb-0.5 mb-0.5">
                      <p className="font-bold text-[12px] truncate uppercase leading-tight text-black pr-6">
                        {member.name}
                      </p>
                    </div>
                    <div className="border-b-[1.5px] border-[#00a9e0] py-0.5">
                      <p className="text-[11px] font-bold truncate uppercase text-gray-800 leading-tight pr-6">
                        {member.company}
                      </p>
                    </div>
                    <p
                      className="text-[10px] font-semibold text-gray-500 mt-0.5 italic leading-tight pr-6 line-clamp-2 overflow-hidden text-ellipsis"
                      style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                    >
                      {[member.address, member.area, member.city, member.state, member.pincode].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Detail Arrow - Yellow Arrow for Company NFC, Red Arrow for Member NFC */}
                {isNfcActive && (
                  <img
                    onClick={() => {
                      if (member.cardId) {
                        try {
                          localStorage.setItem('seba:navigatedToCard', 'true');
                        } catch (e) { }
                        window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${member.cardId}?view=home`;
                      }
                    }}
                    src={isCompanyNfc ? "/images/yellow-arrow.png" : "/images/arrow-01.png"}
                    alt="NFC Card"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 object-contain cursor-pointer active:scale-95 transition-transform"
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
