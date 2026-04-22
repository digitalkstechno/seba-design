'use client'

import { FC } from "react"
import { useRouter } from "next/navigation"
import { BsGlobe, BsShare } from "react-icons/bs"
import { HiOutlinePhone } from "react-icons/hi"
import { FaFilePdf } from "react-icons/fa"
import { AiOutlineHome } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { IoIosArrowBack } from "react-icons/io"

const NewMember: FC = () => {
  const router = useRouter()

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">

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

        {/* Logo Section */}
        <div className="mt-3">
          <img src="/images/logo.png" alt="SEBA Logo" className="w-24" />
          <p className="text-sm mt-1 text-gray-700">
            become a new member of SEBA
          </p>
          <p className="text-blue-700 font-semibold text-md mt-1">
            Fill and Submit
          </p>
        </div>

        {/* Upload Box */}
        <div className="absolute right-4 top-[90px] w-[120px] h-[130px] border-2 border-blue-400 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center text-center text-[12px] overflow-hidden">
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <p>Your</p>
          <p>Passport</p>
          <p>Size Photo</p>
          <p className="text-red-500 text-[11px] mt-1">
            Click & attach
          </p>
        </div>

        {/* Form */}
        <div className="mt-3 flex flex-col gap-2 text-[13px]">
          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="Full Name :" />
          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="Position :" />
          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="Category in :" />
          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="Contact No. :" />
          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="Office No." />

          <textarea
            className="h-16 px-3 py-2 rounded bg-white outline-none resize-none"
            placeholder="Office Address :"
          />

          <input className="h-9 px-3 rounded bg-white outline-none" placeholder="email / website :" />
        </div>

        {/* PDF + Call Section */}
        <div className="flex items-center gap-3 mt-3 px-8">

          {/* PDF Upload */}
          <label className="relative flex flex-col items-center justify-center bg-white border-2 border-red-400 rounded-md w-[65px] h-[80px] cursor-pointer">
            <input
              type="file"
              accept="application/pdf"
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <FaFilePdf className="text-red-600 text-xl" />
            <span className="text-[11px] font-semibold mt-1">PDF</span>
          </label>

          {/* Text */}
          <p className="text-[11px] text-gray-800 italic leading-tight flex-1">
            download pdf form fill and submit to Surat East Builder Association and
            use contact button for <b>SEBA</b> inquiry.
          </p>

          {/* Call Button */}
          <div className="flex items-star bg-[#e5e5e5] rounded-lg px-1 py-1 shadow-sm border border-gray-300 border-t-2 border-t-black h-[48px]">
            <HiOutlinePhone className="text-3xl text-green-600 mt-1" />
            <span className="text-[11px] mt-[8px] font-medium text-gray-700 leading-none">
              Call
            </span>
          </div>
        </div>

        {/* Submit */}
        <button className="mt-3 bg-[#6b3e2e] text-white py-2 rounded-md text-sm w-[140px] mx-auto">
          Submit
        </button>

        {/* Bottom Nav */}
        <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <AiOutlineHome className="text-xl" />
            <span className="text-[10px] mt-1">home</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <img
              src="/images/seba-link1.png"
              alt="app"
              className="w-8 h-8 object-contain"
            />
            <span className="text-[10px] -mt-1">App Link</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <BsGlobe className="text-xl" />
            <span className="text-[10px] mt-1">www.seba</span>
          </div>

          <div className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
            <LuLayoutDashboard className="text-xl" />
            <span className="text-[10px] mt-1">dropbox</span>
          </div>

          <button
            onClick={() => router.push('/advertisement')}
            className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100"
          >
            <BsShare className="text-lg" />
            <span className="text-[10px] mt-1">share</span>
          </button>

        </div>

      </div>
    </div>
  )
}

export default NewMember