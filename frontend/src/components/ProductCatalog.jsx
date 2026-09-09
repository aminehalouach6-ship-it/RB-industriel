import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Flame, 
  Zap, 
  Gauge, 
  ShieldCheck, 
  Disc, 
  Package, 
  Check, 
  ShoppingCart, 
  Info, 
  MessageCircle,
  SlidersHorizontal,
  ArrowRight
} from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function ProductCatalog({ onSelectProduct }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('tous');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchCat =
        selectedCategory === 'tous' ||
        (item.category && item.category.slug === selectedCategory) ||
        (item.category_id && categories.find(c => c.slug === selectedCategory)?.id === item.category_id);

      const matchSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.short_desc && item.short_desc.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.gas_type && item.gas_type.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchTerm, categories]);

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <section id="catalogue" className="py-16 bg-[#FAF7F2] border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header: Minimalist and Airy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-5 h-[2px] bg-[#0D3823]"></span>
              <span className="text-[11px] font-bold text-[#637067] uppercase tracking-widest">
                ÉQUIPEMENTS &amp; CONSOMMABLES
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#141E18] tracking-tight">
              Catalogue Gaz &amp; Soudage
            </h2>
            <p className="text-xs sm:text-sm text-[#637067] max-w-xl">
              Matériel professionnel certifié pour ateliers, chantiers navals et chaudronneries. 
              Stock permanent au dépôt de Tit Mellil.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full pl-10 pr-4 py-2 bg-white rounded-full border border-[#E8E1D5] text-xs text-[#141E18] placeholder-[#8C9890] focus:outline-none focus:ring-1 focus:ring-[#0D3823] transition shadow-xs"
            />
          </div>
        </div>

        {/* Category Pills: Clean StoreDeutsch Style */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('tous')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === 'tous'
                ? 'bg-[#0D3823] text-white shadow-xs'
                : 'bg-white text-[#4B574F] border border-[#E8E1D5] hover:bg-[#F4EFE7]'
            }`}
          >
            Tous les Produits
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat.slug
                  ? 'bg-[#0D3823] text-white shadow-xs'
                  : 'bg-white text-[#4B574F] border border-[#E8E1D5] hover:bg-[#F4EFE7]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="py-20 text-center text-[#637067] text-xs">
            <div className="w-6 h-6 border-2 border-[#0D3823] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Chargement des produits...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E1D5] p-8">
            <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-[#141E18]">Aucun produit trouvé</p>
            <button
              onClick={() => { setSelectedCategory('tous'); setSearchTerm(''); }}
              className="mt-3 text-xs text-[#0D3823] font-bold underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const isAdded = addedId === product.id;
              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl border border-[#E8E1D5] p-5 flex flex-col justify-between hover:shadow-soft hover:border-[#C3643B]/40 transition-all duration-300 group"
                >
                  <div className="space-y-3">
                    
                    {/* Top tags */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#637067] bg-[#FAF7F2] px-2.5 py-1 rounded-full border border-[#E8E1D5]">
                        {product.unit}
                      </span>
                      {product.badge && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-[#C3643B] bg-[#FCF3EE] px-2 py-0.5 rounded-full border border-[#F2D7CB]">
                          {product.badge}
                        </span>
                      )}
                    </div>

                    {/* Title & Short description */}
                    <div>
                      <h3 className="font-bold text-sm sm:text-base text-[#141E18] group-hover:text-[#0D3823] transition leading-snug">
                        {product.name}
                      </h3>
                      <p className="text-xs text-[#637067] mt-1.5 line-clamp-2 leading-relaxed">
                        {product.short_desc}
                      </p>
                    </div>

                    {/* Clean specs pills */}
                    {product.specifications && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {Object.entries(product.specifications).slice(0, 2).map(([k, v]) => (
                          <span key={k} className="text-[10px] bg-[#FAF7F2] text-[#4B574F] px-2 py-0.5 rounded-md border border-[#E8E1D5]/60">
                            <strong>{k}:</strong> {v}
                          </span>
                        ))}
                      </div>
                    )}

                  </div>

                  {/* Price & Action Row */}
                  <div className="pt-4 mt-4 border-t border-[#F0ECE3] flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-[#8C9890] block uppercase font-mono">Tarif Estimatif</span>
                      <div className="flex items-baseline gap-1">
                        {product.price_estimate > 0 ? (
                          <>
                            <span className="text-lg font-black text-[#141E18] font-sans">
                              {product.price_estimate.toLocaleString('fr-FR')}
                            </span>
                            <span className="text-xs font-bold text-[#0D3823]">MAD</span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-[#C3643B]">Sur Devis</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="p-2 text-[#637067] hover:text-[#0D3823] hover:bg-[#FAF7F2] rounded-full transition"
                        title="Fiche technique"
                      >
                        <Info className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleAddToCart(product)}
                        className={`px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#0D3823] hover:bg-[#072416] text-white shadow-xs'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Ajouté</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Au Panier</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}
