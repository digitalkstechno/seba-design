'use client'

import { FC, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { IoIosArrowBack } from "react-icons/io"
import { LuLayoutDashboard } from "react-icons/lu"

// Types
type Association = {
  name: string
  img: string
}

type AssociationCardProps = Association

type BottomNavItemProps = {
  children: ReactNode
  label: string
  onClick?: () => void
}

// Data
const ASSOCIATIONS: Association[] = [
  { name: "ARCHITECT ASSOCIATION", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "HARDWARE ASSOCIATION", img: "/images/member.webp" },
  { name: "INTERIOR DESIGNER", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "ELECTRICAL ASSOCIATION", img: "/images/member.webp" },
  { name: "INTERIOR DESIGNER ASSOCIATION", img: "/images/member.webp" },
]

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

const BottomNavItem: FC<BottomNavItemProps> = ({ children, label, onClick }) => (
  <div
    onClick={onClick}
    className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100"
  >
    {children}
    <span className="text-[10px] mt-1">{label}</span>
  </div>
)

// Main Component
const Associated: FC = () => {
  const router = useRouter()

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
              Welcome to <span className="font-semibold">SEBA</span> Members List
            </p>
          </div>

          {/* Profile */}
          <div className="absolute right-4 top-4">
            <div className="p-[3px] rounded-full bg-yellow-300 shadow-[0_0_15px_#facc15]">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-white">
                <img
                  src="/images/user-profile.jpg"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-4 mt-10">
          {ASSOCIATIONS.map((item, index) => (
            <AssociationCard
              key={index}
              name={item.name}
              img={item.img}
            />
          ))}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">
          <BottomNavItem label="home">
            <AiOutlineHome className="text-xl" />
          </BottomNavItem>

          <BottomNavItem label="App Link">
            <img
              src="/images/seba-link1.png"
              alt="app link"
              className="w-8 h-8 object-contain"
            />
          </BottomNavItem>

          <BottomNavItem label="www.seba">
            <BsGlobe className="text-xl" />
          </BottomNavItem>

          <BottomNavItem label="dropbox">
            <LuLayoutDashboard className="text-xl" />
          </BottomNavItem>

          <BottomNavItem
            label="share"
            onClick={() => router.push('/advertisement')}
          >
            <BsShare className="text-lg" />
          </BottomNavItem>
        </div>

      </div>
    </div>
  )
}

export default Associated