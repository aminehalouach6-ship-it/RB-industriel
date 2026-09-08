import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Info, 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  CheckCircle2, 
  Sparkles, 
  SlidersHorizontal,
  Flame, 
  Zap, 
  Package, 
  X,
  Send,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';
import { Link } from 'react-router-dom';

// High-quality imagery fallbacks matching industrial gaz & welding
const DEFAULT_IMAGES = {
  'gaz-industriels': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
  'postes-de-soudage': 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80',
  'torches-accessoires': 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80',
  'manodetendeurs-regulation': 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80',
  'consommables-fils': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80',
  'protection-epi': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
};

const GAS_BADGES = {
  'Oxygène': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', symbol: 'O₂' },
  'Argon': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200', symbol: 'Ar' },
  'CO2': { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-300', symbol: 'CO₂' },
  'Azote': { bg: 'bg-indigo-50', text: 'text-indigo-800', border: 'border-indigo-200', symbol: 'N₂' },
  'Acétylène': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200', symbol: 'C₂H₂' },
  'Mélange Ar/CO2': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200', symbol: 'Mix' }
};

export default function HomePage({ onOpenFlyer }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [selectedGas, setSelectedGas] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [sortBy, setSortBy] = useState('featured');

  // Detail Modal
  const [detailProduct, setDetailProduct] = useState(null);

  const { addToCart, openCodModal } = useCart();
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error("Error loading catalogue data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      const matchCat =
        selectedCategory === 'tous' ||
        (p.category && p.category.slug === selectedCategory) ||
        (p.category_id && categories.find(c => c.slug === selectedCategory)?.id === p.category_id);

      // Gas filter
      const matchGas = 
        selectedGas === 'tous' ||
        (p.gas_type && p.gas_type.toLowerCase().includes(selectedGas.toLowerCase()));

      // Stock filter
      const matchStock = !onlyInStock || p.in_stock;

      // Search filter
      const q = searchTerm.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.short_desc && p.short_desc.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.gas_type && p.gas_type.toLowerCase().includes(q));

      return matchCat && matchGas && matchStock && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price_estimate || 0) - (b.price_estimate || 0);
      if (sortBy === 'price_desc') return (b.price_estimate || 0) - (a.price_estimate || 0);
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, selectedCategory, selectedGas, onlyInStock, searchTerm, sortBy, categories]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#141E18]">
      
      {/* 1. Brand Store Header Banner with Gemini-generated atmospheric background */}
      <div className="relative border-b border-[#E8E1D5] overflow-hidden bg-[#FAF7F2] py-14 sm:py-20 lg:py-24">
        {/* Gemini Background Image with refined light overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/hero_bg.jpg"
            alt="Atelier industriel gaz et soudage Tenira Travaux"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000"
          />
          {/* Subtle light overlay so workshop background remains clearly visible and recognizable */}
          <div className="absolute inset-0 bg-[#FAF7F2]/25" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/30 via-transparent to-[#FAF7F2]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center justify-center space-y-6">
          
          {/* Text-Only Depôt Badge (No Icon) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D3823] text-white text-[11px] font-black uppercase tracking-wider shadow-md">
            <span>DÉPÔT OFFICIEL TIT MELLIL</span>
            <span className="opacity-40">•</span>
            <span className="text-emerald-300">CASABLANCA</span>
          </div>

          {/* Centered Welcome Title with Editorial Font Pairing */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.14] text-center max-w-3xl mx-auto drop-shadow-xs">
            <span className="font-sans font-black text-[#141E18]">Catalogue Gaz</span>{' '}
            <span className="font-serif italic font-medium text-[#C3643B]">&amp;</span><br />
            <span className="font-serif italic font-medium text-[#C3643B]">Matériel</span>{' '}
            <span className="font-serif font-bold text-[#141E18]">de Soudage</span><span className="font-serif font-bold text-[#C3643B]">.</span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-[#2D3830] font-medium max-w-2xl mx-auto leading-relaxed text-center drop-shadow-xs">
            Bouteilles d'oxygène, argon pur, CO2, azote 200 bar, postes à souder Inverter MMA LCD, torches et accessoires certifiés. Vente, recharge express et livraison sur chantier à Casablanca &amp; Tit Mellil.
          </p>

          {/* Structured & Professional Action Button (Catalogue only) */}
          <div className="pt-2">
            <a
              href="#catalogue"
              className="inline-flex items-center justify-center px-10 py-3.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white text-sm font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
            >
              Catalogue
            </a>
          </div>

        </div>
      </div>

      {/* 2. Interactive Search & Filters Toolbar */}
      <div id="catalogue" className="sticky top-20 z-30 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8E1D5] py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          
          {/* Main search and Sort row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par nom, molécule (O2, Argon, CO2), poste LCD, torche, détendeur..."
                className="w-full pl-10 pr-10 py-2.5 bg-white rounded-full border border-[#E8E1D5] text-xs text-[#141E18] placeholder-[#8C9890] focus:outline-none focus:ring-2 focus:ring-[#0D3823]/20 focus:border-[#0D3823] transition shadow-xs"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9890] hover:text-[#141E18]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* In stock toggle & Sort */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <label className="flex items-center gap-2 px-3 py-2 bg-white rounded-full border border-[#E8E1D5] text-xs font-semibold text-[#4B574F] cursor-pointer hover:bg-[#FAF7F2] transition select-none">
                <input
                  type="checkbox"
                  checked={onlyInStock}
                  onChange={(e) => setOnlyInStock(e.target.checked)}
                  className="rounded text-[#0D3823] focus:ring-0"
                />
                <span>En stock</span>
              </label>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-white rounded-full border border-[#E8E1D5] text-xs font-semibold text-[#4B574F] focus:outline-none focus:border-[#0D3823] transition shadow-xs"
              >
                <option value="featured">Tri : Recommandé</option>
                <option value="price_asc">Prix : Croissant</option>
                <option value="price_desc">Prix : Décroissant</option>
                <option value="name">Nom : A à Z</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('tous')}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'tous'
                  ? 'bg-[#0D3823] text-white shadow-xs'
                  : 'bg-white text-[#4B574F] border border-[#E8E1D5] hover:bg-[#F4EFE7]'
              }`}
            >
              Tous les Produits ({products.length})
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#0D3823] text-white shadow-xs'
                    : 'bg-white text-[#4B574F] border border-[#E8E1D5] hover:bg-[#F4EFE7]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick Gas Molecule Sub-filters (if in Gas category or Tous) */}
          {(selectedCategory === 'tous' || selectedCategory === 'gaz-industriels') && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none text-[11px]">
              <span className="text-[#8C9890] font-bold uppercase tracking-wider text-[9px] mr-1 hidden sm:inline">
                Filtre Gaz :
              </span>
              {[
                { label: 'Tous Gaz', val: 'tous' },
                { label: 'Oxygène (O₂)', val: 'Oxygène' },
                { label: 'Argon Pur (Ar)', val: 'Argon' },
                { label: 'CO₂ Industriel', val: 'CO2' },
                { label: 'Azote Sec (N₂)', val: 'Azote' },
                { label: 'Mélange Soudure', val: 'Mélange' },
                { label: 'Acétylène', val: 'Acétylène' },
              ].map((g) => (
                <button
                  key={g.val}
                  onClick={() => setSelectedGas(g.val)}
                  className={`px-2.5 py-1 rounded-lg font-bold transition whitespace-nowrap ${
                    selectedGas === g.val
                      ? 'bg-[#141E18] text-white'
                      : 'bg-[#EAE4D9] text-[#637067] hover:bg-[#E0D9CC]'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      {/* 3. Products Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Count indicator */}
        <div className="flex items-center justify-between mb-6 text-xs text-[#637067]">
          <span>
            Affichage de <strong>{filteredProducts.length}</strong> produit{filteredProducts.length > 1 ? 's' : ''} disponible{filteredProducts.length > 1 ? 's' : ''}
          </span>
          {(searchTerm || selectedCategory !== 'tous' || selectedGas !== 'tous' || onlyInStock) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('tous');
                setSelectedGas('tous');
                setOnlyInStock(false);
              }}
              className="text-[#C3643B] font-bold hover:underline"
            >
              Effacer tous les filtres
            </button>
          )}
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="py-24 text-center text-[#637067] text-xs">
            <div className="w-8 h-8 border-3 border-[#0D3823] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            <p className="font-bold">Chargement des produits depuis PostgreSQL...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#E8E1D5] p-8 space-y-3">
            <Package className="w-12 h-12 text-[#8C9890] mx-auto" />
            <h3 className="font-bold text-base text-[#141E18]">Aucun produit ne correspond à votre recherche</h3>
            <p className="text-xs text-[#637067] max-w-sm mx-auto">
              Essayez un autre mot-clé ou réinitialisez les filtres pour afficher l'ensemble des gaz et matériels de soudage.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('tous');
                setSelectedGas('tous');
                setOnlyInStock(false);
              }}
              className="px-5 py-2 rounded-full bg-[#0D3823] text-white font-bold text-xs"
            >
              Voir tout le catalogue
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              const catSlug = product.category?.slug || (categories.find(c => c.id === product.category_id)?.slug) || 'gaz-industriels';
              const imgUrl = product.image_url || DEFAULT_IMAGES[catSlug] || DEFAULT_IMAGES['gaz-industriels'];
              const gasBadge = product.gas_type && GAS_BADGES[product.gas_type];

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl border border-[#E8E1D5] overflow-hidden flex flex-col justify-between hover:shadow-lg hover:border-[#0D3823]/40 transition-all duration-300 group"
                >
                  <div>
                    {/* Visual Image Header */}
                    <div className="relative h-48 bg-[#F4EFE7] overflow-hidden">
                      <img
                        src={imgUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      
                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-1">
                        <span className="text-[10px] font-bold text-[#141E18] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full border border-[#E8E1D5] shadow-xs">
                          {product.unit}
                        </span>

                        {product.badge && (
                          <span className="text-[9px] font-black uppercase tracking-wider text-[#C3643B] bg-[#FCF3EE] px-2 py-0.5 rounded-full border border-[#F2D7CB] shadow-xs">
                            {product.badge}
                          </span>
                        )}
                      </div>

                      {/* Gas molecule pill on image */}
                      {gasBadge && (
                        <div className="absolute bottom-3 left-3">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${gasBadge.bg} ${gasBadge.text} ${gasBadge.border}`}>
                            {gasBadge.symbol} • {product.gas_type}
                          </span>
                        </div>
                      )}

                      {/* In stock badge */}
                      <div className="absolute bottom-3 right-3">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                          product.in_stock 
                            ? 'bg-emerald-100/90 text-emerald-800 border border-emerald-300' 
                            : 'bg-amber-100/90 text-amber-800 border border-amber-300'
                        }`}>
                          {product.in_stock ? '● En stock' : 'Sur commande'}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-bold text-sm text-[#141E18] group-hover:text-[#0D3823] transition line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      <p className="text-xs text-[#637067] line-clamp-2 leading-relaxed">
                        {product.short_desc || product.description}
                      </p>

                      {/* Specs pills */}
                      {product.specifications && Object.keys(product.specifications).length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {Object.entries(product.specifications).slice(0, 2).map(([k, v]) => (
                            <span key={k} className="text-[9px] bg-[#FAF7F2] text-[#4B574F] px-2 py-0.5 rounded-md border border-[#E8E1D5]">
                              <strong>{k}:</strong> {v}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Actions Footer */}
                  <div className="p-4 pt-3 border-t border-[#F0ECE3] bg-[#FAF7F2]/50 space-y-3">
                    
                    {/* Price and Details */}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-[#8C9890] block uppercase font-mono">Tarif Estimatif</span>
                        <div className="flex items-baseline gap-1">
                          {product.price_estimate > 0 ? (
                            <>
                              <span className="text-lg font-black text-[#141E18]">
                                {product.price_estimate.toLocaleString('fr-FR')}
                              </span>
                              <span className="text-xs font-bold text-[#0D3823]">MAD</span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-[#C3643B]">Sur Devis</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setDetailProduct(product)}
                        className="px-2.5 py-1 text-xs font-semibold text-[#0D3823] hover:underline flex items-center gap-1 cursor-pointer"
                        title="Voir fiche complète"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Fiche</span>
                      </button>
                    </div>

                    {/* CTAs: Commander Express & Add to cart */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openCodModal(product)}
                        className="w-full py-2 px-2 rounded-xl bg-[#0D3823] hover:bg-[#072416] text-white text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Send className="w-3 h-3 text-emerald-300" />
                        <span>Commander</span>
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`w-full py-2 px-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer border ${
                          isAdded
                            ? 'bg-emerald-600 text-white border-emerald-600'
                            : 'bg-white hover:bg-[#FAF7F2] text-[#141E18] border-[#E8E1D5]'
                        }`}
                      >
                        <ShoppingCart className="w-3 h-3 text-[#0D3823]" />
                        <span>{isAdded ? 'Ajouté !' : 'Panier'}</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. Complete Information Block: "Toutes les informations concernant ceci là" */}
      <div id="informations" className="border-t border-[#E8E1D5] bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#C3643B] block">
              DÉPÔT &amp; LOGISTIQUE OFFICIELS
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#141E18]">
              Toutes les Informations Pratiques <span className="italic font-normal text-[#C3643B]">• Tenira Travaux</span>
            </h2>
            <p className="text-xs text-[#637067]">
              Présentation complète de notre infrastructure, nos coordonnées directes et nos conditions d'approvisionnement en gaz industriels et soudure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
            
            {/* Card 1: Dépôt Tit Mellil */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E1D5] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0D3823] text-white flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#141E18]">Dépôt &amp; Enlèvement Comptoir</h3>
              <p className="text-[#637067] leading-relaxed">
                Situé à <strong>Tit Mellil, Casablanca</strong>. Comptoir d'enlèvement direct avec quai de chargement et sécurisation des bouteilles.
              </p>
              <div className="pt-2 border-t border-[#E8E1D5] text-[#0D3823] font-bold">
                ✓ Enlèvement immédiat sur place
              </div>
            </div>

            {/* Card 2: Horaires d'Ouverture */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E1D5] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0D3823] text-white flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#141E18]">Horaires d'Ouverture</h3>
              <p className="text-[#637067] leading-relaxed">
                <strong>Lundi au Samedi :</strong><br />
                08h00 - 18h30 sans interruption.<br />
                <strong>Dimanche :</strong> Permanence d'urgence chantiers sur appel.
              </p>
              <div className="pt-2 border-t border-[#E8E1D5] text-[#0D3823] font-bold">
                ✓ Service continu 6j/7
              </div>
            </div>

            {/* Card 3: Contact & Téléphones (Direct Flyer) */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E1D5] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C3643B] text-white flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#141E18]">Contacts Officiels (Flyer)</h3>
              <div className="text-[#637067] space-y-1">
                <p><strong>Gérant :</strong> M. Rachid BOUZAYD</p>
                <p className="font-mono text-[#0D3823] font-bold">📱 06 61 49 04 95 (WhatsApp)</p>
                <p className="font-mono">📱 07 00 95 00 64</p>
                <p className="font-mono">📱 06 90 90 74 88</p>
                <p className="font-mono">📱 06 95 95 86 27</p>
                <p className="font-mono">☎️ 05 22 35 48 68 (Fixe)</p>
                <p>✉️ <strong>teniratravaux@gmail.com</strong></p>
              </div>
            </div>

            {/* Card 4: Flotte & Livraison Grand Casa */}
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-[#E8E1D5] space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#0D3823] text-white flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#141E18]">Zones de Livraison 24h</h3>
              <p className="text-[#637067] leading-relaxed">
                Camions hayon élévateur desservant :<br />
                <strong>Tit Mellil, Sidi Bernoussi, Ain Sebaa, Oukacha, Mohammedia, Bouskoura, Nouaceur</strong> et tout le Grand Casablanca.
              </p>
              <div className="pt-2 border-t border-[#E8E1D5] text-[#0D3823] font-bold">
                ✓ Livraison sécurisée sur site
              </div>
            </div>

          </div>

          {/* Banner Contact Direct */}
          <div className="bg-[#0D3823] text-white p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <h3 className="text-xl font-black">Besoin d'un devis sur mesure ou d'une recharge urgente ?</h3>
              <p className="text-xs text-emerald-200">
                Contactez directement Rachid BOUZAYD pour une confirmation immédiate de disponibilité de vos bouteilles B50.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/212661490495?text=Bonjour%20M.%20BOUZAYD,%20je%20souhaite%20un%20devis%20imm%C3%A9diat%20pour%20des%20gaz%20ou%20du%20mat%C3%A9riel%20de%20soudage."
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-full bg-white hover:bg-[#FAF7F2] text-[#0D3823] font-bold text-xs flex items-center gap-2 shadow-md transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Contacter par WhatsApp</span>
              </a>

              <a
                href="tel:0661490495"
                className="px-6 py-3 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-2 transition"
              >
                <Phone className="w-4 h-4" />
                <span>Appeler : 06 61 49 04 95</span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
        />
      )}

    </div>
  );
}
