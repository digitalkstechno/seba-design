'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { useAlert } from "@/context/AlertContext"

const Footer: FC = () => {
  const router = useRouter()
  const { showAlert } = useAlert()

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'SEBA - Digital Directory',
        text: 'Check out the SEBA Digital Directory App!',
        url: window.location.href
      }).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      showAlert("Link copied to clipboard!")
    }
  }

  return (
    <div className="bg-[#003d3d] px-6 py-2.5 flex justify-between items-center text-white absolute bottom-0 left-0 w-full z-50 border-t border-white/10 shadow-lg">
      <div
        onClick={() => router.push('/home')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <img src="/images/home icon.png" alt="home" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">Home</span>
      </div>

      <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
        <img src="/images/seba-link.png" alt="app link" className="w-[48px] h-[48px] object-contain my-[-8px]" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">App Link</span>
      </div>

      <div
        className="flex flex-col items-center opacity-90 transition-opacity"
      >
        <img src="/images/wolrd.png" alt="www.seba" className="w-[50px] h-[50px] object-contain my-[-10px]" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">www.seba</span>
      </div>

      <div
        onClick={() => router.push('/dropbox')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <img src="/images/dropbox.png" alt="dropbox" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">Dropbox</span>
      </div>

      <button
        onClick={handleShare}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity bg-transparent border-none text-white p-0"
      >
        <img src="/images/share.png" alt="share" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">Share</span>
      </button>
    </div>
  )
}

export default Footer
