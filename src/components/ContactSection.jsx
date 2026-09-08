import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle,
  Building2
} from 'lucide-react';
import { submitContact } from '../services/api';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'Demande de renseignement / Devis',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.message) {
      alert('Veuillez remplir les champs obligatoires.');
      return;
    }

    setLoading(true);
    try {
      await submitContact(formData);
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'Demande de renseignement / Devis',
        message: ''
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 bg-white border-t border-[#E8E1D5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="space-y-2 mb-10">
          <div className="flex items-center gap-2">
            <span className="w-5 h-[2px] bg-[#C3643B]"></span>
            <span className="text-[11px] font-bold text-[#637067] uppercase tracking-widest">
              LOCALISATION &amp; COORDONNÉES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#141E18] tracking-tight">
            Contact &amp; Dépôt Central
          </h2>
          <p className="text-xs sm:text-sm text-[#637067] max-w-xl">
            Retrait sur place ou conseil technique avec notre équipe à Tit Mellil.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Coordinates */}
          <div className="lg:col-span-5 bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E8E1D5] space-y-6">
            <div>
              <span className="text-[10px] uppercase font-bold text-[#637067] tracking-wider block">Direction Générale</span>
              <h3 className="text-lg font-bold text-[#141E18] mt-0.5">M. Rachid BOUZAYD, Gérant</h3>
              <p className="text-xs text-[#637067]">TENIRA TRAVAUX S.A.R.L</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0D3823] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#141E18] block">Adresse Officielle :</span>
                  <span className="text-[#637067]">Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#0D3823] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#141E18] block">Téléphones GSM :</span>
                  <div className="grid grid-cols-2 gap-2 mt-1 font-mono text-[11px]">
                    <a href="tel:0661490495" className="text-[#0D3823] font-bold hover:underline">06 61 49 04 95</a>
                    <a href="tel:0700950064" className="text-[#4B574F] hover:underline">07 00 95 00 64</a>
                    <a href="tel:0690907488" className="text-[#4B574F] hover:underline">06 90 90 74 88</a>
                    <a href="tel:0695958627" className="text-[#4B574F] hover:underline">06 95 95 86 27</a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#637067] shrink-0" />
                <div>
                  <span className="font-bold text-[#141E18]">Fixe :</span>
                  <a href="tel:0522354868" className="ml-2 font-mono text-[#4B574F] hover:underline">05 22 35 48 68</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#637067] shrink-0" />
                <div>
                  <span className="font-bold text-[#141E18]">Email :</span>
                  <a href="mailto:teniratravaux@gmail.com" className="ml-2 font-mono text-[#0D3823] hover:underline">teniratravaux@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-2 border-t border-[#E8E1D5]">
                <Clock className="w-4 h-4 text-[#637067] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-[#141E18] block">Horaires :</span>
                  <span className="text-[#637067]">Lundi au Samedi : 08h00 - 19h30</span>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#FAF7F2] rounded-2xl p-6 sm:p-8 border border-[#E8E1D5]">
            <h3 className="font-bold text-base text-[#141E18] mb-1">
              Laisser un Message à l'Équipe
            </h3>
            <p className="text-xs text-[#637067] mb-6">
              Pour toute question sur la compatibilité d'un gaz ou une demande de devis sur mesure.
            </p>

            {submitted ? (
              <div className="p-6 bg-white rounded-xl border border-[#E8E1D5] text-center space-y-2">
                <CheckCircle className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-[#141E18]">Message Envoyé !</h4>
                <p className="text-xs text-[#637067]">Merci. M. Rachid BOUZAYD vous recontactera rapidement.</p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-3 text-xs font-bold text-[#0D3823] underline"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-[#141E18] block mb-1">Nom &amp; Prénom *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mohammed Alami"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#141E18] block mb-1">Téléphone / GSM *</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 06 61 49 04 95"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-white border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-[#141E18] block mb-1">Votre Message *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Précisez votre besoin (volume de bouteilles, poste recherché, lieu de livraison)..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 bg-white border border-[#E8E1D5] rounded-xl outline-none focus:ring-1 focus:ring-[#0D3823]"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2.5 rounded-full bg-[#0D3823] hover:bg-[#072416] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{loading ? 'Envoi...' : 'Envoyer le message'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
