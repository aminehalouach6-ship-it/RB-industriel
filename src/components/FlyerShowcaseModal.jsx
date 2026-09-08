import React from 'react';
import { X, Phone, Mail, MapPin, CheckCircle, ExternalLink } from 'lucide-react';

export default function FlyerShowcaseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <h3 className="font-bold text-white text-base">
              Affiche Officielle de Référence - TENIRA TRAVAUX
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            
            {/* Image on left */}
            <div className="md:col-span-7 bg-black rounded-xl overflow-hidden border border-slate-800 shadow-inner">
              <img 
                src="/flyer_tenira_travaux.png" 
                alt="Flyer TENIRA TRAVAUX" 
                className="w-full h-auto object-contain"
              />
            </div>

            {/* Extracted Information checklist on right */}
            <div className="md:col-span-5 space-y-4 text-xs text-slate-300">
              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
                <h4 className="font-bold text-emerald-400 text-sm mb-2 uppercase tracking-wide">
                  Données Officielles Intégrées
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Société :</strong> TENIRA TRAVAUX</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Activité :</strong> Gaz Industriels &amp; Matériel de Soudage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Services :</strong> Vente • Distribution • Livraison</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>Gérant :</strong> Rachid BOUZAYD</span>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wide">
                  Lignes Téléphoniques GSM &amp; Fixe
                </h4>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  <a href="tel:0661490495" className="p-1.5 bg-slate-900 rounded text-emerald-300 hover:text-white">06 61 49 04 95</a>
                  <a href="tel:0700950064" className="p-1.5 bg-slate-900 rounded text-emerald-300 hover:text-white">07 00 95 00 64</a>
                  <a href="tel:0690907488" className="p-1.5 bg-slate-900 rounded text-emerald-300 hover:text-white">06 90 90 74 88</a>
                  <a href="tel:0695958627" className="p-1.5 bg-slate-900 rounded text-emerald-300 hover:text-white">06 95 95 86 27</a>
                </div>
                <div className="pt-1">
                  <a href="tel:0522354868" className="block text-center p-1.5 bg-slate-900 rounded text-slate-300 hover:text-white font-mono">
                    Fixe : 05 22 35 48 68
                  </a>
                </div>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 text-slate-200">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-mono">teniratravaux@gmail.com</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition"
          >
            Fermer l'aperçu
          </button>
        </div>

      </div>
    </div>
  );
}
