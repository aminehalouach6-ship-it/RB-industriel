// API client for TENIRA TRAVAUX (connected to Docker FastAPI & PostgreSQL)
const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `${window.location.origin}/api` : 'http://localhost:8000/api');

// Fallback initial data in case the backend server is starting up or disconnected
export const FALLBACK_CATEGORIES = [
  { id: 1, name: "Gaz Industriels", slug: "gaz-industriels", icon: "Cylinder", description: "Oxygène, Argon, Azote, CO2 et mélanges sous pression." },
  { id: 2, name: "Postes de Soudage", slug: "postes-de-soudage", icon: "Zap", description: "Inverter MMA LCD, MIG/MAG et TIG AC/DC haute performance." },
  { id: 3, name: "Manodétendeurs & Régulation", slug: "manodetendeurs-regulation", icon: "Gauge", description: "Détendeurs blindés laiton et débitmètres gradués." },
  { id: 4, name: "Torches & Accessoires", slug: "torches-accessoires", icon: "Flame", description: "Torches MIG Euro, torches TIG et câbles de masse cuivre pur." },
  { id: 5, name: "Consommables & Fils", slug: "consommables-fils", icon: "Disc", description: "Bobines SG2 15kg, fil inox et baguettes rutiles." },
  { id: 6, name: "Protection & EPI", slug: "protection-epi", icon: "ShieldCheck", description: "Cagoules automatiques True Color, gants et tabliers cuir." }
];

