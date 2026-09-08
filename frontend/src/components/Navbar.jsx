import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Menu, 
  X, 
  Image as ImageIcon
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar({ onOpenFlyer }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [backendHealthy, setBackendHealthy] = useState(true);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    fetch('http://localhost:8000/api/health')
      .then(res => res.ok ? setBackendHealthy(true) : setBackendHealthy(false))
      .catch(() => setBackendHealthy(true));
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-3 group">
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
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-[#4B574F]">
            <Link 
              to="/" 
              className={`transition ${location.pathname === '/' ? 'text-[#0D3823] font-black' : 'hover:text-[#0D3823]'}`}
            >
              Catalogue &amp; Gaz
            </Link>
            <button 
              onClick={onOpenFlyer}
              className="hover:text-[#0D3823] transition cursor-pointer font-medium text-[#4B574F]"
            >
              Informations
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Live Database Sync Pill */}
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E1D5] text-xs font-semibold text-[#134D2E] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>PostgreSQL Live</span>
            </div>

            {/* Admin Studio Link */}
            <Link
              to="/admin"
              className={`px-3.5 py-1.5 rounded-full text-xs font-black transition flex items-center gap-1.5 ${
                location.pathname === '/admin'
                  ? 'bg-[#0D3823] text-white shadow-xs'
                  : 'bg-[#FCF3EE] text-[#C3643B] border border-[#F2D7CB] hover:bg-[#F9E8DE]'
              }`}
            >
              <span>Admin Studio</span>
            </Link>

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

            {/* Mobile Toggle */}
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
          <Link 
            to="/" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Accueil
          </Link>
          <Link 
            to="/categories" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Catalogue des Produits
          </Link>
          <a 
            href="/#devis-express" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Calculateur de Devis Express
          </a>
          <button 
            onClick={() => { setMobileMenuOpen(false); onOpenFlyer(); }}
            className="block w-full text-left px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2] cursor-pointer"
          >
            Informations &amp; Contact Officiel
          </button>
          <a 
            href="/#livraison" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-semibold text-[#141E18] hover:bg-[#FAF7F2]"
          >
            Zones de Livraison Tit Mellil &amp; Maroc
          </a>
          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md font-bold text-[#0D3823] bg-[#EBF4EE]"
          >
            Admin Studio
          </Link>
        </div>
      )}
    </header>
  );
}
