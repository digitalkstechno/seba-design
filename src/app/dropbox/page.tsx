'use client'

import { FC, useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { IoIosArrowBack } from "react-icons/io"
import { FaPlus, FaTimes } from "react-icons/fa"
import Footer from "@/components/Footer"
import api from "@/lib/axios"
import { getCookie } from "@/lib/cookies"
import { useAlert } from "@/context/AlertContext"

const DropboxPage: FC = () => {
  const router = useRouter()
  const { showAlert } = useAlert()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [loading, setLoading] = useState(false)
  const [members, setMembers] = useState<any[]>([])
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    message: ""
  })

  // Restrict access and fetch active members list
  useEffect(() => {
    const token = getCookie("seba_token")
    if (!token) {
      router.push("/home?restricted=true")
      return
    }

    const fetchSebaMembers = async () => {
      try {
        const { data } = await api.get('/seba/member?status=active')
        if (data.status === 'Success') {
          setMembers(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch members list:", err)
      }
    }
    
    fetchSebaMembers()
  }, [router])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    setImages((prev) => {
      const combined = [...prev, ...files].slice(0, 5)
      const newPreviews = combined.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
      return combined
    })
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form.name || !form.mobile || !form.message) {
      showAlert("Please fill Name, Mobile and Message")
      return
    }

    // Resolve builderId based on entered mobile number
    const cleanTypedMobile = form.mobile.replace(/\D/g, "").slice(-10)
    const matchingMember = members.find((item: any) => {
      const cleanItemMobile = item.mobile ? item.mobile.replace(/\D/g, "").slice(-10) : ""
      return cleanItemMobile === cleanTypedMobile
    })

    if (!matchingMember || !matchingMember.cardId) {
      showAlert("No active card profile found for this mobile number. Please check your registered number.")
      return
    }

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("builderId", matchingMember.cardId)
      formData.append("cardType", matchingMember.company || matchingMember.name)
      formData.append("name", form.name)
      formData.append("number", form.mobile)
      formData.append("email", form.email)
      formData.append("companyName", matchingMember.company || matchingMember.name)
      formData.append("message", form.message)

      images.forEach((image) => {
        formData.append("images", image)
      })

      const { data } = await api.post('/dropbox', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.status === 'Success') {
        showAlert("Request submitted to Dropbox successfully!")
        setForm({
          name: "",
          mobile: "",
          email: "",
          message: ""
        })
        setImages([])
        setPreviews([])
      } else {
        showAlert(data.message || "Failed to submit request")
      }
    } catch (err: any) {
      console.error(err)
      showAlert(err.response?.data?.message || "Failed to submit request")
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
              onClick={() => router.push('/home')}
              className="text-xl cursor-pointer"
            />
            <p className="text-[14px] italic">
              Welcome to <span className="font-semibold">SEBA</span> Dropbox
            </p>
          </div>
        </div>

        {/* Logo Section */}
        <div className="mt-3">
          <img src="/images/logo.png" alt="SEBA Logo" className="w-24" />
          <p className="text-sm mt-1 text-gray-700">
            Request profile / card updates
          </p>
          <p className="text-[#0b4b4b] font-semibold text-md mt-1">
            Fill and Submit
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-y-auto pb-32 no-scrollbar mt-3">
          <div className="flex flex-col gap-3 text-[13px]">
            {/* Name */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-700 ml-1">Name :</span>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b] shadow-sm text-gray-800 font-medium"
                placeholder="Enter your name"
              />
            </div>

            {/* Mobile */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-700 ml-1">Mobile :</span>
              <input
                required
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b] shadow-sm text-gray-800 font-medium"
                placeholder="Enter mobile number"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-700 ml-1">Email :</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="h-9 px-3 rounded bg-white outline-none border-l-4 border-[#0b4b4b] shadow-sm text-gray-800 font-medium"
                placeholder="Enter email address"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-bold text-gray-700 ml-1">Message :</span>
              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value.slice(0, 2000) })}
                className="h-24 px-3 py-2 rounded bg-white outline-none resize-none border-l-4 border-[#0b4b4b] shadow-sm text-gray-800 font-medium"
                placeholder="Enter your message details"
                maxLength={2000}
              />
              <div className="text-right text-[10px] text-gray-400 font-bold pr-2">
                {form.message.length} / 2000
              </div>
            </div>

            {/* Upload Images */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-bold text-gray-700 ml-1">
                Upload New Images
              </p>
              <div className="grid grid-cols-3 gap-3 pt-1">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative aspect-square w-full rounded-lg border-2 border-white shadow-sm overflow-hidden bg-gray-100 group"
                  >
                    <img
                      src={preview}
                      className="w-full h-full object-cover"
                      alt={`preview-${index}`}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                    >
                      <FaTimes size={10} />
                    </button>
                  </div>
                ))}
                {previews.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-white/50 hover:bg-white transition-all hover:scale-105"
                  >
                    <FaPlus
                      size={24}
                      className="text-[#0b4b4b]"
                    />
                  </button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={loading}
            type="submit"
            className="mt-6 bg-[#6b3e2e] text-white py-2.5 rounded-md text-sm w-[140px] mx-auto disabled:opacity-50 hover:opacity-95 active:scale-95 transition-all shadow-sm font-semibold"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>

        <Footer />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}

export default DropboxPage
