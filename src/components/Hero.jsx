import React from 'react';
import { 
  ArrowRight, 
  ArrowUpRight, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  Flame,
  CheckCircle2
} from 'lucide-react';

export default function Hero({ onOpenFlyer }) {
  return (
    <section className="relative pt-10 sm:pt-16 pb-16 lg:pb-24 overflow-hidden bg-[#FAF7F2]">
      
      {/* Soft warm radial glow in the top right (as in StoreDeutsch screenshot) */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-gradient-to-bl from-[#F6ECE0]/70 via-[#FAF7F2]/40 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Editorial Headline & Layout */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Fine divider line + Category Tracker */}
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#C3643B]"></span>
              <span className="text-[11px] font-bold text-[#637067] tracking-[0.2em] uppercase">
                TENIRA TRAVAUX ── GAZ INDUSTRIELS &amp; SOUDAGE
              </span>
            </div>

            {/* Main Title with Editorial Serif Accent */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-[#141E18] tracking-tight leading-[1.08]">
              Gaz ou soudage?{' '}
              <span className="font-serif italic font-normal text-[#C3643B]">
                Nous
              </span>{' '}
              vous équipons.
            </h1>

            {/* Sub-headline with delivery icon & Arabic touch */}
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#141E18]">
              <span className="text-[#C3643B]">من ورشة العمل حتى موقع البناء</span>
              <span className="text-[#637067]">•</span>
              <span>Livraison Directe Tit Mellil &amp; Partout au Maroc 🚚</span>
            </div>

            {/* Dark Green Pill Container (exact style of TELC/Goethe pill) */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#0D3823] text-white text-xs sm:text-sm font-bold shadow-sm">
              <span className="text-emerald-300">Oxygène • Argon • Azote • CO2</span>
              <span className="text-white/40">|</span>
              <span className="text-slate-100">Inverter MMA • MIG • TIG</span>
            </div>

            {/* Gas Type Selection Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {['O₂', 'Ar', 'N₂', 'CO₂', 'MMA', 'MIG', 'TIG'].map((item, idx) => (
                <span
                  key={idx}
                  className={`w-9 h-9 rounded-full border text-xs font-bold flex items-center justify-center transition cursor-default ${
                    idx === 0 
                      ? 'border-[#0D3823] text-[#0D3823] bg-white shadow-xs' 
                      : idx === 1
                      ? 'border-[#C3643B] text-[#C3643B] bg-[#FCF3EE]'
                      : 'border-[#E8E1D5] text-[#637067] bg-white'
                  }`}
                >
                  {item}
                </span>
              ))}
              <span className="text-xs text-[#637067] font-medium ml-2">
                Approvisionnement continu &amp; bouteilles éprouvées
              </span>
            </div>

            {/* 4 Feature Circles (exact layout from screenshot) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center text-[#C3643B] shadow-xs">
                  <Star className="w-4 h-4 fill-current" />
                </div>
                <span className="text-[11px] font-bold text-[#141E18]">Pureté 99.999%</span>
                <span className="text-[10px] text-[#637067]">Gaz purs &amp; certifiés</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center text-[#0D3823] shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#141E18]">Inverter LCD</span>
                <span className="text-[10px] text-[#637067]">Technologie IGBT pro</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center text-[#C3643B] shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#141E18]">200 Bars Contrôlés</span>
                <span className="text-[10px] text-[#637067]">Sécurité certifiée</span>
              </div>

              <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-1.5">
                <div className="w-10 h-10 rounded-full bg-white border border-[#E8E1D5] flex items-center justify-center text-[#0D3823] shadow-xs">
                  <Truck className="w-4 h-4" />
                </div>
                <span className="text-[11px] font-bold text-[#141E18]">Tit Mellil Express</span>
                <span className="text-[10px] text-[#637067]">Livraison sous 2h</span>
              </div>

            </div>

            {/* Action Buttons: Exact StoreDeutsch CTA design */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#catalogue"
                className="px-7 py-3.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition hover:scale-[1.02] cursor-pointer"
              >
                <span>Découvrir le Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="https://wa.me/212661490495"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-full bg-[#EBF4EE] hover:bg-[#DFEDE3] text-[#134D2E] font-bold text-xs sm:text-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>WhatsApp M. Rachid BOUZAYD</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <span className="text-xs text-[#637067] font-medium hidden sm:inline">
                +500 ateliers &amp; chantiers approvisionnés
              </span>
            </div>

          </div>

          {/* Right Column: 3D Tilted Catalogue Presentation (exact StoreDeutsch book showcase) */}
          <div className="lg:col-span-5 relative flex justify-center items-center py-6">
            
            {/* Circular ambient background */}
            <div className="w-[320px] sm:w-[400px] h-[320px] sm:h-[400px] rounded-full bg-gradient-to-tr from-[#EFE8DC] to-[#FAF7F2] absolute -z-0"></div>

            <div className="relative z-10 w-[270px] sm:w-[310px] h-[380px] sm:h-[430px]">
              
              {/* Back Card: Terracotta / Copper colored folder angled at 8deg */}
              <div className="absolute inset-0 rounded-2xl bg-[#C3643B] transform rotate-6 translate-x-3 translate-y-2 shadow-lg border border-[#B0532C]/30 flex flex-col justify-end p-5 text-white/80">
                <div className="text-right">
                  <span className="text-[10px] tracking-widest uppercase font-mono">STOCK DISPONIBLE</span>
                  <p className="text-xs font-bold text-white">Livraison 24h/48h</p>
                </div>
              </div>

              {/* Front Card: Deep Forest Green Hardcover Book angled at -3deg */}
              <div 
                onClick={onOpenFlyer}
                className="absolute inset-0 rounded-2xl bg-[#0D3823] transform -rotate-2 hover:rotate-0 transition-transform duration-500 shadow-2xl border-2 border-[#1E5236] p-7 flex flex-col justify-between text-white cursor-pointer group"
              >
                
                {/* Book Top Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono tracking-widest text-[#C3643B] uppercase font-bold">
                      TIT MELLIL • ÉDITION 2026
                    </span>
                    <span className="text-[9px] text-white/50 font-mono">TT-PRO</span>
                  </div>
                  <div className="w-full h-[1px] bg-white/15 my-2"></div>
                </div>

                {/* Book Center Typography (Identical to "DEUTSCH PRÜFUNG VORBEREITUNG") */}
                <div className="space-y-1 text-center py-4">
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#FAF7F2] leading-tight">
                    TENIRA<br />TRAVAUX
                  </h3>
                  <div className="w-10 h-[2px] bg-[#C3643B] mx-auto my-3"></div>
                  <p className="text-xs sm:text-sm font-bold tracking-wider text-emerald-300 font-sans uppercase">
                    GAZ INDUSTRIELS
                  </p>
                  <p className="text-[11px] text-white/80 font-medium">
                    &amp; Matériel de Soudage
                  </p>
                </div>

                {/* Book Bottom details */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-white/70 font-mono">
                  <span>RACHID BOUZAYD</span>
                  <span className="text-emerald-400 font-bold group-hover:underline">VOIR AFFICHE 🔍</span>
                </div>

              </div>

              {/* Floating Badge (similar to "01 Find your next level") */}
              <div className="absolute -bottom-4 -left-6 z-20 bg-white rounded-xl p-3 border border-[#E8E1D5] shadow-lg flex items-center gap-3">
                <span className="font-serif font-black text-lg text-[#0D3823]">01</span>
                <div className="text-left leading-tight">
                  <span className="text-[9px] uppercase font-bold text-[#637067] block tracking-wider">
                    DÉPÔT CENTRAL
                  </span>
                  <span className="text-xs font-extrabold text-[#141E18]">
                    Tit Mellil, Hay Amal 1
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
