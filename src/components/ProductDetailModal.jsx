import React from 'react';
import { X, CheckCircle, ShieldAlert, ShoppingCart, MessageCircle, Phone, FileCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductDetailModal({ product, onClose }) {
  if (!product) return null;

  const { addToCart } = useCart();

  const handleAddAndClose = () => {
    addToCart(product, 1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {product.unit}
            </span>
            {product.badge && (
              <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-tenira-800 border border-emerald-300">
                {product.badge}
              </span>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-tight">
              {product.name}
            </h2>
            <p className="text-xs text-emerald-700 font-semibold mt-1">
              TENIRA TRAVAUX • Tit Mellil, Casablanca
            </p>
          </div>

          <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Description &amp; Recommandations d'Utilisation
            </h4>
            <p>{product.description || product.short_desc}</p>
          </div>

          {/* Technical Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                Fiche Technique &amp; Caractéristiques
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-500 font-medium">{key} :</span>
                    <span className="text-slate-900 font-bold text-right">{val}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cylinder sizes if gas */}
          {product.cylinder_sizes && (
            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-emerald-950">
              <strong className="block font-bold mb-1">Formats &amp; Capacités Disponibles :</strong>
              <span>{product.cylinder_sizes}</span>
            </div>
          )}

          {/* Safety alert note */}
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Consignes de Sécurité Tenira Travaux :</strong>
              <span>
                Manipulation sécurisée avec équipements EPI adaptés (masque, gants ignifugés). Transport des bouteilles en position verticale amarrée avec chapeaux protecteurs.
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Tarif Conseillé</span>
            <div className="flex items-baseline gap-1">
              {product.price_estimate > 0 ? (
                <>
                  <span className="text-2xl font-black text-slate-900">
                    {product.price_estimate.toLocaleString('fr-FR')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">MAD HT</span>
                </>
              ) : (
                <span className="text-base font-bold text-tenira-700">Sur Devis Spécifique</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddAndClose}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-tenira-800 hover:bg-tenira-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Ajouter au Devis
            </button>

            <a
              href={`https://wa.me/212661490495?text=${encodeURIComponent(
                `Bonjour M. Rachid BOUZAYD, je souhaite commander : ${product.name} (${product.unit}). Pouvez-vous me confirmer le stock et délai de livraison ?`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition"
            >
              <MessageCircle className="w-4 h-4" />
              Commander WhatsApp
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
