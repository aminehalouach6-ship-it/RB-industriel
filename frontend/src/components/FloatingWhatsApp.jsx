import React, { useState } from 'react';
import { MessageCircle, X, PhoneCall } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

export default function FloatingWhatsApp() {
  const [isOpen, setIsOpen] = useState(false);
  const { company } = useCompany();

  const phoneClean = (company.whatsapp_phone || '212700950064').replace(/[^0-9]/g, '').replace(/^0/, '212');
  const mgr = company.manager_name || 'Rachid BOUZAYD';
  const cName = company.company_name || 'RB INDUSTRIEL';
  const waUrl = `https://wa.me/${phoneClean}?text=Bonjour%20M.%20${encodeURIComponent(mgr)},%20je%20vous%20contacte%20depuis%20votre%20site%20${encodeURIComponent(cName)}.`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Tooltip / Popup message */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in text-xs">
          <div className="bg-[#0D3823] p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img 
                src={company.logo_url || "/logo_rb_industriale.png"} 
                alt={cName} 
                className="w-8 h-8 rounded-full object-cover shadow-sm border border-emerald-400/40" 
              />
              <div>
                <h4 className="font-bold text-white text-xs">{mgr}</h4>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>En ligne • {cName}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 space-y-2 bg-slate-50 text-slate-700">
            <p className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm leading-relaxed">
              Bonjour ! Vous avez besoin de bouteilles d'oxygène, argon, ou d'un devis pour un poste à souder ?
            </p>
            
            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="block w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center rounded-xl text-xs transition shadow-sm"
            >
              Démarrer la discussion WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl transition duration-300 hover:scale-105"
        aria-label="Contacter sur WhatsApp"
      >
        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-white animate-pulse"></span>
        <MessageCircle className="w-7 h-7 fill-current" />
      </button>

    </div>
  );
}
