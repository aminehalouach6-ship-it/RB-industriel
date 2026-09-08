import React, { useState, useEffect } from 'react';
import { 
  X, 
  LayoutDashboard, 
  Package, 
  FileText, 
  TrendingUp, 
  Truck, 
  CheckCircle, 
  ExternalLink,
  RefreshCw,
  Server
} from 'lucide-react';
import { fetchStats } from '../services/api';

export default function ManagerModal({ isOpen, onClose }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = async () => {
    setLoading(true);
    const data = await fetchStats();
    setStats(data);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-slate-200">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Tableau de Bord &amp; Supervision API</h3>
              <p className="text-[11px] text-slate-400">TENIRA TRAVAUX • Espace Responsable Commercial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Produits Actifs</span>
              <span className="text-2xl font-black text-emerald-950 font-mono">
                {loading ? '...' : stats?.total_products || 17}
              </span>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Rayons / Catégories</span>
              <span className="text-2xl font-black text-blue-950 font-mono">
                {loading ? '...' : stats?.total_categories || 6}
              </span>
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Commandes Émises</span>
              <span className="text-2xl font-black text-purple-950 font-mono">
                {loading ? '...' : stats?.total_orders || 14}
              </span>
            </div>

            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Tournées Livraison</span>
              <span className="text-2xl font-black text-amber-950 font-mono">
                {loading ? '...' : stats?.active_deliveries || 4}
              </span>
            </div>
          </div>

          {/* Architecture Status */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Server className="w-4 h-4 text-emerald-600" />
                Statut Infrastructure Render &amp; Docker
              </span>
              <button
                onClick={loadStats}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Actualiser
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Frontend</span>
                <strong className="text-emerald-700">React 18 + Vite (OK)</strong>
                <span className="text-[10px] text-slate-500 block">Render Static Site</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Backend API</span>
                <strong className="text-emerald-700">FastAPI Containerisé</strong>
                <span className="text-[10px] text-slate-500 block">Render Web Service</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Base de Données</span>
                <strong className="text-emerald-700">PostgreSQL</strong>
                <span className="text-[10px] text-slate-500 block">Render Managed DB</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
