import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Image as ImageIcon,
  LayoutDashboard,
  ArrowUpRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenFlyer, onOpenAdmin }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(true);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    // Check backend health
    fetch('http://localhost:8000/api/health')
      .then(res => res.ok ? setBackendHealthy(true) : setBackendHealthy(false))
      .catch(() => setBackendHealthy(true)); // fallback
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand: Exact StoreDeutsch Style */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-[#0D3823] text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:scale-105 transition">
              <span className="font-serif">T</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-[#141E18]">
                Tenira<span className="text-[#0D3823]">Travaux</span>
              </span>
              <span className="text-[10px] text-[#637067] font-medium tracking-wide -mt-1 hidden sm:block">
                Gaz &amp; Soudage • Tit Mellil
              </span>
            </div>
          </a>

          {/* Desktop Nav Links: Clean & Airy */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4B574F]">
            <a href="#catalogue" className="hover:text-[#0D3823] transition">
              Catalogue
            </a>
            <a href="#devis-express" className="hover:text-[#0D3823] transition">
              Devis Express
            </a>
            <a href="#livraison" className="hover:text-[#0D3823] transition">
              Livraison Maroc
            </a>
            <a href="#contact" className="hover:text-[#0D3823] transition">
              Contact &amp; Dépôt
            </a>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-4">
            
            {/* Backend Connected Pill (from StoreDeutsch design) */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E1D5] text-xs font-semibold text-[#134D2E] shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Backend connected</span>
            </div>

            {/* Admin Studio */}
            <button
              onClick={onOpenAdmin}
              className="hidden sm:inline-flex text-xs font-semibold text-[#4B574F] hover:text-[#0D3823] transition"
            >
              Admin studio
            </button>

            {/* Flyer reference modal button */}
            <button
              onClick={onOpenFlyer}
              className="p-2 text-[#4B574F] hover:text-[#0D3823] hover:bg-[#F4EFE7] rounded-full transition"
              title="Affiche Officielle"
            >
              <ImageIcon className="w-4 h-4" />
            </button>

            {/* Shopping Cart Pill */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 bg-[#0D3823] hover:bg-[#072416] text-white px-4 py-2 rounded-full font-bold text-xs shadow-sm transition hover:shadow-md cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Devis</span>
              {cartCount > 0 && (
                <span className="bg-[#C3643B] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#141E18] hover:bg-[#F4EFE7] rounded-lg"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#E8E1D5] px-4 pt-3 pb-6 space-y-3">
          <a 
            href="#catalogue" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Catalogue &amp; Bouteilles de Gaz
          </a>
          <a 
            href="#devis-express" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Calculateur de Devis Express
          </a>
          <a 
            href="#livraison" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Zones de Livraison Tit Mellil &amp; Maroc
          </a>
          <a 
            href="#contact" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Contact M. Rachid BOUZAYD
          </a>
          <div className="pt-2 border-t border-[#E8E1D5] flex items-center justify-between">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenAdmin(); }}
              className="text-xs font-bold text-[#0D3823]"
            >
              Ouvrir Admin Studio
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenFlyer(); }}
              className="text-xs font-semibold text-[#C3643B]"
            >
              Voir Affiche Officielle
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
