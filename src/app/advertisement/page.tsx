'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { IoIosArrowBack } from "react-icons/io"
import Footer from "@/components/Footer"

// Types
type Section = {
  title: string
  items: string[]
}

// Data
const SECTIONS: Section[] = [
  {
    title: "Builder & Developers",
    items: ["Industrial", "Residential", "Commercial", "Plotting", "Industrial", "Industrial"]
  },
  {
    title: "Architects",
    items: ["Architect & Interior Designer", "Interior Designer", ".........................", "........................."]
  },
  {
    title: "Manufacturers",
    items: [
      "Elevators",
      "TMT Bar",
      ".........................",
      ".........................",
      ".........................",
      ".........................",
      "........................."
    ]
  },
  {
    title: "Building Material Suppliers",
    items: [
      ".........................",
      ".........................",
      "........................."
    ]
  }
]

// Component
const Advertisement: FC = () => {
  const router = useRouter()

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">
      <div className="w-[420px] h-full bg-[#eeeeee] relative px-4 pt-4 shadow-md flex flex-col overflow-hidden">

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
                  src="/images/auth_page_1.png"
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="mt-8 flex-1 overflow-y-auto flex flex-col gap-6 pb-20 pr-1">
          {SECTIONS.map((section, index) => (
            <div key={index}>

              {/* Title */}
              <div className="bg-[#e5e5e5] text-sm rounded-full py-1 text-center text-red-500 font-semibold shadow-inner">
                {section.title}
              </div>

              {/* Items */}
              <ul className="mt-3 pl-5 text-sm text-gray-800 space-y-1">
                {section.items.map((item, i) => (
                  <li key={i} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>

            </div>
          ))}
        </div>

        <Footer />

      </div>
    </div>
  )
}

export default Advertisement
