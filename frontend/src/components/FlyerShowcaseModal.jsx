import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

export default function FlyerShowcaseModal({ isOpen, onClose }) {
  // Close on Escape key press
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/75 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-[#FAF7F2] border border-[#E8E1D5] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E8E1D5] bg-white">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D3823] animate-pulse"></span>
            <div>
              <h3 className="font-extrabold text-[#141E18] text-sm sm:text-base tracking-tight">
                Informations &amp; Carte Officielle • TENIRA TRAVAUX
              </h3>
              <p className="text-[11px] text-[#637067]">
                Gaz Industriels &amp; Matériel de Soudage — Tit Mellil, Casablanca
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-[#637067] hover:text-[#141E18] hover:bg-[#F4EFE7] transition cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Focus on the official photo context */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          
          {/* Official photo centerpiece (4K Ultra HD) */}
          <div className="relative group rounded-2xl overflow-hidden border border-[#E8E1D5] bg-white shadow-md">
            <img 
              src="/carte_officielle_tenira.png" 
              alt="Informations officielles et carte de visite TENIRA TRAVAUX" 
              className="w-full h-auto object-contain block"
            />
            {/* 4K Badge & Fullscreen link */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-[#0D3823]/90 backdrop-blur-md text-white font-black text-[10px] tracking-wider shadow-sm">
                4K ULTRA HD
              </span>
              <a 
                href="/carte_officielle_tenira_4k.png" 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-md bg-white/90 backdrop-blur-md text-[#141E18] hover:bg-white text-xs font-bold shadow-sm transition hover:scale-105"
                title="Afficher en plein écran 4K (3840px)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct action buttons matching the photo details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            <a 
              href="tel:0661490495"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>06 61 49 04 95</span>
            </a>

            <a 
              href="https://wa.me/212661490495?text=Bonjour%20M.%20BOUZAYD,%20je%20vous%20contacte%20depuis%20la%20fiche%20d%27informations%20TENIRA%20TRAVAUX."
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp Direct</span>
            </a>

            <a 
              href="tel:0522354868"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#0D3823] text-[#141E18] font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#0D3823]" />
              <span>05 22 35 48 68</span>
            </a>

            <a 
              href="mailto:teniratravaux@gmail.com"
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#0D3823] text-[#141E18] font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#C3643B]" />
              <span className="truncate">Email</span>
            </a>
          </div>

          {/* Official address footnote */}
          <div className="flex items-center justify-between text-[11px] text-[#637067] bg-white/70 p-3 rounded-xl border border-[#E8E1D5]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0D3823] shrink-0" />
              <span>Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc</span>
            </div>
            <span className="hidden sm:inline font-bold text-[#0D3823]">Gérant : Rachid BOUZAYD</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#E8E1D5] bg-white flex items-center justify-between text-xs">
          <span className="text-[#8C9890] text-[11px]">
            Livraison rapide &amp; sécurisée Tit Mellil &amp; tout le Maroc
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#FAF7F2] hover:bg-[#E8E1D5] text-[#141E18] font-bold text-xs border border-[#E8E1D5] transition cursor-pointer"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
