'use client';

import { useState, useRef, useEffect } from 'react';
import { Languages, ChevronDown, Check } from 'lucide-react';
import { LanguageOptions, LanguageCode } from '../lib/i18n';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { lang, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = LanguageOptions.find((l) => l.code === lang) || LanguageOptions[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left z-[100]">
      {/* LANGUAGE SELECTOR TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border-2 border-amber-400/60 px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-md active:scale-95 min-h-[44px]"
        title="Switch Language / भाषा चुनें"
      >
        <Languages className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-extrabold whitespace-nowrap">{currentOption.flag} {currentOption.nativeName} ({currentOption.code})</span>
        <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* DROPDOWN MENU OVERLAY */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-slate-950 border-2 border-amber-400 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.9)] py-2 z-[100] overflow-hidden backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 text-[10px] font-black text-amber-400 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
            <span>भाषा चुनें (7 LANGUAGES)</span>
            <Languages className="w-3 h-3 text-amber-400" />
          </div>

          <div className="max-h-64 overflow-y-auto py-1">
            {LanguageOptions.map((opt) => {
              const isSelected = lang === opt.code;
              return (
                <button
                  key={opt.code}
                  onClick={() => {
                    setLanguage(opt.code);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-3 text-xs flex items-center justify-between transition-colors min-h-[44px] ${
                    isSelected
                      ? 'bg-[#A00000] text-white font-black'
                      : 'text-slate-200 hover:bg-slate-900 hover:text-amber-300 font-bold'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm">{opt.flag}</span>
                    <span className="font-display">{opt.nativeName}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isSelected ? 'bg-amber-400 text-slate-950' : 'text-slate-400 bg-slate-900'}`}>
                      {opt.code}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
