import React, { useEffect } from 'react';
import { X, Phone, Mail, MapPin, MessageCircle, ExternalLink } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

export default function FlyerShowcaseModal({ isOpen, onClose }) {
  const { company } = useCompany();

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

  const phoneClean = (company.whatsapp_phone || '212700950064').replace(/[^0-9]/g, '').replace(/^0/, '212');
  const mgr = company.manager_name || 'Rachid BOUZAYD';
  const cName = company.company_name || 'RB INDUSTRIEL';

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
                Informations &amp; Carte Officielle • {cName}
              </h3>
              <p className="text-[11px] text-[#637067]">
                {company.tagline || "Gaz Industriels & Matériel de Soudage — Tit Mellil, Casablanca"}
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
              src={company.flyer_url || "/carte_officielle_tenira.png"} 
              alt={`Informations officielles et carte de visite ${cName}`} 
              className="w-full h-auto object-contain rounded-xl shadow-inner max-h-[62vh]"
            />
            {/* 4K Badge & Fullscreen link */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-md bg-[#0D3823]/90 backdrop-blur-md text-white font-black text-[10px] tracking-wider shadow-sm">
                4K ULTRA HD
              </span>
              <a 
                href={company.flyer_4k_url || "/carte_officielle_tenira_4k.png"} 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-md bg-white/90 backdrop-blur-md text-[#141E18] hover:bg-white text-xs font-bold shadow-sm transition hover:scale-105"
                title="Afficher en plein écran 4K (3840px)"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Contact Bar directly under the flyer */}
          <div className="p-4 bg-slate-50 border-t border-[#E8E1D5] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="hidden sm:block">
              <span className="text-[10px] uppercase font-bold text-[#637067] tracking-wider block">Gérant Direct</span>
              <span className="text-xs font-black text-[#141E18]">M. {mgr}</span>
            </div>

            <div className="grid grid-cols-2 sm:flex items-center gap-2">
              <a 
                href={`tel:${(company.phone_main || '0700950064').replace(/[^0-9]/g, '')}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>{company.phone_main || "07 00 95 00 64"}</span>
              </a>

              <a 
                href={`https://wa.me/${phoneClean}?text=Bonjour%20M.%20${encodeURIComponent(mgr)},%20je%20vous%20contacte%20depuis%20la%20fiche%20d%27informations%20${encodeURIComponent(cName)}.`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Direct</span>
              </a>

              <a 
                href={`tel:${(company.phone_fixed || '0522354868').replace(/[^0-9]/g, '')}`}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#0D3823] text-[#141E18] font-bold text-xs shadow-xs transition hover:-translate-y-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-[#0D3823]" />
                <span>{company.phone_fixed || "05 22 35 48 68"}</span>
              </a>
            </div>
          </div>

          {/* Official address footnote */}
          <div className="flex items-center justify-between text-[11px] text-[#637067] bg-white/70 p-3 rounded-xl border border-[#E8E1D5]">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#0D3823] shrink-0" />
              <span>{company.address || "Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc"}</span>
            </div>
            <span className="hidden sm:inline font-bold text-[#0D3823]">Gérant : {mgr}</span>
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
