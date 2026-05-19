'use client'

import { FC, useState, FormEvent, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { formatPhoneNumber, cleanPhoneNumber } from "@/lib/phoneUtils"
import { BsGlobe, BsShare } from "react-icons/bs"
import { HiOutlinePhone } from "react-icons/hi"
import { FaFilePdf } from "react-icons/fa"
import { AiOutlineHome } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { IoIosArrowBack } from "react-icons/io"
import { jsPDF } from "jspdf"
import Cropper, { Area } from 'react-easy-crop'
import Footer from "@/components/Footer"
import { useAlert } from "@/context/AlertContext"
import { setCookie } from "@/lib/cookies"

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
  const { showAlert } = useAlert()
  const formRef = useRef<HTMLFormElement>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [croppedFile, setCroppedFile] = useState<File | null>(null)

  // Cropper states
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const [mobile, setMobile] = useState(formatPhoneNumber(""))
  const [officeNo, setOfficeNo] = useState(formatPhoneNumber(""))

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

  const handleDownloadPDF = async () => {
    if (!formRef.current) return
    const formData = new FormData(formRef.current)

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Function to load image as base64
    const getImageData = (url: string): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/png"));
          } else {
            reject("Could not get canvas context");
          }
        };
        img.onerror = () => reject("Could not load image");
        img.src = url;
      });
    };

    // 1. Decorative Background Elements
    doc.setFillColor(11, 75, 75) // Theme Color #0b4b4b
    doc.rect(0, 0, 15, pageHeight, 'F') // Vertical Sidebar

    // 2. Header Section with Logo
    try {
      const logoData = await getImageData("/images/logo.png");
      doc.addImage(logoData, 'PNG', 20, 15, 20, 20);
    } catch (e) {
      console.error("Logo failed to load for PDF", e);
      doc.setFont("helvetica", "bold")
      doc.setFontSize(24)
      doc.setTextColor(11, 75, 75)
      doc.text("SEBA", 25, 25)
    }

    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(11, 75, 75)
    doc.text("SEBA", 45, 27)

    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "italic")
    doc.text("Surat East Builder Association", 45, 33)

    doc.setDrawColor(11, 75, 75)
    doc.setLineWidth(0.5)
    doc.line(20, 40, 190, 40)

    // 3. Document Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(50, 50, 50)
    doc.text("MEMBERSHIP APPLICATION FORM", 25, 52)


    const fields = [
      { label: "FULL NAME", value: formData.get('name'), icon: "👤" },
      { label: "COMPANY NAME", value: formData.get('company'), icon: "🏢" },
      { label: "DESIGNATION", value: formData.get('position'), icon: "💼" },
      { label: "NATURE OF BUSINESS", value: formData.get('natureOfBusiness'), icon: "🏢" },
      { label: "PERSONAL NO.", value: formatPhoneNumber(formData.get('mobile') as string), icon: "📱" },
      { label: "OFFICE NO.", value: formData.get('officeNo') ? formatPhoneNumber(formData.get('officeNo') as string) : "", icon: "📞" },
      { label: "OFFICE ADDRESS", value: formData.get('address'), icon: "🏠" },
      { label: "EMAIL / WEBSITE", value: formData.get('emailWebsite'), icon: "🌐" },
    ]

    let y = 65
    fields.forEach((field, index) => {
      const rawVal = field.value?.toString().trim()
      const val = rawVal && rawVal !== "" ? rawVal : ""
      const splitText = doc.splitTextToSize(val, index < 6 ? 110 : 160) // Wider if below photo

      // Calculate dynamic height for this row
      const rowHeight = (splitText.length * 5) + 8

      // Background for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 248, 248)
        doc.rect(20, y - 5, 170, rowHeight, 'F')
      }

      // Label
      doc.setFont("helvetica", "bold")
      doc.setFontSize(8.5)
      doc.setTextColor(11, 75, 75)
      doc.text(field.label, 25, y)

      // Value
      doc.setFont("helvetica", "normal")
      doc.setFontSize(10)
      doc.setTextColor(40, 40, 40)
      doc.text(splitText, 25, y + 5)

      y += rowHeight + 2 // Extra gap between rows
    })

    // 6. Member Photo (Drawn after fields to ensure it's on top of backgrounds)
    if (imagePreview) {
      try {
        // Shadow effect for photo
        doc.setFillColor(230, 230, 230)
        doc.rect(152, 47, 40, 50, 'F')

        doc.addImage(imagePreview, 'JPEG', 150, 45, 40, 50)
        doc.setDrawColor(11, 75, 75)
        doc.setLineWidth(0.8)
        doc.rect(150, 45, 40, 50)
      } catch (e) {
        console.error("PDF Image add failed", e)
      }
    }

    // 6. Footer Section
    doc.setFillColor(11, 75, 75)
    doc.rect(0, pageHeight - 20, pageWidth, 20, 'F')

    doc.setFont("helvetica", "bold")
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text("CONFIDENTIAL DOCUMENT", pageWidth / 2, pageHeight - 12, { align: 'center' })

    doc.setFontSize(8)
    doc.setFont("helvetica", "normal")
    doc.text("This form is generated electronically via SEBA Digital Portal", pageWidth / 2, pageHeight - 7, { align: 'center' })

    doc.save(`${formData.get('name') || 'Member'}_SEBA_Application.pdf`)
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      if (croppedFile) {
        formData.set('image', croppedFile)
      }

      formData.set('category', '')
      formData.set('subCategory', '')
      formData.set('area', '')
      formData.set('pincode', '')
      formData.set('city', '')
      formData.set('state', '')

      const cleanedMobile = cleanPhoneNumber(mobile)
      const cleanedOfficeNo = cleanPhoneNumber(officeNo)

      formData.set('mobile', cleanedMobile)
      formData.set('officeNo', cleanedOfficeNo)

      const { data } = await api.post('/seba/member/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.status === 'Success') {
        setCookie("seba_registered", "true")
        showAlert("Member application submitted successfully!")
        router.push("/home")
      }
    } catch (err: any) {
      showAlert(err.response?.data?.message || "Failed to submit application")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen bg-[#d9d9d9] flex justify-center items-start">

      <div className="w-[420px] h-full bg-[#eeeeee] relative px-5 pt-5 shadow-md flex flex-col">

        {/* Profile */}
        <div className="absolute right-[-14px] top-[-14px] z-20">
          <img
            src="/images/new_member_profile.png"
            className="w-[110px] h-[110px] object-contain"
            alt="profile"
          />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => router.back()}
              className="text-xl cursor-pointer"
            />
            <p className="text-[14px] italic">
              Welcome to New Member
            </p>
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

        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto pb-32 no-scrollbar">
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
            <input name="name" required className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="Full Name :" />
            <input name="company" required className="h-9 px-3 rounded bg-white outline-none font-bold border-l-4 border-[#0b4b4b]" placeholder="Company Name :" />
            <input name="position" className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="Position :" />
            <input name="natureOfBusiness" required className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="Nature of Business :" />

            <input
              name="mobile"
              required
              className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]"
              placeholder="Personal No. :"
              value={mobile}
              onChange={(e) => setMobile(formatPhoneNumber(e.target.value))}
            />

            <input
              name="officeNo"
              className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]"
              placeholder="Office No. :"
              value={officeNo}
              onChange={(e) => setOfficeNo(formatPhoneNumber(e.target.value))}
            />

            <textarea
              name="address"
              required
              className="h-16 px-3 py-2 rounded bg-white outline-none resize-none border-l-4 border-[#0b4b4b]"
              placeholder="Full Office Address :"
            />

            <input name="emailWebsite" className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="email / website :" />
          </div>


          {/* PDF + Call Section */}
          <div className="flex items-center justify-between gap-3 mt-4 px-1 py-1 bg-transparent">

            {/* PDF Download Button from Image */}
            <img
              src="/images/new_member_pdf.png"
              alt="PDF Download"
              onClick={handleDownloadPDF}
              className="w-[50px] h-[64px] object-contain shrink-0 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
            />

            {/* Elegant Georgia Italic Text */}
            <p className="font-georgia italic font-medium text-[10.5px] text-gray-800 leading-[1.3] flex-1 text-center px-1">
              download pdf form fill and submit to<br />
              Surat East Builder Association and<br />
              use contact button for SEBA inquiry.
            </p>

            {/* Call Button from Image */}
            <a
              href="tel:+917990521193"
              className="shrink-0 hover:scale-105 active:scale-95 transition-transform"
            >
              <img
                src="/images/new_member_call.png"
                alt="Call"
                className="w-[82px] h-[64px] object-contain"
              />
            </a>
          </div>

          {/* Submit */}
          <button disabled={loading} type="submit" className="mt-3 bg-[#6b3e2e] text-white py-2 rounded-md text-sm w-[140px] mx-auto disabled:opacity-50">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <Footer />

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
