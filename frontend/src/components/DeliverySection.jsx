import React from 'react';
import { 
  Truck, 
  CheckCircle2, 
  PhoneCall,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

export default function DeliverySection() {
  const { company } = useCompany();
  return (
    <section id="livraison" className="py-16 bg-[#FAF7F2] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#0D3823]"></span>
            <span className="text-[11px] font-bold text-[#637067] uppercase tracking-widest">
              LIVRAISON &amp; FLOTTE SÉCURISÉE
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141E18] tracking-tight">
            Zones d'Approvisionnement
          </h2>
          <p className="text-xs sm:text-sm text-[#637067] max-w-xl">
            Tournées régulières au départ de notre dépôt à Tit Mellil pour ateliers, usines et chantiers.
          </p>
        </div>

        {/* 3 Clean Minimalist Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-2xl p-6 border border-[#E8E1D5] space-y-3 shadow-xs">
            <span className="font-serif text-2xl font-bold text-[#0D3823]">01</span>
            <h3 className="font-bold text-base text-[#141E18]">Tit Mellil &amp; Environs</h3>
            <p className="text-xs text-[#637067] leading-relaxed">
              Livraison prioritaire sous <strong>2 heures</strong> ou retrait instantané au dépôt Hay Amal 1. Échange standard bouteille vide contre pleine.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-bold text-[#134D2E] bg-[#EBF4EE] px-2.5 py-1 rounded-full">
                Livraison Gratuite
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E1D5] space-y-3 shadow-xs">
            <span className="font-serif text-2xl font-bold text-[#C3643B]">02</span>
            <h3 className="font-bold text-base text-[#141E18]">Grand Casablanca &amp; Mohammedia</h3>
            <p className="text-xs text-[#637067] leading-relaxed">
              Aïn Sebaâ, Sidi Bernoussi, Lissasfa, Bouskoura, Nouaceur. Tournées quotidiennes matin et après-midi avec camions équipés de hayons élévateurs.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-bold text-[#C3643B] bg-[#FCF3EE] px-2.5 py-1 rounded-full">
                Sous 12h à 24h
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E8E1D5] space-y-3 shadow-xs">
            <span className="font-serif text-2xl font-bold text-[#0D3823]">03</span>
            <h3 className="font-bold text-base text-[#141E18]">Toutes les Régions du Maroc</h3>
            <p className="text-xs text-[#637067] leading-relaxed">
              Expéditions sécurisées pour cadres de bouteilles, postes de soudage et palettes d'électrodes vers Rabat, Tanger, Marrakech, Fès et Agadir.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] font-bold text-[#4B574F] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8E1D5]">
                Fret Spécialisé ADR
              </span>
            </div>
          </div>

        </div>

        {/* Clean Emergency Call Strip */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E1D5] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="font-bold text-sm text-[#141E18]">Une urgence de gaz sur votre chantier ?</h4>
            <p className="text-xs text-[#637067]">Contactez directement notre gérant {company?.manager_name ? `M. ${company.manager_name}` : "M. Rachid BOUZAYD"} pour un départ immédiat.</p>
          </div>
          <a
            href={`tel:${(company?.phone_main || '0700950064').replace(/[^0-9]/g, '')}`}
            className="px-6 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{company?.phone_main || "07 00 95 00 64"}</span>
          </a>
        </div>

      </div>
    </section>
  );
}
