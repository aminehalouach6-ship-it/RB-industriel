import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCompanySettings, updateCompanySettings as apiUpdateCompany, uploadCompanyLogo as apiUploadLogo } from '../services/api';

const CompanyContext = createContext();

export function CompanyProvider({ children }) {
  const [company, setCompany] = useState({
    company_name: "RB INDUSTRIEL",
    legal_name: "RB INDUSTRIEL S.A.R.L",
    manager_name: "Rachid BOUZAYD",
    tagline: "Gaz Industriels & Matériel de Soudage • Tit Mellil",
    logo_url: "/logo_rb_industriale.png",
    flyer_url: "/carte_officielle_tenira.png",
    flyer_4k_url: "/carte_officielle_tenira_4k.png",
    phone_main: "07 00 95 00 64",
    phone_fixed: "05 22 35 48 68",
    whatsapp_phone: "212700950064",
    email: "",
    address: "Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc",
    city: "Tit Mellil, Casablanca"
  });
  const [loading, setLoading] = useState(true);

  const refreshCompany = async () => {
    try {
      const data = await getCompanySettings();
      if (data && data.company_name) {
        setCompany(data);
      }
    } catch (err) {
      console.warn("Could not load company from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCompany();
  }, []);

  const updateCompany = async (updatedFields) => {
    const res = await apiUpdateCompany(updatedFields);
    setCompany(res);
    return res;
  };

  const uploadLogo = async (file) => {
    const res = await apiUploadLogo(file);
    setCompany(res);
    return res;
  };

  return (
    <CompanyContext.Provider value={{ company, loading, updateCompany, uploadLogo, refreshCompany }}>
      {children}
    </CompanyContext.Provider>
  );
}

export function useCompany() {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useCompany must be used within a CompanyProvider");
  }
  return context;
}
