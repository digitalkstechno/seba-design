'use client'

import { FC, useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { BsGlobe, BsShare } from "react-icons/bs"
import { HiOutlinePhone } from "react-icons/hi"
import { FaFilePdf } from "react-icons/fa"
import { AiOutlineHome } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { IoIosArrowBack } from "react-icons/io"

import Cropper, { Area } from 'react-easy-crop'

const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob | null> => {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.src = imageSrc
    image.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(null)

      canvas.width = pixelCrop.width
      canvas.height = pixelCrop.height

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      )

      canvas.toBlob((blob) => {
        resolve(blob)
      }, 'image/jpeg')
    }
    image.onerror = (error) => reject(error)
  })
}

const NewMember: FC = () => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [pdfName, setPdfName] = useState<string | null>(null)

  // Cropper states
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setOriginalImage(reader.result as string)
        setShowCropper(true)
        setCrop({ x: 0, y: 0 })
        setZoom(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleCrop = async () => {
    if (!originalImage || !croppedAreaPixels) return
    try {
      const blob = await getCroppedImg(originalImage, croppedAreaPixels)
      if (blob) {
        const file = new File([blob], "passport_photo.jpg", { type: "image/jpeg" })
        setCroppedFile(file)
        setImagePreview(URL.createObjectURL(blob))
        setShowCropper(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      if (croppedFile) {
        formData.set('image', croppedFile)
      }

      const { data } = await api.post('/seba/member/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.status === 'Success') {
        alert("Member application submitted successfully!")
        router.push("/home")
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

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

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
          {/* Upload Box */}
          <div className="absolute right-4 top-[90px] w-[120px] h-[130px] border-2 border-blue-400 rounded-lg bg-white shadow-sm flex flex-col items-center justify-center text-center text-[12px] overflow-hidden">
            {imagePreview ? (
              <img src={imagePreview} className="w-full h-full object-cover" />
            ) : (
              <>
                <p>Your</p>
                <p>Passport</p>
                <p>Size Photo</p>
                <p className="text-red-500 text-[11px] mt-1">
                  Click & attach
                </p>
              </>
            )}
            <input
              type="file"
              name="image"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleImageSelect}
            />
          </div>

          {/* Form */}
          <div className="mt-3 flex flex-col gap-2 text-[13px]">
            <input name="name" required className="h-9 px-3 rounded bg-white outline-none" placeholder="Full Name :" />
            <input name="position" className="h-9 px-3 rounded bg-white outline-none" placeholder="Position :" />
            <input name="category" required className="h-9 px-3 rounded bg-white outline-none" placeholder="Category in :" />
            <input name="mobile" required className="h-9 px-3 rounded bg-white outline-none" placeholder="Contact No. :" />
            <input name="officeNo" className="h-9 px-3 rounded bg-white outline-none" placeholder="Office No." />
            <input name="area" required className="h-9 px-3 rounded bg-white outline-none" placeholder="Area :" />

            <textarea
              name="address"
              className="h-16 px-3 py-2 rounded bg-white outline-none resize-none"
              placeholder="Office Address :"
            />

            <input name="emailWebsite" className="h-9 px-3 rounded bg-white outline-none" placeholder="email / website :" />
          </div>

          {/* PDF + Call Section */}
          <div className="flex items-center gap-3 mt-3 px-8">

            {/* PDF Upload */}
            <label className="relative flex flex-col items-center justify-center bg-white border-2 border-red-400 rounded-md w-[65px] h-[80px] cursor-pointer">
              <input
                type="file"
                name="pdf"
                accept="application/pdf"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPdfName(file.name);
                }}
              />
              <FaFilePdf className={pdfName ? "text-green-600 text-xl" : "text-red-600 text-xl"} />
              <span className="text-[10px] font-semibold mt-1 text-center truncate w-full px-1">
                {pdfName ? "Uploaded" : "PDF"}
              </span>
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
          <button disabled={loading} type="submit" className="mt-3 bg-[#6b3e2e] text-white py-2 rounded-md text-sm w-[140px] mx-auto disabled:opacity-50">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

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

        {showCropper && originalImage && (
          <div className="absolute inset-0 bg-[#eeeeee] z-50 flex flex-col items-center justify-start p-5 pt-10">
            <h3 className="text-gray-900 text-[16px] font-bold uppercase tracking-wider mb-6 italic">Adjust Passport Photo</h3>
            
            {/* Crop Frame */}
            <div className="relative w-full h-[300px] bg-gray-900 rounded-lg overflow-hidden shadow-inner">
              <Cropper
                image={originalImage}
                crop={crop}
                zoom={zoom}
                aspect={3 / 4}
                restrictPosition={false}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>

            <p className="text-[12px] text-gray-500 font-medium mt-4 italic">Pinch or drag to crop like mobile apps</p>

            {/* Slider */}
            <div className="w-full max-w-[280px] mt-4 flex flex-col gap-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs text-gray-700 font-bold">Zoom Scale:</span>
                <span className="text-xs text-[#0b4b4b] font-extrabold">{zoom.toFixed(1)}x</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="3" 
                step="0.1" 
                value={zoom} 
                onChange={(e) => setZoom(parseFloat(e.target.value))} 
                className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-[#0b4b4b]"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-6 w-full max-w-[280px]">
              <button 
                type="button" 
                onClick={() => setShowCropper(false)} 
                className="flex-1 bg-white border border-gray-300 text-gray-600 py-3 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={handleCrop} 
                className="flex-1 bg-[#0b4b4b] text-white py-3 rounded-xl text-sm font-bold hover:bg-[#083737] transition-all shadow-md cursor-pointer active:scale-95"
              >
                Apply Crop
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default NewMember