'use client'

import { FC, useState, FormEvent, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { BsGlobe, BsShare } from "react-icons/bs"
import { HiOutlinePhone } from "react-icons/hi"
import { FaFilePdf } from "react-icons/fa"
import { AiOutlineHome } from "react-icons/ai"
import { LuLayoutDashboard } from "react-icons/lu"
import { IoIosArrowBack } from "react-icons/io"
import { jsPDF } from "jspdf"
import SearchableSelect from "@/components/SearchableSelect"
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

  // Categories
  const [categories, setCategories] = useState<any[]>([])
  const [categorySelection, setCategorySelection] = useState("")
  const [showOtherCategory, setShowOtherCategory] = useState(false)
  const [areaValue, setAreaValue] = useState("")
  const [pincode, setPincode] = useState("")
  const [city, setCity] = useState("Surat")
  const [state, setState] = useState("Gujarat")

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/seba/category")
        if (data.status === "Success") {
          setCategories(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch categories", err)
      }
    }
    fetchCategories()
  }, [])

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

    // 1. Decorative Background Elements
    doc.setFillColor(11, 75, 75) // Theme Color #0b4b4b
    doc.rect(0, 0, 15, pageHeight, 'F') // Vertical Sidebar
    
    // 2. Header Section
    doc.setFont("helvetica", "bold")
    doc.setFontSize(28)
    doc.setTextColor(11, 75, 75)
    doc.text("SEBA", 25, 25)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont("helvetica", "italic")
    doc.text("Surat East Builder Association", 25, 32)
    
    doc.setDrawColor(11, 75, 75)
    doc.setLineWidth(0.5)
    doc.line(25, 38, 190, 38)

    // 3. Document Title
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(50, 50, 50)
    doc.text("MEMBERSHIP APPLICATION FORM", 25, 52)

    // 4. Member Photo
    if (imagePreview) {
      try {
        // Shadow effect for photo
        doc.setFillColor(240, 240, 240)
        doc.rect(152, 47, 40, 50, 'F')
        
        doc.addImage(imagePreview, 'JPEG', 150, 45, 40, 50)
        doc.setDrawColor(11, 75, 75)
        doc.setLineWidth(0.8)
        doc.rect(150, 45, 40, 50)
      } catch (e) {
        console.error("PDF Image add failed", e)
      }
    }

    // 5. Member Details Section
    const fields = [
      { label: "FULL NAME", value: formData.get('name'), icon: "👤" },
      { label: "COMPANY NAME", value: formData.get('company'), icon: "🏢" },
      { label: "DESIGNATION", value: formData.get('position'), icon: "💼" },
      { label: "BUSINESS CATEGORY", value: showOtherCategory ? formData.get('otherCategory') : categorySelection, icon: "🏢" },
      { label: "PRIMARY MOBILE", value: formData.get('mobile'), icon: "📱" },
      { label: "OFFICE NUMBER", value: formData.get('officeNo'), icon: "📞" },
      { label: "OPERATIONAL AREA", value: formData.get('area'), icon: "📍" },
      { label: "OFFICE ADDRESS", value: formData.get('address'), icon: "🏠" },
      { label: "EMAIL / WEBSITE", value: formData.get('emailWebsite'), icon: "🌐" },
    ]

    let y = 70
    fields.forEach((field, index) => {
      // Background for alternate rows
      if (index % 2 === 0) {
        doc.setFillColor(245, 248, 248)
        doc.rect(25, y - 6, 115, 12, 'F')
      }

      doc.setFont("helvetica", "bold")
      doc.setFontSize(9)
      doc.setTextColor(11, 75, 75)
      doc.text(field.label, 30, y)
      
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      
      const val = field.value?.toString() || "N/A"
      const splitText = doc.splitTextToSize(val, 80)
      doc.text(splitText, 30, y + 6)
      
      y += (splitText.length * 6) + 12
    })

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

      // Handle category
      if (showOtherCategory) {
        const otherCat = formData.get('otherCategory') as string
        if (otherCat) {
          // Add to database first
          try {
            await api.post('/seba/category', { name: otherCat })
          } catch (e) {}
          formData.set('category', otherCat)
        }
      } else {
        formData.set('category', categorySelection)
      }

      // Ensure area is set from our state
      formData.set('area', areaValue)
      formData.set('pincode', pincode)
      formData.set('city', city)
      formData.set('state', state)

      const { data } = await api.post('/seba/member/new', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      if (data.status === 'Success') {
        localStorage.setItem("seba_registered", "true")
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

        <form ref={formRef} onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto no-scrollbar pb-6">
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
            
            <div className="flex flex-col gap-1">
              <div className="border-l-4 border-[#0b4b4b] rounded">
                <SearchableSelect 
                  options={categories}
                  value={categorySelection}
                  onChange={(val) => {
                    setCategorySelection(val)
                    setShowOtherCategory(val === 'Others')
                  }}
                  placeholder="Select Category :"
                  triggerStyle={{
                    borderRadius: '0 0.25rem 0.25rem 0', 
                    height: '2.25rem',
                    backgroundColor: 'white',
                    border: 'none',
                    paddingLeft: '0.75rem',
                    paddingRight: '0.75rem'
                  }}
                />
              </div>
              {showOtherCategory && (
                <input 
                  name="otherCategory" 
                  required 
                  className="h-9 px-3 rounded bg-white outline-none border-l-4 border-red-500" 
                  placeholder="Enter Category Name :" 
                />
              )}
            </div>

            <input name="mobile" required className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="Contact No. :" />
            
            <input name="officeNo" className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="Office / Shop No. :" />

            <input 
              name="pincode" 
              maxLength={6}
              value={pincode}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '');
                setPincode(val);
                if (val.length === 6) {
                  fetch(`https://api.postalpincode.in/pincode/${val}`)
                    .then(res => res.json())
                    .then(data => {
                      if (data[0].Status === "Success") {
                        const post = data[0].PostOffice[0];
                        setCity(post.District);
                        setState(post.State);
                        setAreaValue(post.Name);
                      }
                    });
                }
              }}
              className="h-9 px-3 rounded bg-white outline-none border-l-4 border-blue-500" 
              placeholder="Pincode : (Auto-fills Area/City/State)" 
            />

            <input 
              name="area" 
              required 
              value={areaValue}
              onChange={(e) => setAreaValue(e.target.value)}
              className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" 
              placeholder="Area / Locality :" 
            />

            <textarea
              name="address"
              required
              className="h-16 px-3 py-2 rounded bg-white outline-none resize-none border-l-4 border-[#0b4b4b]"
              placeholder="Full Office Address :"
            />

            <div className="grid grid-cols-2 gap-2">
              <input 
                name="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]"
                placeholder="City :"
              />

              <input 
                name="state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]"
                placeholder="State :"
              />
            </div>

            <input name="emailWebsite" className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b]" placeholder="email / website :" />
          </div>


          {/* PDF + Call Section */}
          <div className="flex items-center gap-3 mt-3 px-8">

            {/* PDF Download Button */}
            <div 
              onClick={handleDownloadPDF}
              className="relative flex flex-col items-center justify-center bg-white border-2 border-red-400 rounded-md w-[65px] h-[80px] cursor-pointer"
            >
              <FaFilePdf className="text-red-600 text-xl" />
              <span className="text-[10px] font-semibold mt-1 text-center truncate w-full px-1">
                PDF
              </span>
            </div>

            {/* Text */}
            <p className="text-[11px] text-gray-800 italic leading-tight flex-1">
              download pdf form fill and submit to Surat East Builder Association and
              use contact button for <b>SEBA</b> inquiry.
            </p>

            {/* Call Button */}
            <a 
              href="tel:1111111111"
              className="flex items-star bg-[#e5e5e5] rounded-lg px-1 py-1 shadow-sm border border-gray-300 border-t-2 border-t-black h-[48px] no-underline"
            >
              <HiOutlinePhone className="text-3xl text-green-600 mt-1" />
              <span className="text-[11px] mt-[8px] font-medium text-gray-700 leading-none ml-1">
                Call
              </span>
            </a>
          </div>

          {/* Submit */}
          <button disabled={loading} type="submit" className="mt-3 bg-[#6b3e2e] text-white py-2 rounded-md text-sm w-[140px] mx-auto disabled:opacity-50">
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

          <div className="bg-[#003d3d] mt-auto -mx-5 px-6 py-3 flex justify-between items-center text-white">

          <div onClick={() => router.push('/home')} className="flex flex-col items-center cursor-pointer opacity-90 hover:opacity-100">
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