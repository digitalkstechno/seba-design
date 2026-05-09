'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { AiOutlineHome } from "react-icons/ai"
import { BsGlobe, BsShare } from "react-icons/bs"
import { LuLayoutDashboard } from "react-icons/lu"

import { useAlert } from "@/context/AlertContext"

const Footer: FC = () => {
  const router = useRouter()
  const { showAlert } = useAlert()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SEBA - Digital Directory',
        url: window.location.href
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      showAlert("Link copied to clipboard!")
    }
  }

  return (
    <div className="bg-[#003d3d] -mx-5 px-6 py-3 flex justify-between items-center text-white fixed bottom-0 w-[420px] z-50">
      <div 
        onClick={() => router.push('/home')} 
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <AiOutlineHome className="text-xl" />
        <span className="text-[10px] mt-1 font-bold uppercase">home</span>
      </div>

      <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
        <img src="/images/seba-link1.png" alt="app" className="w-8 h-8 object-contain" />
        <span className="text-[10px] -mt-1 font-bold uppercase">app link</span>
      </div>

      <div 
        onClick={() => window.open('http://www.seba.org', '_blank')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <BsGlobe className="text-xl" />
        <span className="text-[10px] mt-1 font-bold uppercase">www.seba</span>
      </div>

      <div 
        onClick={() => router.push('/buildersDeveloper')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <LuLayoutDashboard className="text-xl" />
        <span className="text-[10px] mt-1 font-bold uppercase">dropbox</span>
      </div>

      <button
        onClick={handleShare}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <BsShare className="text-lg" />
        <span className="text-[10px] mt-1 font-bold uppercase">share</span>
      </button>
    </div>
  )
}

export default Footer
