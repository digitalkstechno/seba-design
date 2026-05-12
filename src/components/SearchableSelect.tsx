"use client";

import { useState, useRef, useEffect } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";

type Option = {
  id?: string;
  name: string;
  isSub?: boolean;
  parentCategory?: string;
};

type Props = {
  options: Option[];
  value: string;
  onChange: (val: string, opt?: Option) => void;
  placeholder?: string;
  className?: string;
  showOthers?: boolean;
  triggerStyle?: React.CSSProperties;
  customIcon?: React.ReactNode;
};

const SearchableSelect = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select...", 
  className = "", 
  showOthers = true,
  triggerStyle,
  customIcon
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayValue = value || placeholder;

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`h-9 px-4 flex items-center justify-between cursor-pointer transition-all ${!triggerStyle ? "rounded-full bg-white border-transparent shadow-sm hover:border-gray-300" : ""}`}
        style={triggerStyle}
      >
        <span className={`truncate text-sm font-medium ${!value || value === placeholder ? "text-gray-400" : "text-gray-700"}`}>
          {displayValue}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}>
          {customIcon ? (
             customIcon
          ) : (
            <IoCaretDownOutline className="text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <FiSearch className="text-indigo-500 shrink-0" size={16} />
            <input
              autoFocus
              type="text"
              className="w-full bg-transparent outline-none text-sm py-1 font-medium text-gray-700"
              placeholder="Type to filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="max-h-[200px] overflow-y-auto no-scrollbar py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    onChange(opt.name, opt);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                  className={`px-5 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between group ${opt.isSub ? "pl-9 text-indigo-600 hover:bg-indigo-50/60 font-medium" : "text-gray-800 hover:bg-gray-50 font-bold border-t border-gray-50/50 first:border-t-0"}`}
                >
                  <span className="flex items-center gap-1.5 truncate">
                    {opt.isSub && <span className="text-indigo-400 select-none">↳</span>}
                    {opt.name}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                </div>
              ))
            ) : (
              <div className="px-4 py-6 text-sm text-gray-400 italic text-center">No results found</div>
            )}

            {showOthers && !filteredOptions.some(o => o.name === 'Others') && (
              <div
                onClick={() => {
                  onChange("Others");
                  setIsOpen(false);
                  setSearchTerm("");
                }}
                className="px-5 py-3 text-sm font-extrabold text-indigo-600 hover:bg-indigo-50 cursor-pointer border-t border-gray-50 transition-colors bg-indigo-50/30"
              >
                + Others (Add New)
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
