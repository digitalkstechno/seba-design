'use client'

import { FC, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { IoIosArrowBack } from "react-icons/io"
import Footer from "@/components/Footer"

// Types
type Association = {
  name: string
  shortName?: string
  img: string
}

type AssociationCardProps = Association

// Components
const AssociationCard: FC<AssociationCardProps> = ({ name, shortName, img }) => {
  const displayShortName = shortName
    ? (shortName.includes('-') ? shortName : `${shortName} - Surat`)
    : `${name} - Surat`;

  const [imgSrc, setImgSrc] = useState(img);

  useEffect(() => {
    setImgSrc(img);
  }, [img]);

  return (
    <div className="relative flex items-center w-full group transition-transform hover:scale-[1.01]">
      {/* Left Circular Logo Badge */}
      <div className="w-[58px] h-[58px] rounded-full bg-white shadow-md flex items-center justify-center overflow-hidden p-1 shrink-0 z-30 relative">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgSrc("/images/Associated.png")}
          className="max-w-full max-h-full object-contain rounded-full"
        />
      </div>

      {/* Main Banner Wrapper */}
      <div className="flex-1 -ml-7 relative z-10">
        {/* Grey Chevron Bar */}
        <div
          className="w-full bg-[#626973] text-white pl-9 pr-6 pt-1 pb-3.5 min-h-[48px] flex items-center shadow-sm"
          style={{
            clipPath: "polygon(0 0, calc(100% - 25px) 0, 100% 50%, calc(100% - 25px) 100%, 0 100%)",
          }}
        >
          {/* Full Name in Serif Italic */}
          <p className="font-serif italic text-[16px] text-white/95 leading-tight truncate pr-2">
            {name}
          </p>
        </div>

        {/* Yellow Tag Ribbon - Starts under logo with pl-9 padding so text starts right after logo */}
        <div className="absolute left-0 -bottom-1.5 z-20">
          <span
            className="inline-block bg-[#e5d886] text-gray-900 font-serif font-bold text-[11px] tracking-wide pl-9 pr-6 py-[2px] shadow-sm min-w-[200px]"
            style={{
              clipPath: "polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%)",
            }}
          >
            {displayShortName}
          </span>
        </div>
      </div>
    </div>
  );
};

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
            shortName: item.shortName,
            img: item.image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${item.image}` : "/images/Associated.png"
          })))
        }
      } catch (err) {
        console.error("Failed to fetch associations", err)
      }
    }
    fetchAssociations()
  }, [])

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-[100vh] bg-[#eeeeee] relative px-4 pt-5 shadow-2xl flex flex-col overflow-hidden pb-[75px] border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => router.back()}
              className="text-xl cursor-pointer"
            />
            <p className="text-[14px] italic font-medium text-gray-800">
              Welcome to Association Zone
            </p>
          </div>

          {/* Profile */}
          <div className="absolute right-[10px] top-[0px] z-20">
            <img
              src="/images/Associated_profile.png"
              alt="profile"
              className="w-[90px] h-[90px] object-contain"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pt-2">
          <div className="flex flex-col space-y-2 mt-4">
            {associations.map((item, index) => (
              <AssociationCard
                key={index}
                name={item.name}
                shortName={item.shortName}
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
