import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Layers, Calculator, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';

export default function MobileBottomBar() {
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();
  const { company } = useCompany();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E1D5] px-4 py-2 flex items-center justify-around text-[10px] font-bold">
      <Link 
        to="/" 
        className={`flex flex-col items-center gap-1 ${
          location.pathname === '/' ? 'text-[#0D3823]' : 'text-[#637067]'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Accueil</span>
      </Link>

      <Link 
        to="/categories" 
        className={`flex flex-col items-center gap-1 ${
          location.pathname === '/categories' ? 'text-[#0D3823]' : 'text-[#637067]'
        }`}
      >
        <Layers className="w-4 h-4" />
        <span>Catalogue</span>
      </Link>

      <button
        onClick={() => setIsCartOpen(true)}
        className="flex flex-col items-center gap-1 text-[#637067] relative"
      >
        <div className="relative">
          <ShoppingCart className="w-4 h-4" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-[#C3643B] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {cartCount}
            </span>
          )}
        </div>
        <span>Panier</span>
      </button>

      <a
        href={`https://wa.me/${(company?.whatsapp_phone || '212700950064').replace(/[^0-9]/g, '').replace(/^0/, '212')}`}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col items-center gap-1 text-[#134D2E]"
      >
        <MessageCircle className="w-4 h-4 text-emerald-600" />
        <span>WhatsApp</span>
      </a>
    </div>
  );
}
