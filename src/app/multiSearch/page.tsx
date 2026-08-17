'use client'

import { FC, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineSearch } from "react-icons/ai"
import { IoIosArrowBack } from "react-icons/io"
import Footer from "@/components/Footer"
import api from "@/lib/axios"

// Types
type Member = {
  id: string
  name: string
  company?: string
  isCompany?: boolean
  address: string
  img: string
  hasNfcCard: boolean
  cardId?: string | null
}

const MultiSearch: FC = () => {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      try {
        let query = `/seba/member?status=active`
        if (searchTerm.trim()) {
          query += `&search=${encodeURIComponent(searchTerm.trim())}`
        }

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          const filtered = data.data
          const mapped: Member[] = filtered.map((item: any) => {
            const hasNfc = Boolean((item.hasNfcCard || item.isSponsorNfc) && item.nfcCardStatus !== 'inactive')
            const fullAddr = [item.address, item.area, item.city, item.state, item.pincode].filter(Boolean).join(', ')

            return {
              id: item.memberId || item._id,
              name: item.name,
              company: item.company,
              isCompany: Boolean(item.isCompany),
              address: fullAddr,
              img: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/member.webp",
              hasNfcCard: hasNfc,
              cardId: item.cardId
            }
          })

          mapped.sort((a, b) => {
            if (searchTerm.trim()) {
              const sLower = searchTerm.trim().toLowerCase()
              const getSearchMatchScore = (m: Member) => {
                const name = (m.name || "").toLowerCase()
                const company = (m.company || "").toLowerCase()

                if (name === sLower) return 1
                if (name.startsWith(sLower)) return 2
                if (name.includes(sLower)) return 3
                if (company.includes(sLower)) return 4
                return 5
              }

              const scoreA = getSearchMatchScore(a)
              const scoreB = getSearchMatchScore(b)

              if (scoreA !== scoreB) {
                return scoreA - scoreB
              }
            }

            const getSortRank = (m: Member) => {
              const isComp = Boolean(m.isCompany);
              const hasNfc = Boolean(m.hasNfcCard);
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
          })

          setMembers(mapped)
        }
      } catch (err) {
        console.error("Failed to fetch members", err)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(() => {
      fetchMembers()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">

      <div className="w-full max-w-[420px] h-[100vh] bg-[#eeeeee] relative px-5 pt-5 shadow-2xl flex flex-col overflow-hidden pb-[75px] border border-gray-200">

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Name / Company / Catagory / Building / Mobile No."
              className="flex-1 outline-none text-sm text-gray-600 placeholder-gray-400 bg-transparent"
            />
            <AiOutlineSearch className="text-[#3b4db0] text-lg" />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-3 pb-4">

          {loading ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-400 italic text-sm">Searching members...</p>
            </div>
          ) : members.length === 0 ? (
            <div className="flex justify-center py-10">
              <p className="text-gray-400 italic text-sm">No active SEBA members found.</p>
            </div>
          ) : (
            members.map((item) => {
              const handleCardClick = () => {
                if (item.hasNfcCard && item.cardId) {
                  try {
                    localStorage.setItem('seba:navigatedToCard', 'true')
                  } catch (e) { }
                  window.location.href = `${process.env.NEXT_PUBLIC_CARD_URL}/${item.cardId}?view=home`
                }
              }

              const isCompanyNfc = Boolean(item.isCompany && item.hasNfcCard)

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
                    className={`bg-white rounded-r-[20px] rounded-l-[35px] flex items-center shadow-sm border border-gray-100 h-[70px] flex-1 ml-[-35px] pl-[45px] pr-2 overflow-hidden ${item.hasNfcCard ? "cursor-pointer mr-8" : "cursor-default"
                      }`}
                  >
                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="border-b-[1.5px] border-[#00a9e0] pb-[1px] mb-[1px]">
                        <p className="font-bold text-[12px] truncate uppercase leading-tight text-black pr-8">
                          {item.name}
                        </p>
                      </div>

                      <p
                        className="text-[11px] font-semibold text-gray-500 mt-[2px] italic leading-tight pr-8 line-clamp-2 overflow-hidden text-ellipsis"
                        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                      >
                        {item.address || "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* Arrow Image */}
                  {item.hasNfcCard && (
                    <img
                      onClick={handleCardClick}
                      src={isCompanyNfc ? "/images/yellow-arrow.png" : "/images/arrow-01.png"}
                      alt="NFC Card"
                      className="absolute -right-[1px] top-1/2 -translate-y-1/2 z-10 w-[55px] h-[55px] object-contain cursor-pointer active:scale-95 transition-transform"
                    />
                  )}
                </div>
              )
            })
          )}

        </div>

        <Footer />

      </div>
    </div>
  )
}

export default MultiSearch
