import React, { useState, useEffect, useMemo } from 'react';
import { 
  Package, 
  Plus, 
  Trash2, 
  Edit3,
  RefreshCw, 
  CheckCircle, 
  ExternalLink,
  MessageCircle,
  Clock,
  Send,
  Phone,
  Truck,
  MapPin,
  Search,
  SlidersHorizontal,
  X,
  AlertCircle,
  TrendingUp,
  ShoppingBag,
  FileText,
  DollarSign,
  Lock,
  User,
  Eye,
  EyeOff,
  LogOut,
  ShieldCheck,
  Upload,
  Image as ImageIcon,
  Building2
} from 'lucide-react';
import { useCompany } from '../context/CompanyContext';
import { 
  fetchProducts, 
  fetchCategories, 
  fetchStats, 
  fetchOrders, 
  updateOrderStatus, 
  deleteOrder, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  fetchQuotes,
  adminLogin,
  changeAdminPassword,
  uploadProductImage
} from '../services/api';
import { Link } from 'react-router-dom';

const PRESET_IMAGES = [
  { label: 'Bouteille Oxygène B50', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80' },
  { label: 'Poste Inverter MMA 200A', url: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80' },
  { label: 'Poste MIG/MAG 250A', url: 'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=600&auto=format&fit=crop&q=80' },
  { label: 'Masque LCD Automatique', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80' },
  { label: 'Manodétendeur Blindé', url: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=80' },
  { label: 'Bobine Fil SG2 15kg', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&auto=format&fit=crop&q=80' },
];

const ORDER_STATUS_CONFIG = {
  'EN_ATTENTE': { label: 'En attente', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  'EN_COURS': { label: 'En préparation / Expédition', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  'LIVRE': { label: 'Livrée avec succès', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  'ANNULE': { label: 'Annulée', color: 'bg-rose-100 text-rose-800 border-rose-300' },
};

export default function AdminPage() {
  // Authentication State: Always require login upon accessing the admin
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState('admin');

  // Ensure any previous tokens are wiped so login is strictly required on every access
  useEffect(() => {
    localStorage.removeItem('tenira_admin_auth');
    localStorage.removeItem('tenira_admin_user');
    sessionStorage.removeItem('tenira_admin_auth');
    sessionStorage.removeItem('tenira_admin_user');
    setIsAuthenticated(false);
  }, []);

  // Login Form State
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [quotes, setQuotes] = useState([]);
  
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'quotes' | 'company'
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Company Settings & Logo from PostgreSQL
  const { company, updateCompany, uploadLogo, refreshCompany } = useCompany();
  const [companyForm, setCompanyForm] = useState(company);
  const [companySaving, setCompanySaving] = useState(false);
  const [companySuccessMsg, setCompanySuccessMsg] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);

  useEffect(() => {
    if (company) {
      setCompanyForm(company);
    }
  }, [company]);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setCompanySaving(true);
    setCompanySuccessMsg('');
    try {
      await updateCompany(companyForm);
      setCompanySuccessMsg('Paramètres officiels enregistrés avec succès dans PostgreSQL !');
      setTimeout(() => setCompanySuccessMsg(''), 4000);
    } catch (err) {
      alert('Erreur lors de la sauvegarde : ' + err.message);
    } finally {
      setCompanySaving(false);
    }
  };

  // Change Password State & Handler (PostgreSQL Backend)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError("Le nouveau mot de passe doit contenir au moins 4 caractères.");
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changeAdminPassword(adminUser || 'admin', currentPassword, newPassword);
      setPasswordSuccess(res.message || "Mot de passe modifié avec succès dans la base de données PostgreSQL !");
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 6000);
    } catch (err) {
      setPasswordError(err.message || "Erreur lors du changement de mot de passe.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    try {
      await uploadLogo(file);
      await refreshCompany();
      setCompanySuccessMsg('Nouveau logo téléversé et mis à jour dans PostgreSQL !');
      setTimeout(() => setCompanySuccessMsg(''), 4000);
    } catch (err) {
      alert('Erreur upload logo : ' + err.message);
    } finally {
      setLogoUploading(false);
    }
  };

  // Orders tracking filters
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  // Product filters
  const [productSearch, setProductSearch] = useState('');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form State
  const initialProductState = {
    name: '',
    slug: '',
    category_id: 1,
    short_desc: '',
    description: '',
    price_estimate: 0,
    unit: 'Bouteille B50 (10.5 m³)',
    in_stock: true,
    badge: 'Nouveau',
    gas_type: 'Oxygène',
    cylinder_sizes: 'B20 (4.2 m³), B50 (10.5 m³)',
    image_url: PRESET_IMAGES[0].url,
    specifications: { "Pression": "200 bars", "Pureté": "≥ 99.5%" }
  };

  const [productForm, setProductForm] = useState(initialProductState);

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleFileUpload = async (file, isEdit = false) => {
    if (!file) return;
    setUploadError('');
    setUploadingImage(true);
    try {
      const res = await uploadProductImage(file);
      if (res.success && res.url) {
        if (isEdit) {
          setEditingProduct(prev => ({ ...prev, image_url: res.url }));
        } else {
          setProductForm(prev => ({ ...prev, image_url: res.url }));
        }
        showToast("Photo importée avec succès sur le serveur Docker !");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadError(err.message || "Erreur lors de l'importation de la photo");
      showToast("Erreur lors de l'importation de la photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const data = await adminLogin(usernameInput, passwordInput);
      if (data.success) {
        setAdminUser(data.username);
        setIsAuthenticated(true);
        showToast("Connexion réussie à l'Espace Administrateur !");
      }
    } catch (err) {
      setLoginError(err.message || "Nom d'utilisateur ou mot de passe incorrect.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tenira_admin_auth');
    localStorage.removeItem('tenira_admin_user');
    sessionStorage.removeItem('tenira_admin_auth');
    sessionStorage.removeItem('tenira_admin_user');
    setIsAuthenticated(false);
    setUsernameInput('');
    setPasswordInput('');
    showToast("Déconnexion réussie.");
  };

  const loadAll = async () => {
    setLoading(true);
    try {
      const [s, p, c, o, q] = await Promise.all([
        fetchStats(),
        fetchProducts(),
        fetchCategories(),
        fetchOrders(),
        fetchQuotes()
      ]);
      setStats(s);
      setProducts(p);
      setCategories(c);
      setOrders(o);
      setQuotes(q);
    } catch (e) {
      console.error("Error loading admin data:", e);
      showToast("Erreur de connexion à l'API FastAPI/PostgreSQL");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAll();
    }
  }, [isAuthenticated]);


  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((ord) => {
      const matchStatus = orderStatusFilter === 'ALL' || ord.status === orderStatusFilter;
      const q = orderSearch.toLowerCase().trim();
      const matchSearch =
        !q ||
        ord.order_reference?.toLowerCase().includes(q) ||
        ord.customer_name?.toLowerCase().includes(q) ||
        ord.customer_phone?.toLowerCase().includes(q) ||
        ord.delivery_city?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, orderStatusFilter, orderSearch]);

  // Filtered Products (ordered newest first)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const q = productSearch.toLowerCase().trim();
      return !q || p.name.toLowerCase().includes(q) || (p.gas_type && p.gas_type.toLowerCase().includes(q));
    }).sort((a, b) => (b.id || 0) - (a.id || 0));
  }, [products, productSearch]);

  // Total calculated revenue
  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, ord) => acc + (ord.total_estimated || 0), 0);
  }, [orders]);

  // Handle Order Status Update (Live PostgreSQL PATCH)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Statut de la commande mis à jour : ${newStatus}`);
      // Update local state instantly
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la mise à jour du statut");
    }
  };

  // Handle Delete Order (Live PostgreSQL DELETE)
  const handleDeleteOrder = async (orderId, ref) => {
    if (!window.confirm(`Supprimer définitivement la commande ${ref} de PostgreSQL ?`)) return;
    try {
      await deleteOrder(orderId);
      showToast(`Commande ${ref} supprimée.`);
      setOrders(prev => prev.filter(o => o.id !== orderId));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  // Handle Create Product (Live PostgreSQL POST)
  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const slugVal = productForm.slug || productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const payload = {
        ...productForm,
        slug: slugVal,
        category_id: parseInt(productForm.category_id, 10),
        price_estimate: parseFloat(productForm.price_estimate) || 0
      };

      const created = await createProduct(payload);
      showToast('Nouveau produit inséré avec succès dans PostgreSQL !');
      setShowAddModal(false);
      setProductForm(initialProductState);
      
      // Placer immédiatement le nouveau produit en tête de liste (index 0)
      if (created && created.id) {
        setProducts(prev => [created, ...prev.filter(p => p.id !== created.id)]);
      }
      await loadAll();
    } catch (err) {
      console.error(err);
      alert(`Erreur création : ${err.message}`);
    }
  };

  // Handle Edit Product (Live PostgreSQL PUT)
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const payload = {
        ...editingProduct,
        category_id: parseInt(editingProduct.category_id, 10),
        price_estimate: parseFloat(editingProduct.price_estimate) || 0
      };

      await updateProduct(editingProduct.id, payload);
      showToast(`Produit ${editingProduct.name} mis à jour dans PostgreSQL !`);
      setEditingProduct(null);
      loadAll();
    } catch (err) {
      console.error(err);
      alert(`Erreur mise à jour : ${err.message}`);
    }
  };

  // Handle Delete Product (Live PostgreSQL DELETE)
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Voulez-vous supprimer définitivement "${name}" de la base PostgreSQL ?`)) return;
    try {
      await deleteProduct(id);
      showToast(`Produit "${name}" supprimé.`);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la suppression");
    }
  };

  // If not authenticated, show Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-[#FAF7F2]">
        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E1D5] shadow-2xl p-8 space-y-6">
          
          {/* Brand & Security Header */}
          <div className="text-center space-y-3">
            <div className="relative w-20 h-20 mx-auto">
              <img 
                src="/logo_rb_industriale.png" 
                alt="RB INDUSTRIALE" 
                className="w-20 h-20 rounded-full object-cover shadow-lg border-2 border-[#0D3823]/20" 
              />
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#0D3823] text-white rounded-full flex items-center justify-center shadow-md border-2 border-white">
                <Lock className="w-3.5 h-3.5 text-emerald-300" />
              </div>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C3643B]">
                RB INDUSTRIEL • TIT MELLIL
              </span>
              <h2 className="text-2xl font-black text-[#141E18] tracking-tight mt-1">
                Espace Administrateur
              </h2>
              <p className="text-xs text-[#637067] mt-1">
                Accès sécurisé pour le pilotage des stocks et le suivi des commandes clients.
              </p>
            </div>
          </div>

          {/* Error alert */}
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2 text-xs text-red-700 font-medium animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-[#141E18] mb-1.5">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Identifiant"
                  className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] text-xs font-semibold text-[#141E18] outline-none focus:border-[#0D3823] focus:ring-1 focus:ring-[#0D3823]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#141E18] mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] text-xs font-semibold text-[#141E18] outline-none focus:border-[#0D3823] focus:ring-1 focus:ring-[#0D3823]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9890] hover:text-[#141E18]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>


            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3.5 px-4 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {loginLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Connexion en cours...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Se Connecter à l'Administration</span>
                </>
              )}
            </button>
          </form>

          {/* Secure Portal Info */}
          <div className="p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5] text-[11px] text-[#637067] flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Portail d'administration sécurisé &bull; Authentification chiffrée</span>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs font-bold text-[#637067] hover:text-[#0D3823] hover:underline transition"
            >
              ← Retourner à la Boutique &amp; Catalogue
            </Link>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2] min-h-screen text-[#141E18] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#0D3823] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-fade-in border border-emerald-400">
            <CheckCircle className="w-4 h-4 text-emerald-300" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Header & Live Sync Status */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E8E1D5]">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] uppercase font-black tracking-wider text-[#0D3823]">
                PostgreSQL (port 5433) • FastAPI Live Sync
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-[#141E18] tracking-tight mt-1">
              Admin Studio <span className="italic font-normal text-[#C3643B]">• RB INDUSTRIEL</span>
            </h1>
            <p className="text-xs text-[#637067]">
              Pilotage direct des commandes, suivi logistique Tit Mellil &amp; gestion dynamique du catalogue.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/"
              className="px-4 py-2 rounded-full border border-[#E8E1D5] bg-white text-xs font-bold text-[#141E18] hover:bg-[#FAF7F2] transition shadow-xs"
            >
              ← Retour au Catalogue
            </Link>

            <button
              onClick={loadAll}
              disabled={loading}
              className="px-4 py-2 rounded-full border border-[#E8E1D5] bg-white text-xs font-bold text-[#4B574F] hover:bg-[#FAF7F2] flex items-center gap-1.5 transition shadow-xs cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualiser</span>
            </button>

            {/* Logged in admin badge */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#E8E1D5] text-xs font-bold text-[#0D3823]">
              <User className="w-3.5 h-3.5" />
              <span>{adminUser}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              title="Se déconnecter de l'administration"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>

        {/* 2. Real-Time KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#637067]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Commandes Enregistrées</span>
              <ShoppingBag className="w-4 h-4 text-[#0D3823]" />
            </div>
            <span className="text-3xl font-black text-[#141E18] block">{orders.length}</span>
            <span className="text-[11px] text-emerald-700 font-semibold">PostgreSQL Synchronisé</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#637067]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Chiffre d'Affaires Estimé</span>
              <DollarSign className="w-4 h-4 text-[#C3643B]" />
            </div>
            <span className="text-3xl font-black text-[#0D3823] block">
              {totalRevenue.toLocaleString('fr-FR')} <span className="text-xs font-bold">MAD</span>
            </span>
            <span className="text-[11px] text-[#637067]">Cumul commandes web &amp; COD</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#637067]">
              <span className="text-[10px] font-bold uppercase tracking-wider">Produits Actifs</span>
              <Package className="w-4 h-4 text-[#0D3823]" />
            </div>
            <span className="text-3xl font-black text-[#141E18] block">{products.length}</span>
            <span className="text-[11px] text-[#637067]">Gaz, Postes, Torches, EPI</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-1">
            <div className="flex items-center justify-between text-[#637067]">
              <span className="text-[10px] font-bold uppercase tracking-wider">À Préparer / Livrer</span>
              <Truck className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-3xl font-black text-amber-700 block">
              {orders.filter(o => o.status === 'EN_ATTENTE' || o.status === 'EN_COURS').length}
            </span>
            <span className="text-[11px] text-amber-800 font-semibold">Chantiers Grand Casablanca</span>
          </div>
        </div>

        {/* 3. Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-[#E8E1D5] pb-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-full transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'bg-[#0D3823] text-white shadow-xs' 
                : 'text-[#637067] hover:text-[#141E18] hover:bg-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Suivi &amp; Tracking des Commandes ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-full transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'products' 
                ? 'bg-[#0D3823] text-white shadow-xs' 
                : 'text-[#637067] hover:text-[#141E18] hover:bg-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Gestion des Produits &amp; Gaz ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('quotes')}
            className={`px-5 py-2.5 rounded-full transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'quotes' 
                ? 'bg-[#0D3823] text-white shadow-xs' 
                : 'text-[#637067] hover:text-[#141E18] hover:bg-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Devis Express ({quotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('company')}
            className={`px-5 py-2.5 rounded-full transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'company' 
                ? 'bg-[#0D3823] text-white shadow-xs' 
                : 'text-[#637067] hover:text-[#141E18] hover:bg-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Paramètres Entreprise &amp; Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-5 py-2.5 rounded-full transition cursor-pointer flex items-center gap-2 ${
              activeTab === 'security' 
                ? 'bg-[#0D3823] text-white shadow-xs' 
                : 'text-[#637067] hover:text-[#141E18] hover:bg-white'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Sécurité &amp; Mot de Passe</span>
          </button>
        </div>

        {/* 4. TAB CONTENT: ORDERS TRACKING */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Toolbar Filters for Orders */}
            <div className="bg-white p-4 rounded-3xl border border-[#E8E1D5] flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-[#8C9890] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Rechercher réf, client, téléphone, ville..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-[11px] font-bold">
                {[
                  { label: 'Toutes', val: 'ALL' },
                  { label: '⏳ En attente', val: 'EN_ATTENTE' },
                  { label: '🚚 En cours', val: 'EN_COURS' },
                  { label: '✅ Livrées', val: 'LIVRE' },
                  { label: '❌ Annulées', val: 'ANNULE' },
                ].map(tab => (
                  <button
                    key={tab.val}
                    onClick={() => setOrderStatusFilter(tab.val)}
                    className={`px-3 py-1.5 rounded-full transition cursor-pointer whitespace-nowrap ${
                      orderStatusFilter === tab.val
                        ? 'bg-[#141E18] text-white'
                        : 'bg-[#FAF7F2] text-[#637067] hover:bg-[#E8E1D5]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="bg-white p-12 text-center rounded-3xl border border-[#E8E1D5] space-y-2">
                <Truck className="w-10 h-10 text-[#8C9890] mx-auto" />
                <h3 className="font-bold text-sm text-[#141E18]">Aucune commande trouvée</h3>
                <p className="text-xs text-[#637067]">
                  {orderSearch || orderStatusFilter !== 'ALL' 
                    ? "Aucun résultat ne correspond à vos critères de recherche." 
                    : "Passez une commande test depuis le catalogue pour la voir s'afficher en direct !"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => {
                  const statusConf = ORDER_STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-slate-100 text-slate-800' };
                  const formattedDate = order.created_at ? new Date(order.created_at).toLocaleString('fr-FR') : 'Récent';

                  // Pre-filled WhatsApp message for customer
                  const waCustomerMsg = `Bonjour ${order.customer_name},\n` +
                    `Concernant votre commande ${order.order_reference} d'un montant de ${order.total_estimated} MAD chez RB INDUSTRIEL (Tit Mellil):\n` +
                    `Statut actuel : ${statusConf.label}.\n` +
                    `Notre équipe logistique reste à votre disposition.`;

                  const waUrl = `https://wa.me/${(order.customer_phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(waCustomerMsg)}`;

                  return (
                    <div 
                      key={order.id} 
                      className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-xs hover:border-[#0D3823]/40 transition space-y-4"
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#F0ECE3]">
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-black text-sm text-[#0D3823] bg-[#FAF7F2] px-3 py-1 rounded-full border border-[#E8E1D5]">
                            {order.order_reference}
                          </span>
                          <span className="text-xs text-[#8C9890] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formattedDate}
                          </span>
                        </div>

                        {/* Interactive Status Changer */}
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase font-bold text-[#8C9890]">Statut :</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                            className={`text-xs font-black px-3 py-1.5 rounded-full border cursor-pointer outline-none ${statusConf.color}`}
                          >
                            <option value="EN_ATTENTE">⏳ En Attente</option>
                            <option value="EN_COURS">🚚 En Préparation / Expédition</option>
                            <option value="LIVRE">✅ Livrée avec Succès</option>
                            <option value="ANNULE">❌ Annulée</option>
                          </select>
                        </div>
                      </div>

                      {/* Middle: Client Info & Logistics */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                        {/* Client details */}
                        <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D5]/70">
                          <span className="text-[10px] font-bold uppercase text-[#8C9890] block">Client &amp; Contact</span>
                          <p className="font-bold text-[#141E18] text-sm">{order.customer_name}</p>
                          {order.company_name && <p className="text-[#637067]">Société : {order.company_name}</p>}
                          <div className="flex items-center gap-3 pt-1">
                            <a 
                              href={`tel:${order.customer_phone}`}
                              className="font-mono text-[#0D3823] font-bold hover:underline flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3" />
                              {order.customer_phone}
                            </a>
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] flex items-center gap-1"
                            >
                              <MessageCircle className="w-3 h-3" />
                              WhatsApp
                            </a>
                          </div>
                        </div>

                        {/* Delivery details */}
                        <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D5]/70">
                          <span className="text-[10px] font-bold uppercase text-[#8C9890] block">Livraison &amp; Adresse</span>
                          <p className="font-bold text-[#141E18]">
                            {order.delivery_mode === 'RETRAIT' ? '🏢 Retrait Dépôt Tit Mellil' : '🚚 Livraison Chantier / Site'}
                          </p>
                          <p className="text-[#637067]">Ville : <strong>{order.delivery_city}</strong></p>
                          {order.delivery_address && (
                            <p className="text-[#637067] line-clamp-1">Adresse : {order.delivery_address}</p>
                          )}
                        </div>

                        {/* Total & Action */}
                        <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-[#E8E1D5]/70 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-[#8C9890] block">Montant Estimé</span>
                            <span className="text-xl font-black text-[#141E18]">
                              {order.total_estimated?.toLocaleString('fr-FR')} <span className="text-xs text-[#0D3823]">MAD</span>
                            </span>
                            <span className="text-[10px] text-[#637067] block">Paiement à la livraison (COD)</span>
                          </div>

                          <div className="pt-2 flex justify-end">
                            <button
                              onClick={() => handleDeleteOrder(order.id, order.order_reference)}
                              className="text-slate-400 hover:text-red-600 text-[11px] font-bold flex items-center gap-1 transition"
                              title="Supprimer la commande"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Supprimer</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Items table */}
                      {order.items && order.items.length > 0 && (
                        <div className="bg-white rounded-2xl border border-[#F0ECE3] overflow-hidden">
                          <table className="w-full text-left text-xs">
                            <thead className="bg-[#FAF7F2] text-[10px] uppercase font-bold text-[#8C9890]">
                              <tr>
                                <th className="p-2.5">Article Commandé</th>
                                <th className="p-2.5 text-center">Quantité</th>
                                <th className="p-2.5 text-right">Prix Unitaire</th>
                                <th className="p-2.5 text-right">Total Ligne</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-[#F0ECE3]">
                              {order.items.map((it, idx) => (
                                <tr key={idx}>
                                  <td className="p-2.5 font-semibold text-[#141E18]">{it.product_name}</td>
                                  <td className="p-2.5 text-center font-bold">{it.quantity}</td>
                                  <td className="p-2.5 text-right text-[#637067]">{it.unit_price} MAD</td>
                                  <td className="p-2.5 text-right font-black text-[#0D3823]">
                                    {(it.quantity * it.unit_price).toLocaleString('fr-FR')} MAD
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* 5. TAB CONTENT: PRODUCTS CRUD MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-xs space-y-6">
            
            {/* Header Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0ECE3]">
              <div>
                <h2 className="text-lg font-black text-[#141E18]">Gestion du Catalogue en Base PostgreSQL</h2>
                <p className="text-xs text-[#637067]">
                  Ajoutez, modifiez ou supprimez des références de gaz et matériels de soudage.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-[#8C9890] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Filtrer les produits..."
                    className="pl-9 pr-3 py-2 text-xs bg-[#FAF7F2] rounded-full border border-[#E8E1D5] outline-none"
                  />
                </div>

                <button
                  onClick={() => {
                    setProductForm(initialProductState);
                    setShowAddModal(true);
                  }}
                  className="px-5 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Nouveau Produit</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-[#8C9890] border-b border-[#F0ECE3]">
                    <th className="pb-3">Produit</th>
                    <th className="pb-3">Catégorie</th>
                    <th className="pb-3">Format / Unité</th>
                    <th className="pb-3">Prix (MAD)</th>
                    <th className="pb-3">Disponibilité</th>
                    <th className="pb-3">Badge</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE3]">
                  {filteredProducts.map((p) => {
                    const catName = p.category?.name || categories.find(c => c.id === p.category_id)?.name || 'Général';
                    return (
                      <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition">
                        <td className="py-3 pr-2">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.image_url || PRESET_IMAGES[0].url}
                              alt={p.name}
                              className="w-10 h-10 object-cover rounded-xl border border-[#E8E1D5]"
                            />
                            <div>
                              <span className="font-bold text-[#141E18] block">{p.name}</span>
                              {p.gas_type && (
                                <span className="text-[10px] text-[#0D3823] font-mono">Gaz : {p.gas_type}</span>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 text-[#637067] font-semibold">{catName}</td>
                        <td className="py-3 font-mono text-[#4B574F]">{p.unit}</td>
                        <td className="py-3 font-black text-[#0D3823]">
                          {p.price_estimate > 0 ? `${p.price_estimate.toLocaleString('fr-FR')} MAD` : 'Sur Devis'}
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            p.in_stock ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {p.in_stock ? 'En stock' : 'Rupture'}
                          </span>
                        </td>
                        <td className="py-3">
                          {p.badge && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#FCF3EE] text-[#C3643B] border border-[#F2D7CB]">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingProduct(p)}
                              className="p-1.5 text-slate-500 hover:text-[#0D3823] hover:bg-[#E8E1D5] rounded-lg transition"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Supprimer de PostgreSQL"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* 6. TAB CONTENT: QUOTES */}
        {activeTab === 'quotes' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#141E18]">Demandes de Devis Express Reçues</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[10px] uppercase font-bold text-[#8C9890] border-b border-[#F0ECE3]">
                    <th className="pb-2">Réf Devis</th>
                    <th className="pb-2">Client</th>
                    <th className="pb-2">Téléphone</th>
                    <th className="pb-2">Ville</th>
                    <th className="pb-2">Total Estimé</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECE3]">
                  {quotes.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="py-6 text-center text-[#8C9890]">
                        Aucune demande de devis enregistrée pour l'instant.
                      </td>
                    </tr>
                  ) : (
                    quotes.map(q => (
                      <tr key={q.id}>
                        <td className="py-3 font-mono font-bold text-[#C3643B]">{q.quote_reference}</td>
                        <td className="py-3 font-semibold">{q.client_name}</td>
                        <td className="py-3 font-mono">{q.phone}</td>
                        <td className="py-3">{q.city}</td>
                        <td className="py-3 font-bold">{q.estimated_total?.toLocaleString('fr-FR')} MAD</td>
                        <td className="py-3 text-right">
                          <a
                            href={`https://wa.me/${(q.phone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(q.client_name)},%20concernant%20votre%20devis%20${q.quote_reference}%20chez%20RB%20INDUSTRIEL.`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] hover:bg-emerald-700 inline-flex items-center gap-1"
                          >
                            <MessageCircle className="w-3 h-3" />
                            WhatsApp
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. TAB CONTENT: COMPANY SETTINGS & LOGO (POSTGRESQL) */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-3xl border border-[#E8E1D5] shadow-xs p-6 sm:p-8 space-y-6">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#E8E1D5] gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] uppercase font-black tracking-wider text-[#0D3823]">
                    PostgreSQL (Table: company_settings) • FastAPI Live
                  </span>
                </div>
                <h2 className="text-2xl font-black text-[#141E18] tracking-tight mt-1">
                  Identité de Marque &amp; Paramètres Officiels
                </h2>
                <p className="text-xs text-[#637067] mt-0.5">
                  Toutes les informations enregistrées ici sont immédiatement stockées en base de données et affichées en direct sur le site web.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] text-xs font-mono text-[#0D3823] font-bold self-start">
                ID Config : #{companyForm?.id || 1}
              </div>
            </div>

            {/* Success Alert Banner */}
            {companySuccessMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-xs text-emerald-800 font-bold animate-fade-in shadow-xs">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>{companySuccessMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSaveCompany} className="space-y-6">
              
              {/* Logo Section */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] space-y-4">
                <span className="text-[11px] uppercase font-bold text-[#637067] tracking-wider block">
                  1. Logo Officiel de l'Entreprise
                </span>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Current Logo Preview */}
                  <div className="relative group shrink-0">
                    <img
                      src={companyForm?.logo_url || '/logo_rb_industriale.png'}
                      alt="Logo RB INDUSTRIEL"
                      className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-white bg-white"
                    />
                    <span className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-[#0D3823] text-white text-[9px] font-black rounded-full uppercase">
                      Actif
                    </span>
                  </div>

                  {/* Upload Controls */}
                  <div className="space-y-2 text-center sm:text-left">
                    <h4 className="font-bold text-xs text-[#141E18]">
                      Téléverser une nouvelle image de logo
                    </h4>
                    <p className="text-[11px] text-[#637067]">
                      L'image sera stockée dans le volume Docker persistant et l'URL sera automatiquement enregistrée dans PostgreSQL.
                    </p>
                    
                    <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#E8E1D5] hover:border-[#0D3823] text-[#141E18] text-xs font-bold shadow-xs cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5 text-[#0D3823]" />
                      <span>{logoUploading ? "Téléversement vers Docker..." : "📁 Choisir une nouvelle photo de logo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        disabled={logoUploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Grid: Identité & Coordonnées */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                
                {/* Nom Commercial */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Nom Commercial de l'Entreprise <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={companyForm?.company_name || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, company_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823] font-bold"
                  />
                  <span className="text-[10px] text-[#8C9890]">Affiché dans l'en-tête, le titre et les cartes</span>
                </div>

                {/* Raison Sociale */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Raison Sociale / Statut Juridique
                  </label>
                  <input
                    type="text"
                    value={companyForm?.legal_name || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, legal_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                  <span className="text-[10px] text-[#8C9890]">Ex: RB INDUSTRIEL S.A.R.L</span>
                </div>

                {/* Gérant */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Nom &amp; Prénom du Gérant
                  </label>
                  <input
                    type="text"
                    value={companyForm?.manager_name || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, manager_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                  <span className="text-[10px] text-[#8C9890]">M. Rachid BOUZAYD</span>
                </div>

                {/* Slogan / Activité */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Slogan / Activité Principale
                  </label>
                  <input
                    type="text"
                    value={companyForm?.tagline || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                  <span className="text-[10px] text-[#8C9890]">Gaz Industriels &amp; Matériel de Soudage • Tit Mellil</span>
                </div>

                {/* GSM Principal */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Téléphone GSM Principal
                  </label>
                  <input
                    type="text"
                    value={companyForm?.phone_main || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone_main: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823] font-mono"
                  />
                </div>

                {/* Téléphone Fixe */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Téléphone Fixe (Atelier / Comptoir)
                  </label>
                  <input
                    type="text"
                    value={companyForm?.phone_fixed || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, phone_fixed: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823] font-mono"
                  />
                </div>

                {/* WhatsApp */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Numéro WhatsApp (Format international sans +)
                  </label>
                  <input
                    type="text"
                    value={companyForm?.whatsapp_phone || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, whatsapp_phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823] font-mono"
                  />
                  <span className="text-[10px] text-[#8C9890]">Ex: 212700950064</span>
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Email Officiel
                  </label>
                  <input
                    type="email"
                    value={companyForm?.email || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                </div>

                {/* Adresse */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Adresse Officielle Complète
                  </label>
                  <input
                    type="text"
                    value={companyForm?.address || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                </div>

                {/* Ville */}
                <div className="md:col-span-2 space-y-1.5">
                  <label className="font-bold text-[#141E18]">
                    Ville / Dépôt
                  </label>
                  <input
                    type="text"
                    value={companyForm?.city || ''}
                    onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                </div>

              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-[#E8E1D5] flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={companySaving}
                  className="px-6 py-3 rounded-2xl bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs shadow-md transition hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>{companySaving ? "Enregistrement dans PostgreSQL..." : "💾 Enregistrer dans la Base de Données (PostgreSQL)"}</span>
                </button>
              </div>

            </form>

          </div>
        )}

        {/* 5. TAB CONTENT: SECURITY & DATABASE AUTHENTICATION */}
        {activeTab === 'security' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8E1D5] shadow-xs space-y-6 max-w-3xl">
            
            <div className="flex items-start justify-between gap-4 border-b border-[#E8E1D5] pb-5">
              <div>
                <span className="text-[10px] font-bold text-[#C3643B] uppercase tracking-wider block">
                  Sécurité &amp; Authentification Backend
                </span>
                <h3 className="text-xl font-serif font-bold text-[#141E18]">
                  Gestion du Mot de Passe Administrateur
                </h3>
                <p className="text-xs text-[#637067] mt-1">
                  L'authentification est directement traitée par le backend FastAPI et stockée de manière sécurisée (hash PBKDF2) dans votre base de données PostgreSQL.
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#0D3823] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Lock className="w-6 h-6 text-emerald-300" />
              </div>
            </div>

            {/* Database status banner */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8E1D5] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <div>
                  <span className="font-bold text-[#141E18] block">Moteur d'Authentification : PostgreSQL</span>
                  <span className="text-[#637067]">Session active &bull; Identifiants gérés côté serveur</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                En Ligne &amp; Synchronisé
              </span>
            </div>

            {/* Notifications */}
            {passwordSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>{passwordSuccess}</span>
              </div>
            )}

            {passwordError && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {/* Password Change Form */}
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">

              <div>
                <label className="font-bold text-[#141E18] block mb-1.5">
                  Mot de passe actuel *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Saisissez votre mot de passe actuel"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9890] hover:text-[#141E18]"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#141E18] block mb-1.5">
                    Nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 4 caractères"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9890] hover:text-[#141E18]"
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#141E18] block mb-1.5">
                    Confirmer le nouveau mot de passe *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#8C9890] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmez le nouveau mot de passe"
                      className="w-full pl-10 pr-10 py-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8E1D5] outline-none focus:border-[#0D3823]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C9890] hover:text-[#141E18]"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E8E1D5] flex items-center justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-6 py-3 rounded-2xl bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs shadow-md transition hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {passwordLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Mise à jour dans PostgreSQL...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-emerald-300" />
                      <span>Enregistrer le Nouveau Mot de Passe dans PostgreSQL</span>
                    </>
                  )}
                </button>
              </div>
            </form>

          </div>
        )}

      </div>

      {/* MODAL: AJOUTER UN PRODUIT DANS POSTGRESQL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E8E1D5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
              <h3 className="font-black text-base text-[#141E18]">Ajouter un Produit dans PostgreSQL</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C9890] hover:text-[#141E18]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nom du Produit *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Gaz Argon Pur 5.0 B50"
                  value={productForm.name}
                  onChange={e => {
                    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setProductForm({ ...productForm, name: e.target.value, slug });
                  }}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none focus:border-[#0D3823]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Catégorie *</label>
                  <select
                    value={productForm.category_id}
                    onChange={e => setProductForm({ ...productForm, category_id: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold block mb-1">Prix Estimatif (MAD)</label>
                  <input
                    type="number"
                    value={productForm.price_estimate}
                    onChange={e => setProductForm({ ...productForm, price_estimate: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Unité / Contenance</label>
                  <input
                    type="text"
                    placeholder="Bouteille B50 (10.5 m³)"
                    value={productForm.unit}
                    onChange={e => setProductForm({ ...productForm, unit: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Type de Gaz (si applicable)</label>
                  <select
                    value={productForm.gas_type}
                    onChange={e => setProductForm({ ...productForm, gas_type: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  >
                    <option value="Oxygène">Oxygène (O2)</option>
                    <option value="Argon">Argon (Ar)</option>
                    <option value="CO2">CO2</option>
                    <option value="Azote">Azote (N2)</option>
                    <option value="Mélange Ar/CO2">Mélange Ar/CO2</option>
                    <option value="Acétylène">Acétylène</option>
                    <option value="">Autre / N/A</option>
                  </select>
                </div>
              </div>

              {/* Image Upload & Selection Block */}
              <div className="space-y-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#141E18] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0D3823]" />
                    <span>Photo du Produit</span>
                  </label>
                  {productForm.image_url && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      ✓ Photo prête
                    </span>
                  )}
                </div>

                {/* Direct File Upload from Computer / Device */}
                <div className="space-y-2">
                  <label className="flex flex-col sm:flex-row items-center justify-center gap-3 p-4 bg-white hover:bg-[#F4EFE7] border-2 border-dashed border-[#0D3823]/35 hover:border-[#0D3823] rounded-2xl cursor-pointer transition group shadow-xs">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], false);
                      }}
                      disabled={uploadingImage}
                    />
                    <div className="w-10 h-10 rounded-full bg-[#EBF4EE] text-[#0D3823] flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                      {uploadingImage ? (
                        <RefreshCw className="w-5 h-5 animate-spin" />
                      ) : (
                        <Upload className="w-5 h-5" />
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-xs text-[#141E18]">
                        {uploadingImage ? "Téléversement vers Docker en cours..." : "Cliquez pour importer une photo depuis votre appareil"}
                      </p>
                      <p className="text-[10px] text-[#637067]">
                        Formats acceptés : JPG, PNG, WEBP, SVG (Max 10 Mo) • Sauvegarde automatique sur Docker
                      </p>
                    </div>
                  </label>

                  {/* Thumbnail Preview */}
                  {productForm.image_url && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#E8E1D5]">
                      <div className="w-12 h-12 rounded-lg border border-[#E8E1D5] overflow-hidden bg-[#FAF7F2] shrink-0">
                        <img
                          src={productForm.image_url}
                          alt="Aperçu photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#141E18] truncate">
                          {productForm.image_url.startsWith('/api/uploads/') ? "Photo importée sur le serveur" : "Image configurée"}
                        </p>
                        <p className="text-[10px] font-mono text-[#637067] truncate">
                          {productForm.image_url}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image_url: '' })}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs"
                        title="Supprimer la photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-[11px] text-red-600 font-medium bg-red-50 p-2 rounded-lg border border-red-200">
                      {uploadError}
                    </p>
                  )}
                </div>

                {/* Saisie d'URL Personnalisée */}
                <div className="pt-1">
                  <label className="font-bold block mb-1 text-[#637067] text-[11px]">
                    Ou coller une URL d'image personnalisée :
                  </label>
                  <input
                    type="text"
                    placeholder="https://... ou /api/uploads/..."
                    value={productForm.image_url}
                    onChange={e => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full p-2 bg-white border border-[#E8E1D5] rounded-xl outline-none font-mono text-[10px] focus:border-[#0D3823]"
                  />
                </div>

                {/* Presets */}
                <div>
                  <span className="text-[10px] text-[#637067] font-semibold block mb-1">
                    Ou sélectionner une photo préconfigurée :
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {PRESET_IMAGES.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setProductForm({ ...productForm, image_url: img.url })}
                        className={`p-1.5 rounded-xl border text-[10px] font-bold text-center truncate transition cursor-pointer ${
                          productForm.image_url === img.url 
                            ? 'bg-[#0D3823] text-white border-[#0D3823]' 
                            : 'bg-white border-[#E8E1D5] text-[#4B574F] hover:bg-[#FAF7F2]'
                        }`}
                      >
                        {img.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Badge (optionnel)</label>
                  <input
                    type="text"
                    placeholder="Top Vente, 200 Bar..."
                    value={productForm.badge}
                    onChange={e => setProductForm({ ...productForm, badge: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  />
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={productForm.in_stock}
                      onChange={e => setProductForm({ ...productForm, in_stock: e.target.checked })}
                      className="rounded text-[#0D3823]"
                    />
                    <span className="font-bold">Disponible en stock</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description Courte</label>
                <textarea
                  rows="2"
                  value={productForm.short_desc}
                  onChange={e => setProductForm({ ...productForm, short_desc: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-[#637067] font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold shadow-xs cursor-pointer"
                >
                  Enregistrer dans PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: MODIFIER UN PRODUIT */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-[#E8E1D5] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-[#E8E1D5]">
              <h3 className="font-black text-base text-[#141E18]">Modifier le Produit #{editingProduct.id}</h3>
              <button onClick={() => setEditingProduct(null)} className="text-[#8C9890] hover:text-[#141E18]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold block mb-1">Nom du Produit</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold block mb-1">Prix Estimatif (MAD)</label>
                  <input
                    type="number"
                    value={editingProduct.price_estimate}
                    onChange={e => setEditingProduct({ ...editingProduct, price_estimate: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold block mb-1">Unité</label>
                  <input
                    type="text"
                    value={editingProduct.unit}
                    onChange={e => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 py-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.in_stock}
                    onChange={e => setEditingProduct({ ...editingProduct, in_stock: e.target.checked })}
                    className="rounded text-[#0D3823]"
                  />
                  <span className="font-bold">En Stock (Tit Mellil)</span>
                </label>
              </div>

              {/* Photo Upload & Preview for Edit Modal */}
              <div className="space-y-3 p-3.5 bg-[#FAF7F2] rounded-2xl border border-[#E8E1D5]">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#141E18] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#0D3823]" />
                    <span>Photo du Produit</span>
                  </label>
                  {editingProduct.image_url && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 font-bold">
                      ✓ Image associée
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="flex flex-col sm:flex-row items-center justify-center gap-3 p-3.5 bg-white hover:bg-[#F4EFE7] border-2 border-dashed border-[#0D3823]/35 hover:border-[#0D3823] rounded-2xl cursor-pointer transition group shadow-xs">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg, image/webp, image/svg+xml"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) handleFileUpload(e.target.files[0], true);
                      }}
                      disabled={uploadingImage}
                    />
                    <div className="w-9 h-9 rounded-full bg-[#EBF4EE] text-[#0D3823] flex items-center justify-center shrink-0 group-hover:scale-110 transition">
                      {uploadingImage ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                    </div>
                    <div className="text-center sm:text-left">
                      <p className="font-bold text-xs text-[#141E18]">
                        {uploadingImage ? "Téléversement vers Docker en cours..." : "Remplacer la photo depuis votre appareil"}
                      </p>
                      <p className="text-[10px] text-[#637067]">
                        Sauvegarde automatique dans le stockage persistant Docker
                      </p>
                    </div>
                  </label>

                  {/* Thumbnail Preview */}
                  {editingProduct.image_url && (
                    <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-[#E8E1D5]">
                      <div className="w-12 h-12 rounded-lg border border-[#E8E1D5] overflow-hidden bg-[#FAF7F2] shrink-0">
                        <img
                          src={editingProduct.image_url}
                          alt="Aperçu photo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-bold text-[#141E18] truncate">
                          {editingProduct.image_url.startsWith('/api/uploads/') ? "Photo importée sur le serveur" : "Image configurée"}
                        </p>
                        <p className="text-[10px] font-mono text-[#637067] truncate">
                          {editingProduct.image_url}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, image_url: '' })}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs"
                        title="Supprimer la photo"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] text-[#637067] font-semibold block mb-1">
                    Ou URL personnalisée :
                  </label>
                  <input
                    type="text"
                    value={editingProduct.image_url || ''}
                    onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                    className="w-full p-2 bg-white border border-[#E8E1D5] rounded-xl outline-none font-mono text-[10px] focus:border-[#0D3823]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold block mb-1">Description</label>
                <textarea
                  rows="3"
                  value={editingProduct.short_desc || editingProduct.description || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, short_desc: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF7F2] border border-[#E8E1D5] rounded-xl outline-none"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-[#E8E1D5]">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 text-[#637067] font-bold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold shadow-xs cursor-pointer"
                >
                  Mettre à Jour dans PostgreSQL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
