import React, { useState } from 'react';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import ProductDetailModal from './components/ProductDetailModal';
import QuoteSimulator from './components/QuoteSimulator';
import DeliverySection from './components/DeliverySection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import FlyerShowcaseModal from './components/FlyerShowcaseModal';
import ManagerModal from './components/ManagerModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
        
        {/* Navigation bar with top contact strip */}
        <Navbar 
          onOpenFlyer={() => setIsFlyerOpen(true)} 
          onOpenAdmin={() => setIsAdminOpen(true)} 
        />

        {/* Hero Section */}
        <main className="flex-1">
          <Hero onOpenFlyer={() => setIsFlyerOpen(true)} />
          
          {/* Dynamic Product Catalog */}
          <ProductCatalog onSelectProduct={(prod) => setSelectedProduct(prod)} />

          {/* Express Quote Simulator */}
          <QuoteSimulator />

          {/* Delivery & Logistics coverage */}
          <DeliverySection />

          {/* Contact & Map */}
          <ContactSection />
        </main>

        {/* Footer */}
        <Footer onOpenFlyer={() => setIsFlyerOpen(true)} />

        {/* Modals & Overlays */}
        <CartDrawer />
        
        {selectedProduct && (
          <ProductDetailModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
          />
        )}

        <FlyerShowcaseModal 
          isOpen={isFlyerOpen} 
          onClose={() => setIsFlyerOpen(false)} 
        />

        <ManagerModal 
          isOpen={isAdminOpen} 
          onClose={() => setIsAdminOpen(false)} 
        />

        {/* Permanent Floating WhatsApp */}
        <FloatingWhatsApp />

      </div>
    </CartProvider>
  );
}
