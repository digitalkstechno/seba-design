'use client'

import { FC, useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { FaSearch } from "react-icons/fa"
import Footer from "@/components/Footer"
import { getCookie } from "@/lib/cookies"

// Types
type MemberType = {
  id: string
  name: string
  category: string
  subCategory?: string
  natureOfBusiness?: string
  company: string
  mobile: string
  address: string
  image: string
  dob: string
  emailWebsite: string
}

const MemberContent: FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlCategory = searchParams.get('category') || ''
  const urlSubCategory = searchParams.get('subCategory') || ''
  const urlArea = searchParams.get('area') || ''

  const [members, setMembers] = useState<MemberType[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = getCookie("seba_token");
    if (!token) {
      router.push("/home?restricted=true");
    }
  }, [router]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        let query = `/seba/member?search=${searchTerm}`
        if (urlCategory) query += `&category=${encodeURIComponent(urlCategory)}`
        if (urlSubCategory) query += `&subCategory=${encodeURIComponent(urlSubCategory)}`
        if (urlArea) query += `&area=${encodeURIComponent(urlArea)}`

        const { data } = await api.get(query)
        if (data.status === 'Success') {
          setMembers(data.data.map((item: any) => ({
            id: item.memberId,
            name: item.position ? `${item.name} - ${item.position}` : item.name,
            category: item.category,
            subCategory: item.subCategory,
            natureOfBusiness: item.natureOfBusiness,
            company: item.company,
            mobile: item.mobile,
            address: item.address,
            image: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/member.webp",
            dob: "N/A", // DOB not requested in backend but kept in type
            emailWebsite: item.emailWebsite
          })))
        }
      } catch (err) {
        console.error("Failed to fetch members", err)
      }
    }
    fetchMembers()
  }, [searchTerm, urlCategory, urlArea])

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">

      <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => router.push('/home')}
              className="text-xl cursor-pointer"
            />
            <p className="text-[14px] italic">
              Welcome to <span className="font-semibold">SEBA</span> Members List
            </p>
          </div>

          {/* Profile */}
          <div className="absolute right-[-14px] top-[-14px] z-20">
            <img
              src="/images/member_profile.png"
              alt="profile"
              className="w-[110px] h-[110px] object-contain"
            />
          </div>
        </div>

        {/* Search */}
        <div className="mt-8 mb-4 flex items-center bg-gray-200 rounded-full px-4 py-2">
          <input
            type="text"
            placeholder="Search by Name / Surnames"
            className="flex-1 bg-transparent outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-gray-700" />
        </div>

        {/* Scroll Area */}
        <div className="flex-1 overflow-y-auto pr-1 no-scrollbar pb-20">

          {members.map((member) => (
            <div key={member.id} className="mb-4 border border-gray-300 bg-white">

              <div className="flex p-2 gap-2">

                {/* Image + ID */}
                <div className="w-[70px] text-center text-[11px]">
                  <div className="w-[70px] h-[80px] bg-white flex items-center justify-center mx-auto overflow-hidden rounded-md border border-gray-200 shadow-sm">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="mt-1 font-medium">{member.id}</p>
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
