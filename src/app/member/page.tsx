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
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils"

// Types
type MemberType = {
  id: string
  sebaNo?: string
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

const getContactInfo = (emailWebsite?: string, mobile?: string) => {
  const email = (emailWebsite || "").trim();
  let mobileFormatted = "";
  if (mobile) {
    const formatted = formatPhoneNumber(mobile);
    if (formatted && formatted !== "+91 ") {
      mobileFormatted = `m: ${formatted}`;
    }
  }

  if (email && mobileFormatted) {
    return `${email} | ${mobileFormatted}`;
  }
  if (email) {
    return email;
  }
  if (mobileFormatted) {
    return mobileFormatted;
  }
  return "www.website / email :";
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
        let query = `/seba/member?search=${encodeURIComponent(searchTerm)}`
        if (urlCategory) query += `&category=${encodeURIComponent(urlCategory)}`
        if (urlSubCategory) query += `&subCategory=${encodeURIComponent(urlSubCategory)}`
        if (urlArea) query += `&area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          const getSebaNo = (item: any) => {
            const rawSeba = (item.sebaNo || item.memberId || "").trim();
            if (rawSeba && !/^[0-9a-fA-F]{24}$/.test(rawSeba)) {
              return rawSeba;
            }
            return "";
          };

          const filtered = data.data.filter((item: any) => Boolean(getSebaNo(item)));

          setMembers(filtered.map((item: any) => ({
            id: item.memberId || item._id,
            sebaNo: getSebaNo(item),
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
            emailWebsite: item.emailWebsite || "",
          })).sort((a: any, b: any) => (a.name || "").trim().localeCompare((b.name || "").trim(), undefined, { sensitivity: 'base' })))
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
            <div key={member.id} className="mb-2.5 border border-gray-300 bg-white">

              <div className="flex p-2 gap-2 relative">

                {/* Image + ID + DOB */}
                <div className="w-[75px] text-center text-[11px] shrink-0">
                  <div className="w-[80px] h-[80px] bg-white flex items-center justify-center mx-auto overflow-hidden rounded-full border border-gray-200 shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-1 font-semibold text-[10px] tracking-tight">{member.sebaNo ? member.sebaNo : "No SEBA No"}</p>
                  {member.dob && member.dob !== "N/A" && (
                    <p className="text-[9.5px] font-bold text-gray-700 leading-tight">
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
                    <p className="text-gray-500 font-bold text-[10.5px] uppercase tracking-wider">
                      {member.category}
                    </p>
                  )}
                  <p className="font-semibold text-gray-800">{member.company}</p>
                  <p
                    className="text-gray-500 leading-snug text-[11px] line-clamp-2 overflow-hidden text-ellipsis"
                    style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
                  >
                    {member.address}
                  </p>
                </div>

              </div>

              <div className="bg-[#015d82] text-white text-center text-[12px] py-1 px-2 truncate">
                {getContactInfo(member.emailWebsite, member.mobile)}
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
