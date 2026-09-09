import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Package, ShoppingCart, ArrowRight, Zap, Check } from 'lucide-react';
import { fetchCategories, fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCat, setSelectedCat] = useState('tous');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [addedId, setAddedId] = useState(null);

  const { addToCart, openCodModal } = useCart();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [cats, prods] = await Promise.all([
        fetchCategories(),
        fetchProducts()
      ]);
      setCategories(cats);
      setProducts(prods);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const matchCat = selectedCat === 'tous' || 
        (p.category && p.category.slug === selectedCat) ||
        (p.category_id && categories.find(c => c.slug === selectedCat)?.id === p.category_id);

      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.short_desc && p.short_desc.toLowerCase().includes(search.toLowerCase()));

      return matchCat && matchSearch;
    });

    if (sortBy === 'price-asc') {
      list.sort((a, b) => a.price_estimate - b.price_estimate);
    } else if (sortBy === 'price-desc') {
      list.sort((a, b) => b.price_estimate - a.price_estimate);
    } else {
      list.sort((a, b) => (b.id || 0) - (a.id || 0));
    }

    return list;
  }, [products, selectedCat, search, sortBy, categories]);

  const handleAdd = (prod) => {
    addToCart(prod, 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#637067]">
          <Link to="/" className="hover:text-[#0D3823]">Accueil</Link>
          <span>/</span>
          <span className="text-[#141E18]">Catalogue Complet</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-[#141E18] tracking-tight">
          Tous les Produits &amp; Gaz Industriels
        </h1>
        <p className="text-xs sm:text-sm text-[#637067] max-w-2xl">
          Parcourez l'ensemble des 19 références certifiées disponibles au dépôt de Tit Mellil.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E8E1D5] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-[#8C9890] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher (ex: Oxygène, Inverter, Argon)..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF7F2] border border-[#E8E1D5] rounded-full outline-none focus:ring-1 focus:ring-[#0D3823]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs">
            <span className="text-[#637067]">Trier par :</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="p-1.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-lg text-xs font-semibold outline-none"
            >
              <option value="featured">Nouveautés d'abord</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
            </select>
          </div>
        </div>

        {/* Categories Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <button
            onClick={() => setSelectedCat('tous')}
            className={`px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
              selectedCat === 'tous'
                ? 'bg-[#0D3823] text-white shadow-xs'
                : 'bg-[#FAF7F2] text-[#4B574F] hover:bg-[#F4EFE7]'
            }`}
          >
            Tous les Rayons ({products.length})
          </button>

          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.slug)}
              className={`px-3.5 py-1.5 rounded-full transition whitespace-nowrap ${
                selectedCat === cat.slug
                  ? 'bg-[#0D3823] text-white shadow-xs'
                  : 'bg-[#FAF7F2] text-[#4B574F] hover:bg-[#F4EFE7]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-[#637067]">
          Chargement du catalogue...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-[#E8E1D5] p-6 space-y-2">
          <Package className="w-8 h-8 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-[#141E18]">Aucun article trouvé</h3>
          <p className="text-xs text-[#637067]">Modifiez vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const isAdded = addedId === p.id;
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-[#E8E1D5] p-5 flex flex-col justify-between hover:shadow-soft transition space-y-4"
              >
                <div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-[#637067] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#E8E1D5]">
                      {p.unit}
                    </span>
                    {p.badge && (
                      <span className="font-bold uppercase text-[#C3643B] bg-[#FCF3EE] px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </div>

                  <Link to={`/product/${p.slug || p.id}`}>
                    <h3 className="font-bold text-base text-[#141E18] hover:text-[#0D3823] transition mt-2">
                      {p.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-[#637067] mt-1 line-clamp-2">
                    {p.short_desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F0ECE3] space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-[#8C9890] uppercase">Tarif</span>
                    <span className="text-base font-black text-[#0D3823]">
                      {p.price_estimate > 0 ? `${p.price_estimate.toLocaleString('fr-FR')} MAD HT` : 'Sur Devis'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      onClick={() => handleAdd(p)}
                      className={`py-2 px-3 rounded-full font-bold flex items-center justify-center gap-1 transition ${
                        isAdded 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-[#FAF7F2] hover:bg-[#F4EFE7] text-[#141E18] border border-[#E8E1D5]'
                      }`}
                    >
                      {isAdded ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
                      <span>{isAdded ? 'Ajouté' : 'Au Panier'}</span>
                    </button>

                    <button
                      onClick={() => openCodModal(p)}
                      className="py-2 px-3 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold flex items-center justify-center gap-1 transition"
                    >
                      <span>1 Clic ⚡</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
