import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCompany } from '../context/CompanyContext';

export default function Footer({ onOpenFlyer }) {
  const { company } = useCompany();

  return (
    <footer className="bg-[#FAF7F2] border-t border-[#E8E1D5] py-12 text-xs text-[#637067]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src={company.logo_url || "/logo_rb_industriale.png"} 
                alt={company.company_name || "RB INDUSTRIEL"} 
                className="w-9 h-9 rounded-full object-cover shadow-sm border border-[#E8E1D5]" 
              />
              <span className="font-extrabold text-base text-[#141E18]">{company.company_name || "RB INDUSTRIEL"}</span>
            </div>
            <p className="leading-relaxed">
              {company.tagline || "Gaz Industriels & Matériel de Soudage."}<br />
              Vente • Distribution • Livraison Tit Mellil &amp; Maroc.
            </p>
            <p className="text-[#141E18] font-bold">
              Gérant : M. {company.manager_name || "Rachid BOUZAYD"}
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
          <div className="space-y-2.5">
            <h4 className="font-extrabold text-[#141E18] uppercase tracking-wider text-[11px]">Coordonnées Directes</h4>
            <p className="leading-relaxed text-[#637067]">
              {company.address || "Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc"}
            </p>
            <div className="space-y-1.5 text-xs font-sans">
              <p className="text-[#141E18]">
                <span className="font-bold text-[#0D3823]">GSM : </span>
                <a 
                  href={`tel:${(company.phone_main || '0700950064').replace(/[^0-9]/g, '')}`} 
                  className="font-bold text-[#0D3823] hover:underline transition"
                >
                  {company.phone_main || "07 00 95 00 64"}
                </a>
              </p>
              <p className="text-[#4B574F]">
                <span className="font-semibold text-[#141E18]">Fixe : </span>
                <a 
                  href={`tel:${(company.phone_fixed || '0522354868').replace(/[^0-9]/g, '')}`} 
                  className="font-medium hover:text-[#0D3823] transition"
                >
                  {company.phone_fixed || "05 22 35 48 68"}
                </a>
              </p>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-[#E8E1D5] flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-[#8C9890]">
          <p>© 2026 {company.company_name || "RB INDUSTRIEL"} ({company.manager_name || "Rachid BOUZAYD"}). {company.city || "Tit Mellil, Casablanca, Maroc"}. Tous droits réservés.</p>
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
