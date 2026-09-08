import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export default function Footer({ onOpenFlyer }) {
  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12 text-xs text-[#637067]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#0D3823] text-white flex items-center justify-center font-bold text-sm font-serif">
                T
              </div>
              <span className="font-extrabold text-base text-[#141E18]">TENIRA TRAVAUX</span>
            </div>
            <p className="leading-relaxed">
              Gaz Industriels &amp; Matériel de Soudage.<br />
              Vente • Distribution • Livraison Tit Mellil &amp; Maroc.
            </p>
            <p className="text-[#141E18] font-bold">
              Gérant : M. Rachid BOUZAYD
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#141E18] uppercase tracking-wider text-[11px]">Gaz &amp; Bouteilles</h4>
            <ul className="space-y-1">
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Oxygène Industriel &amp; Médical B50</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Argon Pur 5.0 (Soudage TIG)</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Mélange Argon + CO2 (MIG/MAG)</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Azote &amp; Dioxyde de Carbone</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Acétylène Dissous Haute T°</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#141E18] uppercase tracking-wider text-[11px]">Matériel &amp; Outils</h4>
            <ul className="space-y-1">
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Postes Inverter MMA 200A LCD</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Semi-Auto MIG/MAG &amp; TIG HF</a></li>
              <li><a href="#catalogue" className="hover:text-[#0D3823] transition">Cagoules LCD True Color</a></li>
              <li><a href="#devis-express" className="hover:text-[#0D3823] transition">Calculateur Devis Express</a></li>
              <li><button onClick={onOpenFlyer} className="hover:text-[#0D3823] transition text-left">Affiche Officielle</button></li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2">
            <h4 className="font-bold text-[#141E18] uppercase tracking-wider text-[11px]">Coordonnées Directes</h4>
            <p>Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca</p>
            <p className="font-mono text-[#0D3823] font-bold">GSM : 06 61 49 04 95</p>
            <p className="font-mono text-[#4B574F]">Fixe : 05 22 35 48 68</p>
            <p className="font-mono text-[#0D3823]">teniratravaux@gmail.com</p>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#8C9890]">
          <p>© 2026 TENIRA TRAVAUX. Tit Mellil, Casablanca, Maroc. Tous droits réservés.</p>
          <div className="flex items-center gap-3">
            <span>Livraison Rapide &amp; Sécurisée</span>
            <span>•</span>
            <Link to="/admin" className="hover:text-[#0D3823] hover:underline transition">
              Accès Administration
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
