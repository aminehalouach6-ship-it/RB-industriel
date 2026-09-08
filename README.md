# 🟢 TENIRA TRAVAUX — Gaz Industriels & Matériel de Soudage

Plateforme web et e-commerce B2B / B2C moderne, dynamique et optimisée, développée pour **TENIRA TRAVAUX**, société spécialisée dans la vente, la distribution et la livraison de gaz industriels et d'équipements de soudage de haute performance à **Tit Mellil**, Grand Casablanca et partout au Maroc.

Ce projet s'inspire du niveau de finition professionnelle de la référence `centre-horizon-marrakech` et matérialise l'ensemble des informations et produits issus de l'affiche officielle de l'entreprise.

---

## 📸 Données Officielles de l'Établissement (Issues du Flyer)

- **Entreprise :** TENIRA TRAVAUX
- **Slogan & Activités :** Gaz Industriels & Matériel de Soudage — *Vente • Distribution • Livraison*
- **Direction Générale :** M. Rachid BOUZAYD, Gérant
- **Lignes Téléphoniques GSM :**
  - `06 61 49 04 95` (Ligne Principale / WhatsApp)
  - `07 00 95 00 64`
  - `06 90 90 74 88`
  - `06 95 95 86 27`
- **Téléphone Fixe :** `05 22 35 48 68`
- **Courriel :** `teniratravaux@gmail.com`
- **Adresse Officielle :** Hay Amal 1, N° 92, Appt N° 8, Tit Mellil, Casablanca - Maroc
- **Devises & Engagements :** *Livraison Rapide & Sécurisée* | *Qualité • Sécurité • Performance*

---

## 🚀 Fonctionnalités Clés du Store Dynamique

1. **Catalogue E-Commerce Dynamique :**
   - 6 rayons spécialisés : *Gaz Industriels (Oxygène, Argon pur 5.0, Azote, CO2, Mix soudage, Acétylène)*, *Postes de Soudage (Inverter MMA LCD, MIG/MAG semi-auto, TIG AC/DC)*, *Manodétendeurs blindés laiton*, *Torches ergonomiques & Câbles cuivre*, *Consommables (Bobines SG2 15kg, baguettes rutiles)*, *Protection EPI (Cagoule LCD True Color, gants cuir)*.
   - Recherche en temps réel, filtres par catégorie et affichage des spécifications techniques.

2. **Fiche Technique Détaillée par Produit :**
   - Pureté garantie des gaz, pressions de service (200 bars), facteurs de marche, compatibilités et consignes strictes de sécurité.

3. **Calculateur de Devis Express (Simulateur 60s) :**
   - Permet aux artisans et directeurs de chantiers de composer leur panier de bouteilles et machines, de calculer le total estimé en Dirhams marocains (MAD HT) et les frais de livraison selon la zone (Gratuit à Tit Mellil, forfait Casablanca / Maroc).

4. **Passerelle WhatsApp Directe avec Pré-Remplissage :**
   - Génération instantanée d'un message structuré envoyé sur le WhatsApp de **M. Rachid BOUZAYD** (`+212 6 61 49 04 95`) avec le récapitulatif complet de la commande ou du devis.

5. **Panier & Enregistrement de Commande Multi-Canal :**
   - Choix entre *Livraison sur Chantier* ou *Retrait Dépôt à Tit Mellil*.
   - Sauvegarde automatique de la commande dans la base de données PostgreSQL via l'API REST FastAPI avec attribution d'une référence unique (`TT-ORD-XXXXXX`).

6. **Tableau de Bord / Supervision Espace Pro :**
   - Suivi des commandes, volume de devis émis, santé de l'API et lien direct vers la documentation interactive Swagger `/docs`.

---

## 🏗️ Architecture Fullstack & Déploiement Render

```
tenira-travaux/
├── backend/                  # API FastAPI (Python 3.11)
│   ├── app/
│   │   ├── api/              # Endpoints (products, orders, quotes, contact, stats)
│   │   ├── core/             # Config, Database SQLAlchemy & Fallback
│   │   ├── models/           # Modèles de données PostgreSQL
│   │   ├── schemas/          # Schémas Pydantic
│   │   └── main.py           # Application FastAPI
│   ├── seed_data.py          # Seeding automatique du catalogue
│   ├── Dockerfile            # Conteneurisation pour Web Service Render
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                 # Application React 18 + Vite + Tailwind CSS
│   ├── public/
│   │   ├── flyer_tenira_travaux.png  # Affiche originale officielle
│   │   ├── logo.svg          # Logo vectoriel officiel TT
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/       # Navbar, Hero, ProductCatalog, QuoteSimulator, CartDrawer, etc.
│   │   ├── context/          # CartContext & WhatsApp Generator
│   │   ├── services/         # Client API avec résilience et cache local
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── tailwind.config.js
│
├── docker-compose.yml        # Orchestration locale PostgreSQL + FastAPI
├── render.yaml               # Blueprint Render (Static Site + Web Service + PostgreSQL)
└── README.md
```

---

## 💻 Démarrage en Local

### Option A : Avec Docker Compose (Recommandé pour tester l'ensemble)

Assurez-vous que Docker Desktop est lancé sur votre machine :

```bash
cd C:\Users\HP\.gemini\antigravity\scratch\tenira-travaux
docker compose up --build
```

- **API FastAPI & Swagger Docs :** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Base PostgreSQL :** Port `5432` (`tenira_db`, utilisateur `tenira_user`)

Puis, dans un autre terminal pour le Frontend :
```bash
cd frontend
npm install
npm run dev
```
Accédez au frontend sur : [http://localhost:5173](http://localhost:5173)

### Option B : Lancement Rapide du Frontend Seul

Grâce au moteur de résilience intégré dans `frontend/src/services/api.js`, le frontend peut tourner en totale autonomie même si Docker n'est pas encore démarré :

```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Déploiement sur Render (1-Click Blueprint)

Le dépôt contient le fichier `render.yaml` pré-configuré :

1. Poussez le projet sur GitHub / GitLab.
2. Rendez-vous sur votre tableau de bord **Render** ([dashboard.render.com](https://dashboard.render.com/)).
3. Cliquez sur **New +** > **Blueprint**.
4. Connectez votre dépôt Git : Render créera automatiquement :
   - Le **Static Site** pour le Frontend React (build: `cd frontend && npm install && npm run build`, output: `frontend/dist`).
   - Le **Web Service Docker** pour le Backend FastAPI.
   - L'instance managée **PostgreSQL**.
