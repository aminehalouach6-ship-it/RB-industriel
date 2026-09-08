import React from 'react';
import { X, CheckCircle, ShieldAlert, ShoppingCart, MessageCircle, Phone, FileCheck, Send } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const { addToCart, openCodModal } = useCart();

  const handleAddAndClose = () => {
    addToCart(product, 1);
    onClose();
  };

  const handleOrderAndClose = () => {
    onClose();
    openCodModal(product);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-[#E8E1D5]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#E8E1D5] bg-[#FAF7F2]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#637067] bg-white px-2.5 py-1 rounded-full border border-[#E8E1D5]">
              {product.unit}
            </span>
            {product.badge && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-[#FCF3EE] text-[#C3643B] border border-[#F2D7CB]">
                {product.badge}
              </span>
            )}
            {product.gas_type && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-[#EBF4EE] text-[#0D3823] border border-[#C5E1D0]">
                {product.gas_type}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full text-[#8C9890] hover:text-[#141E18] hover:bg-[#E8E1D5] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div>
            <h2 className="text-2xl font-black text-[#141E18] leading-tight">
              {product.name}
            </h2>
            <p className="text-xs text-[#0D3823] font-bold mt-1">
              TENIRA TRAVAUX • Tit Mellil, Casablanca (M. Rachid BOUZAYD)
            </p>
          </div>

          <div className="text-xs text-[#4B574F] leading-relaxed bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D5]">
            <h4 className="text-[10px] font-bold text-[#637067] uppercase tracking-wider mb-1.5">
              Description &amp; Recommandations d'Utilisation
            </h4>
            <p>{product.description || product.short_desc}</p>
          </div>

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#141E18] uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#0D3823]" />
                Fiche Technique &amp; Caractéristiques
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5]">
                    <span className="text-[#637067] font-medium">{key} :</span>
                    <span className="text-[#141E18] font-bold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cylinder sizes if gas */}
          {product.cylinder_sizes && (
            <div className="p-3 bg-[#EBF4EE] rounded-2xl border border-[#C5E1D0] text-xs text-[#0D3823]">
              <strong className="block font-bold mb-1">Formats &amp; Capacités Disponibles :</strong>
              <span>{product.cylinder_sizes}</span>
            </div>
          )}

          {/* Safety alert note */}
          <div className="p-3.5 bg-[#FCF3EE] rounded-2xl border border-[#F2D7CB] text-xs text-[#9C3814] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#C3643B] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Consignes de Sécurité Tenira Travaux :</strong>
              <span>
                Manipulation sécurisée avec équipements EPI adaptés (masque, gants ignifugés). Transport des bouteilles en position verticale amarrée avec chapeaux protecteurs. Éprouvage certifié 200 bar.
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#E8E1D5] bg-[#FAF7F2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-[#8C9890] block">Tarif Estimatif</span>
            <div className="flex items-baseline gap-1">
              {product.price_estimate > 0 ? (
                <>
                  <span className="text-2xl font-black text-[#141E18]">
                    {product.price_estimate.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xs font-bold text-[#0D3823]">MAD</span>
                </>
              ) : (
                <span className="text-base font-bold text-[#C3643B]">Sur Devis Spécifique</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleOrderAndClose}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
            >
              <Send className="w-3.5 h-3.5 text-emerald-300" />
              <span>Commander Express</span>
            </button>

            <button
              onClick={handleAddAndClose}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-white hover:bg-[#FAF7F2] text-[#141E18] border border-[#E8E1D5] font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <ShoppingCart className="w-3.5 h-3.5 text-[#0D3823]" />
              <span>Au Panier</span>
            </button>

            <a
              href={`https://wa.me/212661490495?text=${encodeURIComponent(
                `Bonjour M. Rachid BOUZAYD, je souhaite commander : ${product.name} (${product.unit}). Pouvez-vous me confirmer le stock et délai de livraison ?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

