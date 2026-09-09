import React, { useState } from 'react';
import { X, CheckCircle, MessageCircle, Truck, ShieldCheck, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';
import { submitOrder } from '../services/api';

export default function CODOrderModal() {
  const { isCodModalOpen, codProduct, closeCodModal } = useCart();
  const { company } = useCompany();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    city: 'Casablanca',
    address: '',
    quantity: 1,
    mode: 'LIVRAISON_SITE'
  });
  const [submitting, setSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (!isCodModalOpen || !codProduct) return null;

  const totalAmount = (codProduct.price_estimate || 0) * customer.quantity;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customer.name || !customer.phone) {
      alert('Veuillez renseigner votre nom et numéro de téléphone.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_name: customer.name,
        customer_phone: customer.phone,
        delivery_city: customer.city,
        delivery_address: customer.address,
        delivery_mode: customer.mode,
        notes: `Commande 1-Clic pour ${codProduct.name}`,
        items: [
          {
            product_id: codProduct.id,
            product_name: codProduct.name,
            quantity: customer.quantity,
            unit_price: codProduct.price_estimate || 0
          }
        ]
      };

      const res = await submitOrder(payload);
      setConfirmedOrder(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsUrl = () => {
    const raw = company?.whatsapp_phone || "212700950064";
    let phone = raw.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '212' + phone.slice(1);
    }
    const cName = company?.company_name || 'RB INDUSTRIEL';
    const mgr = company?.manager_name || 'Rachid BOUZAYD';
    const text = `*COMMANDE DIRECTE - ${cName}*\n` +
      `--------------------------------------\n` +
      `*Article:* ${codProduct.name} (${codProduct.unit})\n` +
      `*Quantité:* ${customer.quantity}\n` +
      `*Total Estimé:* ${totalAmount.toLocaleString('fr-FR')} MAD HT\n` +
      `*Client:* ${customer.name}\n` +
      `*Téléphone:* ${customer.phone}\n` +
      `*Ville:* ${customer.city}\n` +
      `*Adresse:* ${customer.address || 'À préciser'}\n` +
      `*Réf:* ${confirmedOrder?.order_reference || 'DIRECT'}\n` +
      `--------------------------------------\n` +
      `Envoyé à M. ${mgr} (Gérant ${cName})`;
    return `https://wa.me/${phone || '212700950064'}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#E8E1D5] overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-[#E8E1D5] bg-[#FAF7F2] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#C3643B] tracking-wider block">Commande Express</span>
            <h3 className="text-base font-bold text-[#141E18]">Valider votre Commande en 1 Clic</h3>
          </div>
          <button onClick={closeCodModal} className="p-1.5 rounded-full hover:bg-[#E8E1D5] text-[#637067]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {confirmedOrder ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 bg-[#EBF4EE] text-[#0D3823] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-[#141E18]">Commande Transmise avec Succès !</h4>
              <p className="text-xs text-[#637067]">
                Référence enregistrée dans notre base de données :
              </p>
              <div className="p-2.5 bg-[#FAF7F2] rounded-xl font-mono font-bold text-[#0D3823] text-sm border border-[#E8E1D5]">
                {confirmedOrder.order_reference}
              </div>
              <p className="text-xs text-[#637067]">
                Finalisez l'envoi sur WhatsApp pour une prise en charge prioritaire par M. Rachid BOUZAYD.
              </p>

              <div className="pt-2">
                <a
                  href={getWhatsUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Envoyer la confirmation sur WhatsApp Direct</span>
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Product Recap Card */}
              <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-[#141E18]">{codProduct.name}</h4>
                  <span className="text-[10px] text-[#637067]">{codProduct.unit}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-sm text-[#0D3823]">
                    {totalAmount > 0 ? `${totalAmount.toLocaleString('fr-FR')} MAD` : 'Sur Devis'}
                  </span>
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#141E18]">Quantité souhaitée :</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                    className="w-7 h-7 rounded-lg border border-[#E8E1D5] bg-white text-xs font-bold"
                  >-</button>
                  <span className="w-6 text-center font-bold text-sm">{customer.quantity}</span>
                  <button
                    type="button"
                    onClick={() => setCustomer(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
                    className="w-7 h-7 rounded-lg border border-[#E8E1D5] bg-white text-xs font-bold"
                  >+</button>
                </div>
              </div>

              {/* Client Inputs */}
              <div className="space-y-2 text-xs">
                <input
                  type="text"
                  required
                  placeholder="Nom & Prénom / Société *"
                  value={customer.name}
                  onChange={e => setCustomer({ ...customer, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Téléphone / GSM *"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                  />
                  <select
                    value={customer.city}
                    onChange={e => setCustomer({ ...customer, city: e.target.value })}
                    className="p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                  >
                    <option value="Tit Mellil">Tit Mellil (Gratuit)</option>
                    <option value="Casablanca">Casablanca</option>
                    <option value="Mohammedia">Mohammedia</option>
                    <option value="Autre Maroc">Autre Ville</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Adresse de livraison / Chantier"
                  value={customer.address}
                  onChange={e => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                />
              </div>

              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={closeCodModal}
                  className="px-4 py-2.5 text-xs text-[#637067] hover:text-[#141E18]"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'Validation...' : 'Confirmer la Commande'}</span>
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
