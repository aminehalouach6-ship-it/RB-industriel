import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShoppingCart, 
  MessageCircle, 
  ShieldCheck, 
  Truck, 
  Check, 
  Share2, 
  FileCheck,
  Zap
} from 'lucide-react';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useCompany } from '../context/CompanyContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { addToCart, openCodModal } = useCart();
  const { company } = useCompany();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const prods = await fetchProducts();
      const found = prods.find(p => String(p.id) === id || p.slug === id);
      setProduct(found || null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-[#637067]">
        Chargement de la fiche produit...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-24 text-center space-y-3">
        <h2 className="text-xl font-bold text-[#141E18]">Produit Introuvable</h2>
        <p className="text-xs text-[#637067]">Ce produit n'existe pas ou a été retiré du catalogue.</p>
        <Link to="/categories" className="text-xs font-bold text-[#0D3823] underline">
          Retour au catalogue complet
        </Link>
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const getWhatsAppUrl = () => {
    const raw = company?.whatsapp_phone || "212700950064";
    let phone = raw.replace(/[^0-9]/g, '');
    if (phone.startsWith('0')) {
      phone = '212' + phone.slice(1);
    }
    const mgr = company?.manager_name || 'Rachid BOUZAYD';
    const text = `Bonjour M. ${mgr}, je souhaite des informations / commander : *${product.name}* (Qté: ${quantity}).`;
    return `https://wa.me/${phone || '212700950064'}?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-[#637067]">
        <Link to="/" className="hover:text-[#0D3823]">Accueil</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-[#0D3823]">Catalogue</Link>
        <span>/</span>
        <span className="text-[#141E18] truncate max-w-xs">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Product Visual Presentation */}
        <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-6 text-center">
          <div className="w-full h-80 bg-gradient-to-tr from-[#0D3823] to-[#1E5236] rounded-2xl flex flex-col items-center justify-center text-white p-8 relative overflow-hidden shadow-inner">
            <img 
              src={product.image_url || "/logo_rb_industriale.png"} 
              alt={product.name} 
              className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white/20" 
            />
            <span className="mt-4 text-xs uppercase font-mono tracking-widest text-[#C3643B] font-bold">
              RB INDUSTRIEL TIT MELLIL
            </span>
            <p className="text-sm font-bold text-white mt-1 max-w-xs">{product.name}</p>
            {product.badge && (
              <span className="absolute top-4 right-4 text-[10px] font-bold bg-[#C3643B] text-white px-3 py-1 rounded-full uppercase">
                {product.badge}
              </span>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5]">
              <span className="text-[10px] text-[#8C9890] uppercase block">Conditionnement</span>
              <strong className="text-[#141E18]">{product.unit}</strong>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5]">
              <span className="text-[10px] text-[#8C9890] uppercase block">Disponibilité</span>
              <strong className="text-emerald-700">En Stock</strong>
            </div>
            <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5]">
              <span className="text-[10px] text-[#8C9890] uppercase block">Dépôt</span>
              <strong className="text-[#141E18]">Tit Mellil</strong>
            </div>
          </div>
        </div>

        {/* Right: Technical Specs & Ordering */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C3643B]">
              RÉFÉRENCE CERTIFIÉE PRO
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#141E18] leading-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-[#637067] leading-relaxed">
              {product.description || product.short_desc}
            </p>
          </div>

          {/* Price Box */}
          <div className="p-5 bg-white rounded-2xl border border-[#E8E1D5] flex items-baseline justify-between shadow-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#8C9890] block font-mono">Tarif Hors Taxes</span>
              <div className="flex items-baseline gap-1">
                {product.price_estimate > 0 ? (
                  <>
                    <span className="text-3xl font-black text-[#0D3823]">
                      {(product.price_estimate * quantity).toLocaleString('fr-FR')}
                    </span>
                    <span className="text-sm font-bold text-[#0D3823]">MAD HT</span>
                  </>
                ) : (
                  <span className="text-base font-bold text-[#C3643B]">Sur Devis Spécifique</span>
                )}
              </div>
            </div>

            {/* Quantity Stepper */}
            <div className="flex items-center gap-2 bg-[#FAF7F2] p-1.5 rounded-xl border border-[#E8E1D5]">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-7 h-7 bg-white rounded-lg border border-[#E8E1D5] font-bold text-xs"
              >-</button>
              <span className="w-6 text-center font-bold text-xs">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-7 h-7 bg-white rounded-lg border border-[#E8E1D5] font-bold text-xs"
              >+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2.5">
            <div className="grid grid-cols-2 gap-3 text-xs">
              <button
                onClick={handleAdd}
                className={`py-3.5 px-4 rounded-full font-bold flex items-center justify-center gap-2 transition ${
                  added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-white hover:bg-[#FAF7F2] text-[#141E18] border border-[#E8E1D5]'
                }`}
              >
                {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                <span>{added ? 'Ajouté au Panier' : 'Ajouter au Panier'}</span>
              </button>

              <button
                onClick={() => openCodModal(product)}
                className="py-3.5 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold flex items-center justify-center gap-2 shadow-xs transition"
              >
                <Zap className="w-4 h-4" />
                <span>Commander 1 Clic</span>
              </button>
            </div>

            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-4 rounded-full bg-[#EBF4EE] hover:bg-[#DFEDE3] text-[#134D2E] font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Échanger avec M. Rachid BOUZAYD sur WhatsApp</span>
            </a>
          </div>

          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="space-y-3 pt-2 border-t border-[#E8E1D5]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#141E18] flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-[#0D3823]" />
                Spécifications Techniques
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specifications).map(([k, v]) => (
                  <div key={k} className="p-2.5 bg-white rounded-xl border border-[#E8E1D5] flex justify-between">
                    <span className="text-[#637067] font-medium">{k} :</span>
                    <span className="font-bold text-[#141E18]">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security note */}
          <div className="p-3.5 bg-[#FCF3EE] rounded-2xl border border-[#F2D7CB] text-xs text-[#8F3E1B] flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#C3643B]" />
            <div>
              <strong className="block font-bold">Sécurité RB INDUSTRIEL :</strong>
              <span>Bouteilles certifiées 200 bars d'épreuve. Transport et arrimage vertical obligatoires avec chapeau de protection.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
