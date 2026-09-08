import React, { createContext, useContext, useState, useEffect } from 'react';
import { useCompany } from './CompanyContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { company } = useCompany();
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('tenira_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCodModalOpen, setIsCodModalOpen] = useState(false);
  const [codProduct, setCodProduct] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('tenira_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id);
      if (existingIndex > -1) {
        const copy = [...prev];
        copy[existingIndex].quantity += quantity;
        return copy;
      } else {
        return [...prev, { product, quantity }];
      }
    });
    setIsCartOpen(true);
  };

  const openCodModal = (product) => {
    setCodProduct(product);
    setIsCodModalOpen(true);
  };

  const closeCodModal = () => {
    setIsCodModalOpen(false);
    setCodProduct(null);
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartTotal = cart.reduce(
    (sum, item) => sum + (item.product.price_estimate || 0) * item.quantity,
    0
  );

  const generateWhatsAppMessage = (customerInfo = {}) => {
    let text = `*COMMANDE / DEVIS - RB INDUSTRIALE*\n`;
    text += `--------------------------------------\n`;
    if (customerInfo.name) text += `*Client / Société:* ${customerInfo.name}\n`;
    if (customerInfo.phone) text += `*Téléphone:* ${customerInfo.phone}\n`;
    if (customerInfo.city) text += `*Ville de Livraison:* ${customerInfo.city}\n`;
    if (customerInfo.address) text += `*Adresse:* ${customerInfo.address}\n`;
    if (customerInfo.mode) text += `*Mode:* ${customerInfo.mode === 'RETRAIT' ? 'Retrait Tit Mellil' : 'Livraison sur Chantier'}\n`;
    text += `--------------------------------------\n`;
    text += `*ARTICLES SÉLECTIONNÉS :*\n`;

    cart.forEach((item, index) => {
      const p = item.product;
      const lineTotal = (p.price_estimate || 0) * item.quantity;
      text += `${index + 1}. *${p.name}*\n   Quantité: ${item.quantity} | Prix: ${lineTotal > 0 ? lineTotal.toLocaleString('fr-FR') + ' MAD' : 'Sur Devis'}\n`;
    });

    text += `--------------------------------------\n`;
    if (cartTotal > 0) {
      text += `*TOTAL ESTIMATIF : ${cartTotal.toLocaleString('fr-FR')} MAD HT*\n`;
    }
    if (customerInfo.notes) {
      text += `*Remarque:* ${customerInfo.notes}\n`;
    }
    text += `--------------------------------------\n`;
    text += `À l'attention de M. ${company?.manager_name || 'Rachid BOUZAYD'} (Gérant ${company?.company_name || 'RB INDUSTRIEL'}, ${company?.city || 'Tit Mellil'})`;
    return encodeURIComponent(text);
  };

  const getWhatsAppUrl = (customerInfo = {}) => {
    const raw = company?.whatsapp_phone || "212700950064";
    let phone = raw.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '212' + phone.slice(1);
    }
    const msg = generateWhatsAppMessage(customerInfo);
    return `https://wa.me/${phone || '212700950064'}?text=${msg}`;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        getWhatsAppUrl,
        isCodModalOpen,
        codProduct,
        openCodModal,
        closeCodModal
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
