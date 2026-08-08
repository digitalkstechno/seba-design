'use client'

import { FC, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { IoIosArrowBack } from "react-icons/io"
import Footer from "@/components/Footer"
import { FaChevronRight } from "react-icons/fa"

type EventType = {
  _id: string
  title: string
  subtitle?: string
  dateText?: string
  image?: string
}

const EventsPage: FC = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [events, setEvents] = useState<EventType[]>([])
  const [message, setMessage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/seba/event')
        if (data.status === 'Success') {
          setEvents(data.data)
        }
      } catch (err) {
        console.error("Failed to fetch events", err)
      } finally {
        setLoading(false)
      }
    }
    fetchEvents()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      setErrorMsg("Please enter a text message")
      return
    }

    setSubmitting(true)
    setSuccessMsg("")
    setErrorMsg("")

    try {
      const activeEventId = events[0]?._id || null
      const formData = new FormData()
      if (activeEventId) formData.append('eventId', activeEventId)
      formData.append('message', message.trim())
      if (imageFile) formData.append('image', imageFile)

      const { data } = await api.post('/seba/event/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.status === 'Success') {
        setSuccessMsg("Message sent successfully!")
        setMessage("")
        setImageFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  const activeEvent = events[0]

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-[100vh] bg-[#f8f9fa] relative px-4 pt-4 shadow-2xl flex flex-col overflow-y-auto pb-[75px] scrollbar-none border border-gray-200">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => router.push('/home')}
              className="text-xl cursor-pointer text-gray-800 hover:text-black transition-colors"
            />
            <p className="text-[14.5px] italic text-gray-800 font-normal">
              What is next <span className="font-bold not-italic">SEBA message ?</span>
            </p>
          </div>

          {/* Profile Events Badge */}
          <div className="absolute right-4 top-2 z-20">
            <div className="relative w-[70px] h-[70px] flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-[#facc15] blur-[12px] opacity-40" />
              <div className="relative z-10 w-[60px] h-[60px] rounded-full bg-[#0a192f] border-2 border-yellow-400 flex flex-col items-center justify-center text-white shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18" />
                  <path d="M5 21V10l4-3v14" />
                  <path d="M9 21V12l4-1v10" />
                  <path d="M13 21V5l6 3v13" />
                </svg>
                <span className="text-[8.5px] font-bold tracking-wider text-yellow-400 uppercase mt-0.5">EVENTS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center my-2">
          <p className="text-[13px] font-bold italic text-gray-800 tracking-wide underline underline-offset-4 decoration-gray-400">
            Upcoming events information
          </p>
        </div>

        {/* Event Banner Card (Only shown if activeEvent exists) */}
        {activeEvent && (
          <div className="my-3">
            <div className="bg-[#e4df8f] border border-yellow-300 rounded-xl p-3.5 shadow-sm text-gray-900 relative">
              <p className="text-[12px] font-bold text-gray-800 mb-1">
                {activeEvent.title}
              </p>
              {activeEvent.image ? (
                <div className="w-full my-2 overflow-hidden rounded-lg border border-yellow-400/50 shadow-xs">
                  <img
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${activeEvent.image}`}
                    alt={activeEvent.title}
                    className="w-full h-auto max-h-[160px] object-cover"
                  />
                </div>
              ) : null}
              {activeEvent.subtitle && (
                <p className="text-[11px] font-semibold text-gray-800 italic mt-1 leading-tight">
                  {activeEvent.subtitle}
                </p>
              )}
              {activeEvent.dateText && (
                <p className="text-[11px] font-bold text-gray-900 mt-1">
                  {activeEvent.dateText}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Text Message Form Area */}
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-3.5">
          <div className="flex flex-col space-y-1">
            <label className="text-[12.5px] italic font-semibold text-gray-800 block">
              Text message :
            </label>
            <textarea
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your text message here..."
              className="w-full bg-white border border-gray-300 rounded-2xl p-3.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-inner resize-none"
            />
          </div>

          {/* Choose Image Field */}
          <div className="flex flex-col space-y-1">
            <label className="text-[12.5px] italic font-semibold text-gray-800 block">
              Choose Image :
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="w-full bg-white border border-gray-300 rounded-xl px-3 py-2 text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"
            />
          </div>

          {errorMsg && (
            <p className="text-xs text-red-600 font-medium italic px-1">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-xs text-green-600 font-medium italic px-1">{successMsg}</p>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#0094d4] hover:bg-[#0082bc] active:scale-98 text-white font-bold text-[13.5px] py-2 px-8 rounded-full shadow-md flex items-center gap-2 cursor-pointer transition-transform disabled:opacity-50"
            >
              <span>{submitting ? "SUBMITTING..." : "SUBMIT"}</span>
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <FaChevronRight className="text-white text-[10px]" />
              </div>
            </button>
          </div>
        </form>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  )
}

export default EventsPage
