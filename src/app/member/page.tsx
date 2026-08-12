'use client'

import { FC, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FaSearch } from "react-icons/fa"
import Footer from "@/components/Footer"
import { getCookie, setCookie, deleteCookie } from "@/lib/cookies"
import { cleanPhoneNumber } from "@/lib/phoneUtils"

// Types
type MemberType = {
  id: string
  name: string
  category: string
  subCategory?: string
  natureOfBusiness?: string
  company: string
  isCompany?: boolean
  hasNfcCard?: boolean
  nfcCardStatus?: string
  isSponsorNfc?: boolean
  cardId?: string
  mobile: string
  address: string
  image: string
  dob: string
  emailWebsite: string
}

const formatDateOfBirth = (dobStr?: string) => {
  if (!dobStr || dobStr === "N/A") return "";
  try {
    const d = new Date(dobStr);
    if (isNaN(d.getTime())) return dobStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return dobStr;
  }
};

const MemberContent: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || ''
  const urlSubCategory = searchParams.get('subCategory') || ''
  const urlArea = searchParams.get('area') || ''

  const [members, setMembers] = useState<MemberType[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      let token = getCookie("seba_token");
      if (!token) {
        const mob = getCookie("seba_user_mobile");
        const name = getCookie("seba_user_name");
        if (mob) {
          try {
            const cleanMob = cleanPhoneNumber(mob);
            const { data } = await api.post("/seba/user/login", { name: name || "", mobile: cleanMob });
            if (data.status === "Success" && data.data?.token) {
              setCookie("seba_token", data.data.token);
              deleteCookie("seba_user_is_inactive");
              token = data.data.token;
            }
          } catch (err: any) {
            if (err.response?.data?.message?.toLowerCase().includes("inactive")) {
              setCookie("seba_user_is_inactive", "true");
            }
          }
        }
      }

      if (!token) {
        router.push("/home?restricted=true");
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let query = `/seba/member?status=active&search=${searchTerm}`
        if (urlCategory) query += `&category=${encodeURIComponent(urlCategory)}`
        if (urlSubCategory) query += `&subCategory=${encodeURIComponent(urlSubCategory)}`
        if (urlArea) query += `&area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          setMembers(data.data.map((item: any) => ({
            id: item.memberId,
            name: item.name,
            category: item.category,
            subCategory: item.subCategory,
            natureOfBusiness: item.natureOfBusiness,
            company: item.company,
            isCompany: Boolean(item.isCompany),
            hasNfcCard: Boolean(item.hasNfcCard),
            nfcCardStatus: item.nfcCardStatus,
            isSponsorNfc: Boolean(item.isSponsorNfc),
            cardId: item.cardId,
            mobile: item.mobile,
            address: item.address,
            image: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/member.webp",
            dob: item.dob || "N/A",
            emailWebsite: item.emailWebsite
          })).sort((a: any, b: any) => {
            const getSortRank = (m: any) => {
              const isComp = Boolean(m.isCompany);
              const hasNfc = Boolean((m.hasNfcCard || m.isSponsorNfc) && m.nfcCardStatus === 'active');
              if (isComp && hasNfc) return 1;    // 1: Company WITH NFC
              if (!isComp && hasNfc) return 2;   // 2: Member WITH NFC
              if (isComp && !hasNfc) return 3;   // 3: Company WITHOUT NFC
              return 4;                          // 4: Member WITHOUT NFC
            };

            const rankA = getSortRank(a);
            const rankB = getSortRank(b);
            if (rankA !== rankB) {
              return rankA - rankB;
            }
            return (a.name || "").localeCompare(b.name || "");
          }))
        }
      } catch (err: any) {
        if (err.response?.status === 401 || err.response?.data?.message?.toLowerCase().includes("inactive")) {
          setCookie("seba_user_is_inactive", "true");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchMembers()
  }, [searchTerm, urlCategory, urlSubCategory, urlArea])

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-[100vh] bg-[#eeeeee] relative px-4 pt-4 shadow-2xl overflow-y-auto overflow-x-hidden flex flex-col pb-[70px] scrollbar-none">

        {/* Top bar */}
        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-2 mb-2 cursor-pointer" onClick={() => router.push('/home')}>
            <IoIosArrowBack className="text-gray-700 text-lg" />
            <h1 className="text-base font-bold text-gray-900 tracking-wide uppercase">
              SEBA MEMBERS
            </h1>
          </div>

          {/* Subtitle */}
          <div className="px-1 mb-2">
            <p className="text-[14px] italic">
              Welcome to <span className="font-semibold">SEBA</span> Members List
            </p>
          </div>

          {/* Search */}
          <div className="mt-2 mb-4 flex items-center bg-gray-200 rounded-full px-4 py-2 border border-gray-300">
            <input
              type="text"
              placeholder="Search by Name / Surnames"
              className="flex-1 bg-transparent outline-none text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="text-gray-700" />
          </div>
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar pb-4">

          {members.map((member) => (
            <div key={member.id} className="mb-4 border border-gray-300 bg-white">

              <div className="flex p-2 gap-2 relative">

                {/* Image + ID + DOB */}
                <div className="w-[75px] text-center text-[11px] shrink-0">
                  <div className="w-[70px] h-[80px] bg-white flex items-center justify-center mx-auto overflow-hidden rounded-md border border-gray-200 shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-1 font-semibold text-[10px] tracking-tight">{member.id}</p>
                  {member.dob && member.dob !== "N/A" && (
                    <p className="text-[9.5px] font-bold text-gray-700 mt-0.5 leading-tight">
                      {formatDateOfBirth(member.dob)}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 text-[12px] leading-5 pr-1 flex flex-col justify-center">
                  <p className="font-semibold text-[13px] leading-snug">
                    {member.name}
                  </p>
                  {member.category && (
                    <p className="text-gray-500 font-bold text-[10.5px] mt-0.5 uppercase tracking-wider">
                      {member.category}
                    </p>
                  )}
                  <p className="font-semibold text-gray-800 mt-0.5">{member.company}</p>
                  <p className="text-gray-600 mt-0.5 font-medium">{member.mobile}</p>
                  <p className="text-gray-500 mt-0.5 leading-normal">{member.address}</p>
                </div>

              </div>

              <div className="bg-[#015d82] text-white text-center text-[12px] py-1">
                {member.emailWebsite || "www.website / email :"}
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

const Member: FC = () => {
  return (
    <Suspense fallback={<div className="h-screen bg-[#d9d9d9] flex justify-center items-center">Loading...</div>}>
      <MemberContent />
    </Suspense>
  )
}

export default Member
