'use client'

import { FC } from 'react'

interface CustomAlertProps {
  message: string
  onClose: () => void
}

const CustomAlert: FC<CustomAlertProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1a1a1a] border border-gray-700 w-full max-w-[320px] rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-[#0b4b4b]/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#0b4b4b]/30">
            <span className="text-[#0b4b4b] text-2xl font-bold">!</span>
          </div>
          <h3 className="text-white text-lg font-bold mb-2 uppercase tracking-tight">Notification</h3>
          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            {message}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-[#0b4b4b] text-white py-3 rounded-2xl font-black uppercase tracking-widest hover:bg-[#083737] active:scale-[0.98] transition-all shadow-lg shadow-[#0b4b4b]/20"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  )
}

export default CustomAlert
