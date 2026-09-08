from sqlalchemy.orm import Session
from app.models.models import Category, Product

INITIAL_CATEGORIES = [
    {
        "name": "Gaz Industriels",
        "slug": "gaz-industriels",
        "icon": "Cylinder",
        "description": "Oxygène, Azote, Argon pur, Mélanges de soudage et CO2 en bouteilles et cadres avec livraison sécurisée."
    },
    {
        "name": "Postes de Soudage",
        "slug": "postes-de-soudage",
        "icon": "Zap",
        "description": "Postes Inverter MMA à affichage LCD, semi-automatiques MIG/MAG et TIG haute fréquence professionnels."
    },
    {
        "name": "Manodétendeurs & Régulation",
        "slug": "manodetendeurs-regulation",
        "icon": "Gauge",
        "description": "Détendeurs blindés, débitmètres à bille et vannes haute pression pour tous gaz industriels."
    },
    {
        "name": "Torches & Accessoires",
        "slug": "torches-accessoires",
        "icon": "Flame",
        "description": "Torches MIG/MAG connecteur Euro, torches TIG ergonomiques, pinces de masse et câbles cuivre."
    },
    {
        "name": "Consommables & Fils",
        "slug": "consommables-fils",
        "icon": "Disc",
        "description": "Bobines de fil cuivré SG2, fil Inox 308L, baguettes électrodes rutiles et basiques pour tous travaux."
    },
    {
        "name": "Protection & EPI",
        "slug": "protection-epi",
        "icon": "ShieldCheck",
        "description": "Cagoules automatiques LCD True Color, gants de soudure croûte de cuir, tabliers et vestes ignifugées."
    }
]

