import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CompanyProvider } from './context/CompanyContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import CODOrderModal from './components/CODOrderModal';
import MobileBottomBar from './components/MobileBottomBar';
import FlyerShowcaseModal from './components/FlyerShowcaseModal';

// Pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductDetailPage from './pages/ProductDetailPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  const [isFlyerOpen, setIsFlyerOpen] = useState(false);

  return (
    <CompanyProvider>
      <CartProvider>
        <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#141E18] font-sans selection:bg-[#0D3823] selection:text-white pb-14 lg:pb-0">
          
          {/* Global Navbar */}
          <Navbar onOpenFlyer={() => setIsFlyerOpen(true)} />

          {/* Dynamic Router View */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage onOpenFlyer={() => setIsFlyerOpen(true)} />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/catalog" element={<CategoriesPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <Footer onOpenFlyer={() => setIsFlyerOpen(true)} />

          {/* Overlays & Drawers */}
          <CartDrawer />
          <CODOrderModal />
          <FlyerShowcaseModal 
            isOpen={isFlyerOpen} 
            onClose={() => setIsFlyerOpen(false)} 
          />

          {/* Mobile Dock Bar */}
          <MobileBottomBar />

        </div>
      </BrowserRouter>
    </CartProvider>
    </CompanyProvider>
  );
}
