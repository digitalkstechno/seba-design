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
    <div className="bg-[#003d3d] px-6 py-2.5 flex justify-between items-center text-white fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[420px] z-50 border-t border-white/10 shadow-lg">
      <div
        onClick={() => router.push('/home')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <img src="/images/home icon.png" alt="home" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">home</span>
      </div>

      <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity">
        <img src="/images/seba-link.png" alt="app link" className="w-[36px] h-[36px] object-contain my-[-4px]" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">app link</span>
      </div>

      <div
        onClick={() => window.open('http://www.seba.org', '_blank')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <img src="/images/wolrd.png" alt="www.seba" className="w-[40px] h-[40px] object-contain my-[-6px]" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">www.seba</span>
      </div>

      <div
        onClick={() => router.push('/buildersDeveloper')}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity"
      >
        <img src="/images/dropbox.png" alt="dropbox" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">dropbox</span>
      </div>

      <button
        onClick={handleShare}
        className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100 transition-opacity bg-transparent border-none text-white p-0"
      >
        <img src="/images/share.png" alt="share" className="w-[28px] h-[28px] object-contain" />
        <span className="text-[12px] mt-1 font-medium tracking-wide">share</span>
      </button>
    </div>
  )
}

export default Footer