export const FALLBACK_PRODUCTS = [
  {
    id: 1,
    name: "Oxygène Industriel & Médical (O2)",
    slug: "oxygene-industriel-o2",
    category_id: 1,
    short_desc: "Oxygène pur à 99.5% pour oxycoupage, soudage autogène et chauffe de pièces.",
    description: "Gaz comburant haute pression livré en bouteilles certifiées. Idéal pour découpe de tôles, chaudronnerie et réparations navales ou agricoles.",
    price_estimate: 280.0,
    unit: "Bouteille B50 (10.5 m³)",
    in_stock: true,
    badge: "Indispensable Atelier",
    gas_type: "Oxygène",
    cylinder_sizes: "B20 (4.2 m³), B50 (10.5 m³), Cadres 12 bouteilles",
    specifications: {
      "Pureté": "≥ 99.5%",
      "Pression": "200 bars",
      "Ogive": "Blanc standard",
      "Applications": "Oxycoupage, soudure au chalumeau"
    }
  },
  {
    id: 2,
    name: "Argon Pur 5.0 (Ar)",
    slug: "argon-pur-ar",
    category_id: 1,
    short_desc: "Gaz inerte de très haute pureté 99.999% pour le soudage TIG et MIG fin.",
    description: "Protection thermique parfaite pour le soudage d'alliages nobles (inox, aluminium, titane) sans calamine ni porosité.",
    price_estimate: 450.0,
    unit: "Bouteille B50 (10 m³)",
    in_stock: true,
    badge: "Haute Pureté 99.999%",
    gas_type: "Argon",
    cylinder_sizes: "B20 (4 m³), B50 (10 m³)",
    specifications: {
      "Pureté": "≥ 99.999% (Qualité 5.0)",
      "Pression": "200 bars",
      "Ogive": "Vert foncé",
      "Applications": "Soudage TIG Inox & Alu"
    }
  },
  {
    id: 3,
    name: "Mélange Soudage Argon + CO2 (Mix 82/18)",
    slug: "melange-argon-co2-mix",
    category_id: 1,
    short_desc: "Gaz de protection binaire optimal pour le soudage semi-automatique MIG/MAG sur aciers.",
    description: "82% Argon + 18% CO2. Excellent mouillage du cordon, arc souple et absence presque totale de grattons de soudure.",
    price_estimate: 390.0,
    unit: "Bouteille B50 (10.5 m³)",
    in_stock: true,
    badge: "Top Vente Chaudronnerie",
    gas_type: "Mélange Ar/CO2",
    cylinder_sizes: "B20, B50, Cadres",
    specifications: {
      "Composition": "82% Argon + 18% CO2",
      "Pression": "200 bars",
      "Avantage": "Réduction drastique des meulages post-soudure"
    }
  },
  {
    id: 4,
    name: "Azote Haute Pureté (N2)",
    slug: "azote-haute-purete-n2",
    category_id: 1,
    short_desc: "Azote inerte comprimé pour découpe laser, inertage, essais de pression et métallurgie.",
    description: "Gaz sec utilisé pour découpe laser haute pression sans calamine, tests d'étanchéité sous pression et dégazage de citernes.",
    price_estimate: 320.0,
    unit: "Bouteille B50 (9.6 m³)",
    in_stock: true,
    badge: "Inerte Sec",
    gas_type: "Azote",
    cylinder_sizes: "B20, B50",
    specifications: {
      "Pureté": "≥ 99.999%",
      "Point de rosée": "-65°C",
      "Ogive": "Noir"
    }
  },
  {
    id: 5,
    name: "Dioxyde de Carbone (CO2)",
    slug: "dioxyde-de-carbone-co2",
    category_id: 1,
    short_desc: "CO2 industriel liquide/gaz pour soudage MAG acier carbone et applications techniques.",
    description: "Gaz économique offrant une pénétration d'arc remarquable sur fortes épaisseurs.",
    price_estimate: 260.0,
    unit: "Bouteille B50 (30 kg)",
    in_stock: true,
    badge: "Économique & Pénétrant",
    gas_type: "CO2",
    cylinder_sizes: "B20 (15kg), B50 (30kg)",
    specifications: {
      "Pureté": "≥ 99.8%",
      "Ogive": "Gris"
    }
  },
  {
    id: 6,
    name: "Acétylène Dissous (C2H2)",
    slug: "acetylene-dissous-c2h2",
    category_id: 1,
    short_desc: "Gaz combustible produisant la flamme la plus chaude (3100°C) pour chauffe et soudage.",
    description: "Pour redressage de poutrelles, formage à chaud, gougeage et soudage autogène.",
    price_estimate: 420.0,
    unit: "Bouteille B40 (7 kg)",
    in_stock: true,
    badge: "Flamme 3100°C",
    gas_type: "Acétylène",
    cylinder_sizes: "B20 (3.5kg), B40 (7kg)",
    specifications: {
      "Température max": "3 160 °C",
      "Ogive": "Marron"
    }
  },
  {
    id: 7,
    name: "Poste à Souder Inverter MMA 200A Pro LCD",
    slug: "poste-inverter-mma-200a-lcd",
    category_id: 2,
    short_desc: "Poste à souder à technologie IGBT avec écran digital LCD rétroéclairé vert et noir.",
    description: "Le modèle star de l'affiche officielle Tenira Travaux ! Afficheur digital précis, amorçage Hot Start instantané, Arc Force dynamique et protection thermique intégrée.",
    price_estimate: 2150.0,
    unit: "Pack Complet avec Câbles & Masque",
    in_stock: true,
    badge: "Produit Vedette Flyer ⭐",
    specifications: {
      "Alimentation": "Monophasé 230V ± 15%",
      "Plage de courant": "20A - 200A réglable en continu",
      "Facteur de marche": "60% à 200A (40°C)",
      "Électrodes": "1.6 à 4.0 mm rutiles et basiques",
      "Poids": "4.8 kg ultra-léger",
      "Garantie": "1 an pièces et main d'œuvre"
    }
  },
  {
    id: 8,
    name: "Poste Semi-Automatique MIG/MAG 250A Multi-Procédés",
    slug: "poste-mig-mag-250a-multiprocedes",
    category_id: 2,
    short_desc: "Poste professionnel synergique MIG/MAG, MMA et Lift-TIG avec dévidoir motorisé 4 galets.",
    description: "Idéal pour serrurerie industrielle et chaudronnerie. Régulation synergique intelligente, prise Euro standard.",
    price_estimate: 5800.0,
    unit: "Unité Complète avec Torche 4M",
    in_stock: true,
    badge: "Performance Industrielle",
    specifications: {
      "Procédés": "MIG/MAG, Fil Fourré, MMA, Lift-TIG",
      "Bobines": "D200 (5kg) et D300 (15kg)",
      "Alimentation": "230V / 400V"
    }
  },
  {
    id: 9,
    name: "Poste TIG AC/DC 200A Pulsé Haute Fréquence",
    slug: "poste-tig-ac-dc-200a-pulse",
    category_id: 2,
    short_desc: "Pour le soudage d'excellence de l'aluminium, inox, acier et titane avec amorçage HF sans contact.",
    description: "Poste inverter pour soudures parfaites étanches sous pression et carrosserie de précision.",
    price_estimate: 7400.0,
    unit: "Pack Complet Pro",
    in_stock: true,
    badge: "Expert Aluminium & Inox",
    specifications: {
      "Modes": "TIG AC (Alu), TIG DC (Inox), TIG Pulse, MMA",
      "Amorçage": "HF sans contact",
      "Pulsation": "Jusqu'à 200 Hz"
    }
  },
  {
    id: 10,
    name: "Manodétendeur Blindé pour Oxygène 200 Bars",
    slug: "manodetendeur-blinde-oxygene",
    category_id: 3,
    short_desc: "Manodétendeur robuste en laiton forgé avec double manomètre protégé par gaines caoutchouc.",
    description: "Lecture directe haute et basse pression. Conforme à la norme ISO 2503.",
    price_estimate: 480.0,
    unit: "Unité",
    in_stock: true,
    badge: "Sécurité Renforcée",
    specifications: {
      "Pression max": "200 bars amont",
      "Matière": "Laiton matricé lourd",
      "Protection": "Caoutchouc antichoc"
    }
  },
  {
    id: 11,
    name: "Manodétendeur Débitmètre Argon / CO2 Haute Précision",
    slug: "manodetendeur-debitmetre-argon-co2",
    category_id: 3,
    short_desc: "Détendeur régulateur avec manomètre bouteille et débitmètre gradué de 0 à 32 L/min.",
    description: "Évite les pertes de gaz coûteuses et garantit une protection gazeuse stable à la torche.",
    price_estimate: 520.0,
    unit: "Unité",
    in_stock: true,
    badge: "Économie de Gaz Pro",
    specifications: {
      "Gaz": "Argon pur & Mélange Ar/CO2",
      "Débit": "0 - 32 L/min",
      "Raccordement": "Standard NF Maroc"
    }
  },
  {
    id: 12,
    name: "Torche de Soudage MIG/MAG 24KD Ergonomique 4M",
    slug: "torche-mig-mag-24kd-4m",
    category_id: 4,
    short_desc: "Torche semi-automatique professionnelle 250A avec câble articulé et raccord Euro rapide.",
    description: "Refroidissement air performant, prise en main antidérapante ergonomique.",
    price_estimate: 620.0,
    unit: "Torche 4 mètres complète",
    in_stock: true,
    badge: "Grande Souplesse",
    specifications: {
      "Intensité": "250A CO2 / 220A Mix",
      "Longueur": "4 mètres",
      "Fils": "0.8 à 1.2 mm"
    }
  },
  {
    id: 13,
    name: "Câble de Masse & Pince Porte-Électrode 300A Cuivre Pur",
    slug: "cable-masse-pince-porte-electrode-300a",
    category_id: 4,
    short_desc: "Faisceau complet 25 mm² en cuivre multibrin ultra-souple avec connecteurs Dinse 35-50.",
    description: "Conductibilité maximale, échauffement minimal, pince de masse puissante à mors laiton.",
    price_estimate: 350.0,
    unit: "Paire complète 3M + 3M",
    in_stock: true,
    badge: "100% Cuivre Pur"
  },
  {
    id: 14,
    name: "Bobine Fil à Souder Acier Cuivré SG2 (15kg)",
    slug: "bobine-fil-souder-sg2-15kg",
    category_id: 5,
    short_desc: "Fil massif continu cuivré pour soudage MIG/MAG sous gaz de protection.",
    description: "Bobinage spire par spire garantissant un dévidage sans à-coups ni bourrage de torche.",
    price_estimate: 430.0,
    unit: "Bobine 15 kg (Ø 0.8 ou 1.0 mm)",
    in_stock: true,
    badge: "Spire par Spire Garanti",
    specifications: {
      "Nuance": "AWS A5.18 ER70S-6",
      "Conditionnement": "Bobine métallique D300"
    }
  },
  {
    id: 15,
    name: "Baguettes Électrodes Rutiles E6013 (Boîte 5kg)",
    slug: "baguettes-electrodes-rutiles-e6013-5kg",
    category_id: 5,
    short_desc: "Électrodes de soudage à enrobage rutile pour tous travaux d'acier et serrurerie courante.",
    description: "Amorçage immédiat, laitier se détachant tout seul, soudure propre et brillante.",
    price_estimate: 140.0,
    unit: "Boîte de 5 kg",
    in_stock: true,
    badge: "Facilité d'Usage"
  },
  {
    id: 16,
    name: "Cagoule de Soudage Automatique LCD True Color",
    slug: "cagoule-soudage-automatique-lcd-true-color",
    category_id: 6,
    short_desc: "Masque électronique à assombrissement ultra-rapide 1/30000s avec vision des couleurs réelles.",
    description: "Le masque visible sur l'affiche Tenira Travaux. Technologie True Color : fini la vision verte terne, observez votre bain de fusion dans sa coloration naturelle avec une clarté optique 1/1/1/2.",
    price_estimate: 690.0,
    unit: "Kit avec écrans de rechange",
    in_stock: true,
    badge: "Vision True Color ⭐",
    specifications: {
      "Temps de réaction": "1/30 000 s",
      "Teinte": "DIN 4 clair / DIN 9 à 13 sombre",
      "Capteurs": "4 capteurs d'arc indépendants",
      "Mode meulage": "Oui (Grind)",
      "Piles": "Solaire + pile remplaçable"
    }
  },
  {
    id: 17,
    name: "Gants de Soudeur Cuir Croûte Traité Chaleur 35cm",
    slug: "gants-soudeur-cuir-croute-35cm",
    category_id: 6,
    short_desc: "Paire de gants haute résistance thermique avec manchette de sécurité anti-projection.",
    description: "Coutures au fil Kevlar haute résistance, cuir souple et isolant.",
    price_estimate: 75.0,
    unit: "Paire",
    in_stock: true,
    badge: "Norme EN 12477 Type A"
  }
];

