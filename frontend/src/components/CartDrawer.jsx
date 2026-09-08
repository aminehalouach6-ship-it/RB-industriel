import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  MessageCircle, 
  CheckCircle, 
  Truck, 
  Store, 
  Send
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';

export default function CartDrawer() {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    cartTotal,
    getWhatsAppUrl 
  } = useCart();

  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    city: 'Casablanca',
    address: '',
    mode: 'LIVRAISON_SITE',
    notes: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(null);

  if (!isCartOpen) return null;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Veuillez fournir votre nom et numéro de téléphone.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        customer_email: customer.email,
        company_name: customer.company,
        delivery_city: customer.city,
        delivery_address: customer.address,
        delivery_mode: customer.mode,
        notes: customer.notes,
        items: cart.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: item.product.price_estimate || 0.0
        }))
      };

      const res = await submitOrder(orderPayload);
      setOrderConfirmed(res);
      clearCart();
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la validation.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#E8E1D5]">
          
          {/* Header */}
          <div className="p-5 border-b border-[#E8E1D5] bg-[#FAF7F2] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4 text-[#0D3823]" />
              <h2 className="text-base font-bold text-[#141E18]">Mon Devis &amp; Panier</h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-[#637067] hover:text-[#141E18] hover:bg-[#F4EFE7]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {orderConfirmed ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 bg-[#EBF4EE] text-[#0D3823] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-black text-[#141E18]">Commande Enregistrée</h3>
                <div className="p-2.5 bg-[#FAF7F2] rounded-xl font-mono font-bold text-[#0D3823] text-xs border border-[#E8E1D5]">
                  Réf : {orderConfirmed.order_reference}
                </div>
                <p className="text-xs text-[#637067] max-w-xs mx-auto">
                  M. Rachid BOUZAYD vous contactera sous peu pour coordonner la mise à disposition.
                </p>

                <div className="pt-3">
                  <a
                    href={getWhatsAppUrl({
                      name: customer.name,
                      phone: customer.phone,
                      city: customer.city,
                      address: customer.address,
                      mode: customer.mode,
                      notes: `Réf: ${orderConfirmed.order_reference}`
                    })}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Envoyer confirmation sur WhatsApp
                  </a>
                </div>
              </div>
            ) : cart.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <ShoppingCart className="w-10 h-10 text-[#C6CFCA] mx-auto" />
                <p className="text-xs font-bold text-[#141E18]">Votre panier est vide</p>
                <p className="text-[11px] text-[#8C9890]">Ajoutez des articles depuis le catalogue pour générer votre devis.</p>
              </div>
            ) : (
              <>
                {/* List */}
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] font-bold text-[#8C9890] uppercase tracking-wider">
                    <span>Articles ({cart.length})</span>
                    <button onClick={clearCart} className="text-[#C3643B] hover:underline">Vider</button>
                  </div>

                  {cart.map((item) => (
                    <div 
                      key={item.product.id}
                      className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] flex justify-between items-center gap-2"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-[#141E18] truncate">{item.product.name}</h4>
                        <span className="text-[10px] text-[#8C9890] block">{item.product.unit}</span>
                        <span className="text-xs font-bold text-[#0D3823]">
                          {item.product.price_estimate > 0 
                            ? `${(item.product.price_estimate * item.quantity).toLocaleString('fr-FR')} MAD` 
                            : 'Sur devis'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 bg-white px-2 py-1 rounded-lg border border-[#E8E1D5]">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-4 h-4 flex items-center justify-center text-[#637067] hover:text-[#141E18]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-4 text-center text-xs font-bold text-[#141E18]">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-4 h-4 flex items-center justify-center text-[#0D3823] font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-[#8C9890] hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Mode */}
                <div className="space-y-1.5 pt-2 border-t border-[#E8E1D5] text-xs">
                  <label className="font-bold text-[#141E18] block">Mode de Réception</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, mode: 'LIVRAISON_SITE' })}
                      className={`p-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                        customer.mode === 'LIVRAISON_SITE'
                          ? 'bg-[#EBF4EE] border-[#0D3823] text-[#0D3823]'
                          : 'bg-white border-[#E8E1D5] text-[#637067]'
                      }`}
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Livraison</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomer({ ...customer, mode: 'RETRAIT' })}
                      className={`p-2 rounded-xl border font-semibold flex items-center justify-center gap-1.5 transition ${
                        customer.mode === 'RETRAIT'
                          ? 'bg-[#EBF4EE] border-[#0D3823] text-[#0D3823]'
                          : 'bg-white border-[#E8E1D5] text-[#637067]'
                      }`}
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Dépôt Tit Mellil</span>
                    </button>
                  </div>
                </div>

                {/* Contact Inputs */}
                <div className="space-y-2 pt-2 border-t border-[#E8E1D5] text-xs">
                  <input
                    type="text"
                    placeholder="Nom & Prénom / Contact *"
                    value={customer.name}
                    onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full p-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      placeholder="Téléphone / GSM *"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      className="w-full p-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                    />
                    <select
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      className="p-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                    >
                      <option value="Tit Mellil">Tit Mellil</option>
                      <option value="Casablanca">Casablanca</option>
                      <option value="Mohammedia">Mohammedia</option>
                      <option value="Autre Maroc">Autre Ville</option>
                    </select>
                  </div>
                  <input
                    type="text"
                    placeholder="Adresse de livraison / Chantier"
                    value={customer.address}
                    onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full p-2 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                  />
                </div>

                {/* Subtotal */}
                <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] space-y-1 text-xs">
                  <div className="flex justify-between text-[#637067]">
                    <span>Total Estimatif HT :</span>
                    <span className="font-bold text-[#141E18]">
                      {cartTotal > 0 ? `${cartTotal.toLocaleString('fr-FR')} MAD` : 'Sur Devis'}
                    </span>
                  </div>
                </div>

                {/* Buttons */}
                <div className="space-y-2 pt-2">
                  <a
                    href={getWhatsAppUrl(customer)}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Commander via WhatsApp</span>
                  </a>

                  <button
                    onClick={handleSubmitOrder}
                    disabled={submitting}
                    className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4B574F] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E8E1D5] transition disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submitting ? 'Validation...' : 'Enregistrer en ligne (API)'}</span>
                  </button>
                </div>
              </>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