INITIAL_PRODUCTS = [
    # Gaz Industriels
    {
        "name": "Oxygène Industriel & Médical (O2)",
        "slug": "oxygene-industriel-o2",
        "category_slug": "gaz-industriels",
        "short_desc": "Oxygène pur à 99.5% pour oxycoupage, soudage autogène, métallurgie et oxycombustion.",
        "description": "Gaz comburant par excellence fourni en bouteilles acier haute pression (200 bars). Contrôles stricts de pureté et d'étanchéité. Idéal pour ateliers de chaudronnerie, carrosserie, découpe de métaux et chantiers navals.",
        "price_estimate": 280.0,
        "unit": "Bouteille B50 (10.5 m³)",
        "in_stock": True,
        "badge": "Indispensable Atelier",
        "gas_type": "Oxygène",
        "cylinder_sizes": "B20 (4.2 m³), B50 (10.5 m³), Cadre 12 Bouteilles",
        "specifications": {
            "Pureté": "≥ 99.5%",
            "Pression de service": "200 bars",
            "Couleur ogive standard": "Blanc pur",
            "Applications": "Oxycoupage, soudage au chalumeau, brasage fort, chauffe"
        }
    },
    {
        "name": "Argon Pur 5.0 (Ar)",
        "slug": "argon-pur-ar",
        "category_slug": "gaz-industriels",
        "short_desc": "Gaz inerte de très haute pureté 99.999% pour le soudage TIG et MIG de précision.",
        "description": "L'argon pur protège parfaitement le bain de fusion de l'oxydation atmosphérique. Recommandé pour l'inox, le titane, le cuivre et l'aluminium avec une finition esthétique irréprochable sans projection.",
        "price_estimate": 450.0,
        "unit": "Bouteille B50 (10 m³)",
        "in_stock": True,
        "badge": "Haute Pureté 99.999%",
        "gas_type": "Argon",
        "cylinder_sizes": "B20 (4 m³), B50 (10 m³)",
        "specifications": {
            "Pureté": "≥ 99.999% (Qualité 5.0)",
            "Pression": "200 bars",
            "Couleur ogive standard": "Vert foncé",
            "Applications": "Soudage TIG Inox, Aluminium, Alliages spéciaux, Purge de tuyauteries"
        }
    },
    {
        "name": "Mélange Soudage Argon + CO2 (Mix 82/18)",
        "slug": "melange-argon-co2-mix",
        "category_slug": "gaz-industriels",
        "short_desc": "Gaz de protection binaire optimal pour le soudage semi-automatique MIG/MAG sur aciers.",
        "description": "Combinaison équilibrée de 82% Argon et 18% CO2 assurant un arc stable, une excellente pénétration, un minimum de grattons et une vitesse d'exécution accrue.",
        "price_estimate": 390.0,
        "unit": "Bouteille B50 (10.5 m³)",
        "in_stock": True,
        "badge": "Top Vente Chaudronnerie",
        "gas_type": "Mélange Ar/CO2",
        "cylinder_sizes": "B20, B50, Cadres",
        "specifications": {
            "Composition": "82% Argon + 18% CO2",
            "Pression": "200 bars",
            "Couleur ogive": "Vert clair",
            "Avantage": "Réduction drastique des projections, très bon mouillage du cordon"
        }
    },
    {
        "name": "Azote Haute Pureté (N2)",
        "slug": "azote-haute-purete-n2",
        "category_slug": "gaz-industriels",
        "short_desc": "Azote inerte comprimé pour découpe laser, inertage, essais de pression et métallurgie.",
        "description": "Gaz sec et inerte utilisé pour la découpe laser sans calamine, le dégazage de réservoirs, les tests d'étanchéité sous pression et la protection de tuyauteries.",
        "price_estimate": 320.0,
        "unit": "Bouteille B50 (9.6 m³)",
        "in_stock": True,
        "badge": "Inerte Sec",
        "gas_type": "Azote",
        "cylinder_sizes": "B20, B50 (200/300 bars)",
        "specifications": {
            "Pureté": "≥ 99.999%",
            "Point de rosée": "Inférieur à -65°C",
            "Couleur ogive": "Noir",
            "Applications": "Découpe laser haute pression, épreuve hydraulique et pneumatique"
        }
    },
    {
        "name": "Dioxyde de Carbone (CO2)",
        "slug": "dioxyde-de-carbone-co2",
        "category_slug": "gaz-industriels",
        "short_desc": "CO2 industriel liquide/gaz pour soudage MAG acier carbone et applications techniques.",
        "description": "Bouteilles à immersion ou phase gazeuse. Excellente pénétration en soudage MAG sur tôles épaisses.",
        "price_estimate": 260.0,
        "unit": "Bouteille B50 (30 kg)",
        "in_stock": True,
        "badge": "Économique & Robuste",
        "gas_type": "CO2",
        "cylinder_sizes": "B20 (15kg), B50 (30kg)",
        "specifications": {
            "Pureté": "≥ 99.8%",
            "Pression d'équilibre": "50 bars à 15°C",
            "Couleur ogive": "Gris"
        }
    },
    {
        "name": "Acétylène Dissous (C2H2)",
        "slug": "acetylene-dissous-c2h2",
        "category_slug": "gaz-industriels",
        "short_desc": "Gaz combustible produisant la flamme la plus chaude (3100°C) pour chauffe et soudage.",
        "description": "Le partenaire indispensable de l'oxygène pour l'oxyacétylénique. Idéal pour le formage à chaud, le cintrage, la trempe superficielle et le redressage mécanique.",
        "price_estimate": 420.0,
        "unit": "Bouteille B40 (7 kg)",
        "in_stock": True,
        "badge": "Flamme Haute Température",
        "gas_type": "Acétylène",
        "cylinder_sizes": "B20 (3.5kg), B40 (7kg)",
        "specifications": {
            "Température de flamme": "3 160 °C sous oxygène pur",
            "Masse volumique": "1.17 kg/m³",
            "Couleur ogive": "Marron / Châtaigne"
        }
    },

    # Postes de Soudage
    {
        "name": "Poste à Souder Inverter MMA 200A Pro LCD",
        "slug": "poste-inverter-mma-200a-lcd",
        "category_slug": "postes-de-soudage",
        "short_desc": "Poste à souder à technologie IGBT avec écran digital LCD rétroéclairé vert et noir.",
        "description": "L'équipement phare identique à notre catalogue officiel ! Compact, léger et robuste. Équipé des technologies électroniques de pointe : Hot Start automatique pour un amorçage sans accroc, Arc Force dynamique réglable, et Anti-Sticking pour éviter le collage des électrodes. Compatible avec électrodes rutiles, basiques et inox de Ø 1.6 à 4.0 mm.",
        "price_estimate": 2150.0,
        "unit": "Pack Complet avec Câbles & Masque",
        "in_stock": True,
        "badge": "Produit Vedette Flyer ⭐",
        "specifications": {
            "Alimentation": "Monophasé 230V ± 15% / 50-60Hz",
            "Plage de courant": "20A - 200A",
            "Facteur de marche": "60% à 200A (40°C)",
            "Électrodes utilisables": "1.6 mm à 4.0 mm (Rutiles, Basiques, Inox)",
            "Affichage": "Écran digital LCD avec réglage précis en continu",
            "Ventilation": "Système à double flux avec protection thermique et surtension",
            "Poids": "4.8 kg (très maniable sur chantier)"
        }
    },
    {
        "name": "Poste Semi-Automatique MIG/MAG 250A Multi-Procédés",
        "slug": "poste-mig-mag-250a-multiprocedes",
        "category_slug": "postes-de-soudage",
        "short_desc": "Poste professionnel synergique MIG/MAG, MMA et Lift-TIG avec dévidoir motorisé.",
        "description": "Conçu pour les ateliers de chaudronnerie et de métallerie intensive. Régulation électronique synergique : vous choisissez le diamètre de fil et le matériau, le poste ajuste automatiquement la vitesse de fil et la tension d'arc. Connecteur Euro standard.",
        "price_estimate": 5800.0,
        "unit": "Unité Complète avec Torche 4M",
        "in_stock": True,
        "badge": "Performance Industrielle",
        "specifications": {
            "Procédés": "MIG/MAG (avec gaz), Fil fourré (sans gaz), MMA et Lift TIG",
            "Bobines acceptées": "D200 (5kg) et D300 (15kg)",
            "Dévidoir": "4 galets motorisés haute précision",
            "Facteur de marche": "250A à 60%"
        }
    },
    {
        "name": "Poste TIG AC/DC 200A Pulsé Haute Fréquence",
        "slug": "poste-tig-ac-dc-200a-pulse",
        "category_slug": "postes-de-soudage",
        "short_desc": "Pour le soudage d'excellence de l'aluminium, inox, acier et titane avec amorçage HF.",
        "description": "Le choix suprême des soudeurs qualifiés. Mode AC pour l'aluminium et ses alliages avec décapage contrôlé, mode DC pour l'inox. Pulsation réglable jusqu'à 200Hz pour limiter la déformation des tôles minces.",
        "price_estimate": 7400.0,
        "unit": "Pack Complet Pro",
        "in_stock": True,
        "badge": "Expert Aluminium & Inox",
        "specifications": {
            "Modes": "TIG AC, TIG DC, TIG Pulse, MMA",
            "Amorçage": "Haute Fréquence (HF) sans contact d'électrode",
            "Gestion du cycle": "Pré-gaz, montée de courant, pulsation, évanouissement, post-gaz"
        }
    },

    # Manodétendeurs & Régulation
    {
        "name": "Manodétendeur Blindé pour Oxygène 200 Bars",
        "slug": "manodetendeur-blinde-oxygene",
        "category_slug": "manodetendeurs-regulation",
        "short_desc": "Manodétendeur robuste en laiton forgé avec double manomètre protégé par gaines caoutchouc.",
        "description": "Corps massif en laiton forgé monobloc. Manomètre haute pression pour le suivi du niveau de la bouteille (0-315 bars) et manomètre basse pression pour la régulation précise de travail (0-16 bars). Conforme à la norme ISO 2503.",
        "price_estimate": 480.0,
        "unit": "Unité",
        "in_stock": True,
        "badge": "Sécurité Renforcée",
        "specifications": {
            "Pression amont": "200 bars",
            "Pression aval de travail": "0 à 10 bars réglable",
            "Matière": "Laiton matricé haute résistance",
            "Protection": "Carcasse protectrice élastomère antichoc"
        }
    },
    {
        "name": "Manodétendeur Débitmètre Argon / CO2 Haute Précision",
        "slug": "manodetendeur-debitmetre-argon-co2",
        "category_slug": "manodetendeurs-regulation",
        "short_desc": "Détendeur régulateur avec manomètre bouteille et débitmètre gradué de 0 à 32 L/min.",
        "description": "Indispensable pour le soudage TIG et MIG/MAG. Permet un ajustement millimétré du débit gazeux à la torche, évitant le gaspillage de gaz tout en prévenant les porosités dans le cordon de soudure.",
        "price_estimate": 520.0,
        "unit": "Unité",
        "in_stock": True,
        "badge": "Économie de Gaz Pro",
        "specifications": {
            "Gaz compatibles": "Argon pur, Mélanges Argon/CO2, CO2 pur",
            "Débit de sortie": "0 à 32 Litres/minute",
            "Raccordement": "Norme standard Maroc / NF"
        }
    },

    # Torches & Accessoires
    {
        "name": "Torche de Soudage MIG/MAG 24KD Ergonomique 4M",
        "slug": "torche-mig-mag-24kd-4m",
        "category_slug": "torches-accessoires",
        "short_desc": "Torche semi-automatique professionnelle 250A avec câble articulé et raccord Euro rapide.",
        "description": "Poignée ergonomique avec revêtement antidérapant soft-grip et rotule articulée au manche pour réduire la fatigue du poignet. Système de refroidissement à air renforcé, idéal pour fil 0.8 à 1.2 mm.",
        "price_estimate": 620.0,
        "unit": "Torche 4 mètres complète",
        "in_stock": True,
        "badge": "Grande Souplesse",
        "specifications": {
            "Intensité admissible": "250A (CO2) / 220A (Mélange)",
            "Longueur": "4 mètres",
            "Connecteur": "Euro universel à broches en laiton doré"
        }
    },
    {
        "name": "Torche TIG WP-26 Haute Résistance 4 Mètres",
        "slug": "torche-tig-wp-26-4m",
        "category_slug": "torches-accessoires",
        "short_desc": "Torche TIG 200A avec tête flexible, commande gâchette souple et faisceau gainé.",
        "description": "Excellente prise en main pour passes fines de racine et soudures esthétiques. Équipée d'un jeu de pinces porte-tungstène, buse céramique et bouchon long.",
        "price_estimate": 780.0,
        "unit": "Torche avec consommables de base",
        "in_stock": True,
        "badge": "Précision Millimétrique"
    },
    {
        "name": "Câble de Masse & Pince Porte-Électrode 300A Cuivre Pur",
        "slug": "cable-masse-pince-porte-electrode-300a",
        "category_slug": "torches-accessoires",
        "short_desc": "Faisceau complet 25 mm² en cuivre multibrin ultra-souple avec connecteurs Dinse 35-50.",
        "description": "Comprend une pince de masse en laiton coulé à ressort puissant et un porte-électrode à vis robuste capable d'enserrer fermement les baguettes sous tous les angles.",
        "price_estimate": 350.0,
        "unit": "Paire complète 3M + 3M",
        "in_stock": True,
        "badge": "100% Cuivre Pur"
    },

    # Consommables & Fils
    {
        "name": "Bobine Fil à Souder Acier Cuivré SG2 / ER70S-6 (15kg)",
        "slug": "bobine-fil-souder-sg2-15kg",
        "category_slug": "consommables-fils",
        "short_desc": "Fil massif continu cuivré de qualité supérieure pour soudage MIG/MAG sous gaz de protection.",
        "description": "Bobinage spire par spire ultra-régulier assurant un dévidage fluide sans blocage dans la gaine. Excellente stabilité de l'arc, amorçage franc, faibles projections et très bonnes caractéristiques mécaniques du joint.",
        "price_estimate": 430.0,
        "unit": "Bobine 15 kg (Ø 0.8 ou 1.0 ou 1.2 mm)",
        "in_stock": True,
        "badge": "Spire par Spire Garanti",
        "specifications": {
            "Nuance": "AWS A5.18 ER70S-6 / EN ISO 14341-A",
            "Diamètres disponibles": "0.8 mm, 1.0 mm, 1.2 mm",
            "Conditionnement": "Bobine métallique D300 sous emballage hermétique sous vide"
        }
    },
    {
        "name": "Baguettes Électrodes Rutiles E6013 (Boîte 5kg)",
        "slug": "baguettes-electrodes-rutiles-e6013-5kg",
        "category_slug": "consommables-fils",
        "short_desc": "Électrodes de soudage à enrobage rutile pour tous travaux d'acier et serrurerie courante.",
        "description": "Amorçage et réamorçage instantanés. Fusion douce sans crachotement, laitier auto-détachable en fin de passe, cordon d'aspect lisse et brillant.",
        "price_estimate": 140.0,
        "unit": "Boîte de 5 kg",
        "in_stock": True,
        "badge": "Facilité d'Usage",
        "specifications": {
            "Classification": "AWS A5.1 E6013 / EN ISO 2560-A",
            "Diamètres": "Ø 2.5 mm, Ø 3.2 mm, Ø 4.0 mm",
            "Positions": "Toutes positions y compris descendante"
        }
    },

    # Protection & EPI
    {
        "name": "Cagoule de Soudage Automatique LCD True Color",
        "slug": "cagoule-soudage-automatique-lcd-true-color",
        "category_slug": "protection-epi",
        "short_desc": "Masque électronique à assombrissement ultra-rapide 1/30000s avec vision des couleurs réelles.",
        "description": "Le masque de protection visible sur l'affiche officielle Tenira Travaux ! Technologie optique 'True Color' pour une clarté visuelle incomparable avant, pendant et après l'arc. Teinte réglable de DIN 4/9 à 13, 4 capteurs d'arc indépendants, mode meulage (Grind) intégré et serre-tête ergonomique à 4 réglages multipoints.",
        "price_estimate": 690.0,
        "unit": "Kit avec écrans de rechange",
        "in_stock": True,
        "badge": "Vision True Color ⭐",
        "specifications": {
            "Champ de vision": "100 x 60 mm panoramique",
            "Temps de réaction": "1/30 000 seconde",
            "Teintes variables": "DIN 4 (état clair) / DIN 9 à 13 (état sombre)",
            "Alimentation": "Cellule solaire + pile lithium remplaçable CR2450",
            "Normes": "EN 379, EN 175, ANSI Z87.1"
        }
    },
    {
        "name": "Gants de Soudeur Cuir Croûte Traité Chaleur 35cm",
        "slug": "gants-soudeur-cuir-croute-35cm",
        "category_slug": "protection-epi",
        "short_desc": "Paire de gants haute résistance thermique avec manchette de sécurité anti-projection.",
        "description": "Fabriqués en croûte de cuir de vachette de premier choix avec coutures renforcées en fil de Kevlar ignifugé. Doublure intérieure molletonnée coton pour un confort thermique supérieur.",
        "price_estimate": 75.0,
        "unit": "Paire",
        "in_stock": True,
        "badge": "Norme EN 12477 Type A"
    },
    {
        "name": "Tablier Professionnel de Soudeur en Cuir Bovin",
        "slug": "tablier-soudeur-cuir-bovin",
        "category_slug": "protection-epi",
        "short_desc": "Tablier intégral 90x60 cm protégeant des scories, de la chaleur rayonnante et des flammes.",
        "description": "Cuir fendu épais, lanières croisées dans le dos pour une répartition équilibrée du poids sans tirer sur les cervicales.",
        "price_estimate": 190.0,
        "unit": "Unité",
        "in_stock": True,
        "badge": "Protection Totale"
    }
]

def seed_database(db: Session):
    # Check if categories already exist
    existing_cat_count = db.query(Category).count()
    if existing_cat_count == 0:
        cat_map = {}
        for cat_data in INITIAL_CATEGORIES:
            cat = Category(**cat_data)
            db.add(cat)
            db.flush()
            cat_map[cat.slug] = cat.id
        
        for prod_data in INITIAL_PRODUCTS:
            cat_slug = prod_data.pop("category_slug")
            category_id = cat_map.get(cat_slug)
            if category_id:
                product = Product(category_id=category_id, **prod_data)
                db.add(product)
        
        db.commit()
        print("Database seeded successfully with Tenira Travaux initial catalog!")
    else:
        print("Database already contains data, skipping seed.")
