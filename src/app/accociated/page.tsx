'use client'

import { FC, ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"
import Footer from "@/components/Footer"

// Types
type Association = {
  name: string
  img: string
}

type AssociationCardProps = Association

// Components
const AssociationCard: FC<AssociationCardProps> = ({ name, img }) => (
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
    <div className="h-[110px] overflow-hidden">
      <img
        src={img}
        alt={name}
        className="w-full h-full object-cover object-top"
      />
    </div>

    <div className="bg-gray-300 text-center text-[11px] py-2 font-medium leading-tight px-1">
      {name}
    </div>
  </div>
)


// Main Component
const Associated: FC = () => {
  const router = useRouter()
  const [associations, setAssociations] = useState<Association[]>([])

  useEffect(() => {
    const fetchAssociations = async () => {
      try {
        const { data } = await api.get('/seba/associated');
        if (data.status === 'Success') {
          setAssociations(data.data.map((item: any) => ({
            name: item.name,
            img: `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}`
          })))
        }
      } catch (err) {
        console.error("Failed to fetch associations", err)
      }
    }
    fetchAssociations()
  }, [])

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center">
      <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => router.back()}
              className="text-xl cursor-pointer"
            />
            <p className="text-[14px] italic">
              Welcome to Association Zone
            </p>
          </div>

          {/* Profile */}
          <div className="absolute right-[-14px] top-[-14px] z-20">
            <img
              src="/images/Associated_profile.png"
              alt="profile"
              className="w-[110px] h-[110px] object-contain"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-20">
          <div className="grid grid-cols-3 gap-4 mt-10">
            {associations.map((item, index) => (
              <AssociationCard
                key={index}
                name={item.name}
                img={item.img}
              />
            ))}
          </div>
        </div>

        <Footer />

      </div>
    </div>
  )
}

export default Associated