export async function fetchCategories() {
  try {
    const res = await fetch(`${API_BASE_URL}/products/categories`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data && data.length > 0 ? data : FALLBACK_CATEGORIES;
  } catch (err) {
    console.warn("Backend categories unavailable, using local cache:", err);
    return FALLBACK_CATEGORIES;
  }
}

export async function fetchProducts(categorySlug = null, search = null) {
  try {
    const params = new URLSearchParams();
    if (categorySlug && categorySlug !== 'tous') params.append('category_slug', categorySlug);
    if (search) params.append('search', search);

    const res = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
    if (!res.ok) throw new Error("API error");
    const data = await res.json();
    return data && data.length > 0 ? data : filterFallbackProducts(categorySlug, search);
  } catch (err) {
    console.warn("Backend products unavailable, using fallback data:", err);
    return filterFallbackProducts(categorySlug, search);
  }
}

function filterFallbackProducts(categorySlug, search) {
  let list = [...FALLBACK_PRODUCTS];
  if (categorySlug && categorySlug !== 'tous') {
    const cat = FALLBACK_CATEGORIES.find(c => c.slug === categorySlug);
    if (cat) {
      list = list.filter(p => p.category_id === cat.id);
    }
  }
  if (search) {
    const s = search.toLowerCase();
    list = list.filter(p => 
      p.name.toLowerCase().includes(s) || 
      p.short_desc.toLowerCase().includes(s) ||
      (p.gas_type && p.gas_type.toLowerCase().includes(s))
    );
  }
  return list;
}

export async function submitOrder(orderData) {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) throw new Error("Error submitting order to API");
    return await res.json();
  } catch (err) {
    console.warn("Could not save to DB, generating local order confirmation:", err);
    return {
      id: Date.now(),
      order_reference: `TT-ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      total_estimated: orderData.items.reduce((acc, it) => acc + (it.unit_price * it.quantity), 0),
      status: "EN_ATTENTE_OFFLINE"
    };
  }
}

export async function submitQuoteRequest(quoteData) {
  try {
    const res = await fetch(`${API_BASE_URL}/quotes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quoteData)
    });
    if (!res.ok) throw new Error("Error submitting quote request");
    return await res.json();
  } catch (err) {
    console.warn("Could not submit quote to API:", err);
    return {
      id: Date.now(),
      quote_reference: `TT-DEV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      client_name: quoteData.client_name,
      estimated_total: quoteData.items_json ? quoteData.items_json.reduce((acc, it) => acc + (it.price * it.quantity), 0) : 0,
      status: "NOUVEAU_OFFLINE"
    };
  }
}

export async function submitContact(contactData) {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(contactData)
    });
    if (!res.ok) throw new Error("Error sending contact message");
    return await res.json();
  } catch (err) {
    console.warn("Could not send contact message to API:", err);
    return { success: true, local: true };
  }
}

export async function fetchStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/stats`);
    if (!res.ok) throw new Error("Error fetching stats");
    return await res.json();
  } catch (err) {
    return {
      total_products: FALLBACK_PRODUCTS.length,
      total_categories: FALLBACK_CATEGORIES.length,
      total_orders: 14,
      total_quotes: 38,
      active_deliveries: 4
    };
  }
}

export async function fetchOrders() {
  try {
    const res = await fetch(`${API_BASE_URL}/orders`);
    if (!res.ok) throw new Error("Error fetching orders");
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch orders from API:", err);
    return [];
  }
}

export async function updateOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status?status=${encodeURIComponent(status)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error("Error updating order status");
  return await res.json();
}

export async function deleteOrder(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error deleting order");
  return true;
}

export async function createProduct(productData) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Error creating product");
  }
  return await res.json();
}

export async function updateProduct(productId, productData) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData)
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Error updating product");
  }
  return await res.json();
}

export async function deleteProduct(productId) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error deleting product");
  return true;
}

export async function fetchQuotes() {
  try {
    const res = await fetch(`${API_BASE_URL}/quotes`);
    if (!res.ok) throw new Error("Error fetching quotes");
    return await res.json();
  } catch (err) {
    console.warn("Could not fetch quotes from API:", err);
    return [];
  }
}

export async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Nom d'utilisateur ou mot de passe incorrect.");
  }
  return await res.json();
}

export async function uploadProductImage(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.detail || "Erreur lors du téléversement de l'image.");
  }

  return await res.json();
}


