import React, { useState } from 'react';
import { 
  FileText, 
  Calculator, 
  Check, 
  MessageCircle,
  Plus,
  Minus,
  Send
import { submitQuoteRequest } from '../services/api';
import { useCompany } from '../context/CompanyContext';

const QUICK_GAS_ITEMS = [
  { id: 'gas-o2', name: 'Oxygène B50 (10.5 m³)', price: 280, unit: 'Bouteille' },
  { id: 'gas-ar', name: 'Argon Pur 5.0 B50 (10 m³)', price: 450, unit: 'Bouteille' },
  { id: 'gas-mix', name: 'Mélange Argon+CO2 B50', price: 390, unit: 'Bouteille' },
  { id: 'gas-n2', name: 'Azote Haute Pureté B50', price: 320, unit: 'Bouteille' },
  { id: 'gas-co2', name: 'CO2 Industriel (30 kg)', price: 260, unit: 'Bouteille' },
  { id: 'gas-c2h2', name: 'Acétylène Dissous B40', price: 420, unit: 'Bouteille' },
];

const QUICK_EQUIPMENT_ITEMS = [
  { id: 'eq-mma', name: 'Inverter MMA 200A Pro LCD', price: 2150, unit: 'Pack Pro' },
  { id: 'eq-mig', name: 'Poste MIG/MAG 250A Multi-Procédés', price: 5800, unit: 'Unité Pro' },
  { id: 'eq-tig', name: 'Poste TIG AC/DC 200A HF', price: 7400, unit: 'Pack Complet' },
  { id: 'eq-mask', name: 'Cagoule Soudage LCD True Color', price: 690, unit: 'Unité' },
  { id: 'eq-mano-o2', name: 'Manodétendeur Blindé Oxygène', price: 480, unit: 'Unité' },
  { id: 'eq-mano-ar', name: 'Manodétendeur Débitmètre Argon/CO2', price: 520, unit: 'Unité' },
  { id: 'eq-sg2', name: 'Bobine Fil SG2 15kg (0.8/1.0mm)', price: 430, unit: 'Bobine' },
  { id: 'eq-gants', name: 'Gants Soudeur Cuir 35cm', price: 75, unit: 'Paire' },
];

export default function QuoteSimulator() {
  const { company } = useCompany();
  const [quantities, setQuantities] = useState({});
  const [clientInfo, setClientInfo] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    city: 'Casablanca',
    notes: ''
  });
  const [submittedRef, setSubmittedRef] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateQty = (id, delta) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  const selectedItemsList = [...QUICK_GAS_ITEMS, ...QUICK_EQUIPMENT_ITEMS]
    .filter((item) => (quantities[item.id] || 0) > 0)
    .map((item) => ({
      ...item,
      quantity: quantities[item.id],
      total: (quantities[item.id] || 0) * item.price
    }));

  const subtotal = selectedItemsList.reduce((acc, it) => acc + it.total, 0);

  const getDeliveryFee = () => {
    if (subtotal === 0) return 0;
    if (clientInfo.city === 'Tit Mellil') return 0;
    if (clientInfo.city === 'Casablanca' || clientInfo.city === 'Mohammedia') {
      return subtotal > 1500 ? 0 : 150;
    }
    return 300;
  };

  const deliveryFee = getDeliveryFee();
  const totalEstimated = subtotal + deliveryFee;

  const handleSubmitApi = async (e) => {
    e.preventDefault();
    if (!clientInfo.name || !clientInfo.phone) {
      alert('Veuillez renseigner votre nom et numéro de téléphone.');
      return;
    }
    if (selectedItemsList.length === 0) {
      alert('Sélectionnez au moins un article pour calculer le devis.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitQuoteRequest({
        client_name: clientInfo.name,
        phone: clientInfo.phone,
        email: clientInfo.email,
        company: clientInfo.company,
        city: clientInfo.city,
        needs_description: `Devis Express généré via le simulateur (${clientInfo.notes || 'Sans remarque'})`,
        items_json: selectedItemsList
      });
      setSubmittedRef(res.quote_reference);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const getWhatsAppSimulatorUrl = () => {
    let msg = `*DEMANDE DE DEVIS EXPRESS - RB INDUSTRIALE*\n`;
    msg += `--------------------------------------\n`;
    msg += `*Client / Contact:* ${clientInfo.name || 'Client'}\n`;
    if (clientInfo.company) msg += `*Société:* ${clientInfo.company}\n`;
    msg += `*Téléphone:* ${clientInfo.phone || 'Non renseigné'}\n`;
    msg += `*Ville de Livraison:* ${clientInfo.city}\n`;
    msg += `--------------------------------------\n`;
    msg += `*ARTICLES :*\n`;
    selectedItemsList.forEach((it, idx) => {
      msg += `${idx + 1}. *${it.name}* x ${it.quantity} = ${(it.total).toLocaleString('fr-FR')} MAD\n`;
    });
    msg += `--------------------------------------\n`;
    msg += `*Sous-total:* ${subtotal.toLocaleString('fr-FR')} MAD HT\n`;
    msg += `*Livraison (${clientInfo.city}):* ${deliveryFee === 0 ? 'Offerte' : deliveryFee + ' MAD'}\n`;
    msg += `*TOTAL ESTIMÉ:* ${totalEstimated.toLocaleString('fr-FR')} MAD HT\n`;
    const rawPhone = company?.whatsapp_phone || "212700950064";
    let phone = rawPhone.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '212' + phone.slice(1);
    }
    return `https://wa.me/${phone || '212700950064'}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <section id="devis-express" className="py-16 bg-white border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#C3643B]"></span>
            <span className="text-[11px] font-bold text-[#637067] uppercase tracking-widest">
              SIMULATEUR INSTANTANÉ
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141E18] tracking-tight">
            Calculateur de Devis Express
          </h2>
          <p className="text-xs sm:text-sm text-[#637067] max-w-xl">
            Ajustez le volume de bouteilles et de matériel pour estimer votre coût en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Picker Panels */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Gaz items */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E1D5] space-y-3">
              <span className="text-xs font-bold text-[#141E18] uppercase tracking-wider block">
                1. Bouteilles de Gaz Sous Pression
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_GAS_ITEMS.map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border transition flex items-center justify-between ${
                        qty > 0 ? 'bg-white border-[#0D3823]' : 'bg-white/60 border-[#E8E1D5]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#141E18] block">{item.name}</span>
                        <span className="text-[10px] text-[#C3643B] font-semibold">{item.price} MAD <span className="text-[#8C9890]">/{item.unit}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#FAF7F2] p-1 rounded-lg border border-[#E8E1D5]">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#637067] hover:text-[#141E18]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#141E18]">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#0D3823] font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Equipment items */}
            <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E8E1D5] space-y-3">
              <span className="text-xs font-bold text-[#141E18] uppercase tracking-wider block">
                2. Postes &amp; Équipements de Soudage
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {QUICK_EQUIPMENT_ITEMS.map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div 
                      key={item.id}
                      className={`p-3 rounded-xl border transition flex items-center justify-between ${
                        qty > 0 ? 'bg-white border-[#0D3823]' : 'bg-white/60 border-[#E8E1D5]'
                      }`}
                    >
                      <div>
                        <span className="text-xs font-bold text-[#141E18] block truncate max-w-[150px]">{item.name}</span>
                        <span className="text-[10px] text-[#C3643B] font-semibold">{item.price} MAD <span className="text-[#8C9890]">/{item.unit}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 bg-[#FAF7F2] p-1 rounded-lg border border-[#E8E1D5]">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          className="w-5 h-5 flex items-center justify-center text-[#637067] hover:text-[#141E18]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-5 text-center text-xs font-bold text-[#141E18]">{qty}</span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          className="w-5 h-5 flex items-center justify-center text-[#0D3823] font-bold"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right: Summary Card */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl p-6 border border-[#E8E1D5] space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-[#E8E1D5]">
              <h3 className="font-bold text-sm text-[#141E18]">Votre Devis Estimatif</h3>
              <span className="text-[11px] text-[#637067] font-medium">{selectedItemsList.length} article(s)</span>
            </div>

            {/* List */}
            <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs">
              {selectedItemsList.length === 0 ? (
                <p className="text-[#8C9890] italic text-center py-4">Ajoutez des articles avec les boutons (+)</p>
              ) : (
                selectedItemsList.map(it => (
                  <div key={it.id} className="flex justify-between py-1 border-b border-[#F0ECE3] text-[11px]">
                    <span className="text-[#4B574F] truncate max-w-[180px]">{it.name} x{it.quantity}</span>
                    <span className="font-bold text-[#141E18]">{it.total.toLocaleString('fr-FR')} MAD</span>
                  </div>
                ))
              )}
            </div>

            {/* Inputs */}
            <div className="space-y-2 pt-2 border-t border-[#E8E1D5] text-xs">
              <input
                type="text"
                placeholder="Votre Nom & Prénom *"
                value={clientInfo.name}
                onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                className="w-full p-2 bg-white rounded-lg border border-[#E8E1D5] text-xs focus:ring-1 focus:ring-[#0D3823] outline-none"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="tel"
                  placeholder="Téléphone / GSM *"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                  className="p-2 bg-white rounded-lg border border-[#E8E1D5] text-xs focus:ring-1 focus:ring-[#0D3823] outline-none"
                />
                <select
                  value={clientInfo.city}
                  onChange={(e) => setClientInfo({ ...clientInfo, city: e.target.value })}
                  className="p-2 bg-white rounded-lg border border-[#E8E1D5] text-xs focus:ring-1 focus:ring-[#0D3823] outline-none"
                >
                  <option value="Tit Mellil">Tit Mellil (Gratuit)</option>
                  <option value="Casablanca">Casablanca</option>
                  <option value="Mohammedia">Mohammedia</option>
                  <option value="Autre Maroc">Autre Ville</option>
                </select>
              </div>
            </div>

            {/* Total */}
            <div className="pt-2 border-t border-[#E8E1D5] space-y-1 text-xs">
              <div className="flex justify-between text-[#637067]">
                <span>Sous-total HT :</span>
                <span className="font-bold text-[#141E18]">{subtotal.toLocaleString('fr-FR')} MAD</span>
              </div>
              <div className="flex justify-between text-[#637067]">
                <span>Frais de livraison :</span>
                <span className="font-semibold text-[#0D3823]">{deliveryFee === 0 ? 'Offert' : `${deliveryFee} MAD`}</span>
              </div>
              <div className="flex justify-between items-baseline pt-2 text-sm font-bold border-t border-[#E8E1D5]">
                <span className="text-[#141E18]">Total Estimé :</span>
                <span className="text-xl font-black text-[#0D3823]">{totalEstimated.toLocaleString('fr-FR')} MAD HT</span>
              </div>
            </div>

            {submittedRef && (
              <div className="p-2.5 bg-emerald-100/60 rounded-lg text-xs text-[#134D2E] flex items-center gap-1.5 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>Devis enregistré : <strong>{submittedRef}</strong></span>
              </div>
            )}

            {/* Submit */}
            <div className="space-y-2 pt-2">
              <a
                href={getWhatsAppSimulatorUrl()}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envoyer le devis sur WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleSubmitApi}
                disabled={submitting || selectedItemsList.length === 0}
                className="w-full py-2 px-4 rounded-full bg-white hover:bg-[#FAF7F2] text-[#4B574F] font-semibold text-xs flex items-center justify-center gap-1.5 border border-[#E8E1D5] transition disabled:opacity-50"
              >
                <Send className="w-3 h-3" />
                <span>{submitting ? 'Envoi...' : 'Enregistrer sur le serveur'}</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
