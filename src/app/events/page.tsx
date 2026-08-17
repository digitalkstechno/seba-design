'use client'

import { FC, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { IoIosArrowBack } from "react-icons/io"
import Footer from "@/components/Footer"
import { FaChevronRight, FaPlus } from "react-icons/fa"

import { getCookie, setCookie, deleteCookie } from "@/lib/cookies"
import { cleanPhoneNumber } from "@/lib/phoneUtils"

type EventType = {
  _id: string
  title: string
  subtitle?: string
  dateText?: string
  image?: string
}

type EventMessageType = {
  _id: string
  eventId?: string
  userMobile?: string
  userName?: string
  message: string
  image?: string
  createdAt?: string
}

const EventsPage: FC = () => {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [events, setEvents] = useState<EventType[]>([])
  const [eventMessages, setEventMessages] = useState<EventMessageType[]>([])

  // Views & Modals
  const [showAddForm, setShowAddForm] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordInput, setPasswordInput] = useState("")
  const [passwordError, setPasswordError] = useState("")

  // Form inputs
  const [message, setMessage] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [authChecking, setAuthChecking] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)

  const fetchEventsAndMessages = async () => {
    setLoading(true)
    try {
      const [evRes, msgRes] = await Promise.all([
        api.get('/seba/event').catch(() => ({ data: { status: 'Failed', data: [] } })),
        api.get('/seba/event/messages').catch(() => ({ data: { status: 'Failed', data: [] } }))
      ])

      if (evRes.data?.status === 'Success') {
        setEvents(evRes.data.data || [])
      }
      if (msgRes.data?.status === 'Success') {
        setEventMessages(msgRes.data.data || [])
      }
    } catch (err) {
      console.error("Failed to fetch events or messages", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const checkAuthAndFetch = async () => {
      let token = getCookie("seba_token");
      if (!token) {
        const mob = getCookie("seba_user_mobile");
        const name = getCookie("seba_user_name");
        if (mob) {
          try {
            const cleanMob = cleanPhoneNumber(mob);
            const { data } = await api.post("/seba/user/login", { name: name || "", mobile: cleanMob });
            if (data.status === "Success" && data.data?.token) {
              setCookie("seba_token", data.data.token);
              deleteCookie("seba_user_is_inactive");
              token = data.data.token;
            }
          } catch (err: any) {
            if (err.response?.data?.message?.toLowerCase().includes("inactive")) {
              setCookie("seba_user_is_inactive", "true");
            }
          }
        }
      }

      if (!token) {
        router.replace("/home?restricted=true");
        return;
      }

      setIsAuthorized(true);
      setAuthChecking(false);

      fetchEventsAndMessages();
    };

    checkAuthAndFetch();
  }, [router]);

  if (authChecking || !isAuthorized) {
    return (
      <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
        <div className="w-full max-w-[420px] h-[100vh] bg-[#f8f9fa] relative px-4 pt-4 shadow-2xl flex flex-col items-center justify-center border border-gray-200">
          <p className="text-gray-400 italic text-sm">Verifying membership...</p>
        </div>
      </div>
    );
  }

  const handlePasswordVerify = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordInput === "1234") {
      setShowPasswordModal(false)
      setPasswordInput("")
      setPasswordError("")
      setShowAddForm(true)
    } else {
      setPasswordError("Incorrect password!")
    }
  }

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

      const mob = getCookie("seba_user_mobile")
      const name = getCookie("seba_user_name")
      if (mob) formData.append('userMobile', mob)
      if (name) formData.append('userName', name)

      if (imageFile) formData.append('image', imageFile)

      const { data } = await api.post('/seba/event/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (data.status === 'Success') {
        setSuccessMsg("Event added successfully!")
        setMessage("")
        setImageFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        await fetchEventsAndMessages()
        setTimeout(() => {
          setShowAddForm(false)
          setSuccessMsg("")
        }, 1200)
      }
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Failed to send message")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-[100vh] bg-[#d9d9d9] flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-[420px] h-[100vh] bg-[#f8f9fa] relative px-4 pt-4 shadow-2xl flex flex-col overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <IoIosArrowBack
              onClick={() => {
                if (showAddForm) {
                  setShowAddForm(false)
                } else {
                  router.push('/home')
                }
              }}
              className="text-xl cursor-pointer text-gray-800 hover:text-black transition-colors"
            />
            <p className="text-[14.5px] italic text-gray-800 font-normal">
              {showAddForm ? (
                <>What is next <span className="font-bold not-italic">SEBA message ?</span></>
              ) : (
                <><span className="font-bold not-italic">SEBA Events</span> List</>
              )}
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

        {/* VIEW 1: EVENTS LIST & MESSAGES LIST (DEFAULT) */}
        {!showAddForm ? (
          <div className="flex-1 overflow-y-auto space-y-4 my-2 pb-[80px] pr-1 no-scrollbar">

            {/* Section Heading */}
            <div className="text-center">
              <p className="text-[13.5px] font-bold italic text-gray-800 tracking-wide underline underline-offset-4 decoration-gray-400">
                Upcoming events information
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center py-10">
                <p className="text-gray-400 italic text-sm">Loading events...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 1. Official Events Banners */}
                {events.length > 0 && (
                  <div className="space-y-3">
                    {events.map((ev) => (
                      <div key={ev._id} className="bg-[#e4df8f] border border-yellow-300 rounded-xl p-3.5 shadow-sm text-gray-900">
                        <p className="text-[13px] font-bold text-gray-800 mb-1">
                          {ev.title}
                        </p>
                        {ev.image && (
                          <div className="w-full my-2 overflow-hidden rounded-lg border border-yellow-400/50 shadow-xs">
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${ev.image}`}
                              alt={ev.title}
                              className="w-full h-auto max-h-[160px] object-cover"
                            />
                          </div>
                        )}
                        {ev.subtitle && (
                          <p className="text-[11.5px] font-semibold text-gray-800 italic mt-1 leading-tight">
                            {ev.subtitle}
                          </p>
                        )}
                        {ev.dateText && (
                          <p className="text-[11px] font-bold text-gray-900 mt-1">
                            {ev.dateText}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. Posted Event Messages */}
                {eventMessages.length > 0 ? (
                  <div className="space-y-4 pt-2">
                  
                    {eventMessages.map((msg) => (
                      <div key={msg._id} className="space-y-1.5 pb-2">
                        {msg.createdAt && (
                          <div className="flex justify-end pr-1">
                            <span className="text-[10px] text-gray-400 font-medium">
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}

                        {/* Photo on TOP */}
                        {msg.image && (
                          <div className="w-full overflow-hidden shadow-xs">
                            <img
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/builder/${msg.image}`}
                              alt="Event attachment"
                              className="w-full max-h-[400px]  block"
                            />
                          </div>
                        )}

                        {/* Text message BELOW photo */}
                        {msg.message && (
                          <p className="text-[12.5px] text-gray-800 leading-relaxed font-semibold px-1">
                            {msg.message}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  events.length === 0 && (
                    <div className="flex justify-center py-10 text-center">
                      <p className="text-gray-400 italic text-sm">No events or messages available yet.</p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Floating Plus (+) Button (Bottom Right) */}
            <button
              onClick={() => {
                setPasswordError("")
                setPasswordInput("")
                setShowPasswordModal(true)
              }}
              title="Add New Event"
              className="absolute right-5 bottom-20 z-30 w-12 h-12 rounded-full bg-[#0094d4] text-white shadow-xl flex items-center justify-center hover:bg-[#0082bc] active:scale-95 transition-all border-2 border-white cursor-pointer"
            >
              <FaPlus className="text-lg" />
            </button>
          </div>
        ) : (

          /* VIEW 2: ADD EVENT MESSAGE FORM */
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col space-y-3.5 flex-1 overflow-y-auto pb-[80px] pr-1 no-scrollbar">

            <div className="text-center my-1">
              <p className="text-[13px] font-bold italic text-gray-800 tracking-wide underline underline-offset-4 decoration-gray-400">
                Upcoming events information
              </p>
            </div>

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

            {/* Add Image Field */}
            <div className="flex flex-col space-y-1">
              <label className="text-[12.5px] italic font-semibold text-gray-800 block">
                Add Image :
              </label>
              <div className="w-[120px] h-[130px] border-2 border-blue-400 rounded-xl bg-[#eeeeee] shadow-sm flex flex-col items-center justify-center text-center text-[12px] overflow-hidden relative cursor-pointer">
                {imageFile ? (
                  <img
                    src={URL.createObjectURL(imageFile)}
                    alt="Selected Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <p className="text-gray-800 font-medium">Your</p>
                    <p className="text-gray-800 font-medium">Passport</p>
                    <p className="text-gray-800 font-medium">Size Photo</p>
                    <p className="text-red-500 text-[11px] font-semibold mt-1">
                      Click & attach
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
              </div>

              {imageFile && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 truncate max-w-[220px]">
                    {imageFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setImageFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 font-medium italic px-1">{errorMsg}</p>
            )}
            {successMsg && (
              <p className="text-xs text-green-600 font-medium italic px-1">{successMsg}</p>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-2 pb-4">
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
        )}

        {/* PASSWORD PROTECTION MODAL */}
        {showPasswordModal && (
          <div className="absolute inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-[320px] rounded-2xl p-5 shadow-2xl border border-gray-200 flex flex-col space-y-4 animate-in fade-in zoom-in-95 duration-200">
              
              <div className="text-center">
                <h3 className="font-bold text-gray-900 text-base">Enter Password</h3>
                <p className="text-xs text-gray-500 mt-1">Please enter password to add event</p>
              </div>

              <form onSubmit={handlePasswordVerify} className="space-y-3">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-2.5 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-[#0094d4] focus:border-transparent text-center font-bold tracking-widest"
                />

                {passwordError && (
                  <p className="text-xs text-red-500 font-semibold text-center">{passwordError}</p>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 text-xs font-bold text-white bg-[#0094d4] hover:bg-[#0082bc] rounded-xl shadow-md cursor-pointer"
                  >
                    Unlock & Add
                  </button>
                </div>
              </form>

            </div>
          </div>
        )}

        <Footer />

      </div>
    </div>
  )
}

export default EventsPage
