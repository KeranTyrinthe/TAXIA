# Frontend# TAXIA - Transport Intelligent en RDC

![TAXIA Logo](./images/logo.png)

## 📖 Description

TAXIA est une plateforme de transport intelligente conçue spécifiquement pour la République Démocratique du Congo. L'application utilise l'intelligence artificielle pour optimiser les trajets en tenant compte de la circulation locale, des sens uniques et des zones praticables.

**Slogan :** *Déplacez-vous plus vite et malin en RDC*

## 🎯 Vision du Projet

TAXIA vise à révolutionner le transport urbain en RDC en offrant une solution simple, fiable et adaptée aux réalités locales. Contrairement aux solutions internationales, TAXIA comprend les spécificités du terrain congolais et optimise chaque trajet en conséquence.

## 🏗️ Architecture de la Plateforme

TAXIA est composé de trois interfaces principales :

### 1. **Application Client** (Mobile Responsive)
- Commande de courses en temps réel
- Suivi GPS du chauffeur
- Paiement cash à la fin du trajet
- Historique des courses
- Système d'évaluation

### 2. **Application Chauffeur** (Mobile Responsive)
- Réception et gestion des courses
- Navigation GPS optimisée par IA
- Gestion des paiements reçus
- Suivi des versements

### 3. **Dashboard Administration** (Web)
- Gestion centralisée des chauffeurs
- Attribution intelligente des courses via IA
- Suivi en temps réel de toutes les courses
- Gestion des paiements et versements
- Statistiques et rapports détaillés

## 🚀 Technologies Utilisées

- **Frontend :** React 18 avec Vite
- **Styling :** TailwindCSS (design noir/blanc minimaliste)
- **Mode :** Clair et Sombre (inversion totale des couleurs)
- **Responsive :** Optimisé pour smartphones bas et moyens de gamme

## 📦 Installation

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd TAXIA
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Accéder à l'application**

Ouvrez votre navigateur et allez sur `http://localhost:5173`

## 🛠️ Scripts Disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm run preview` - Prévisualise la version de production

## 🎨 Design System

### Palette de Couleurs

**Mode Clair :**
- Fond : Blanc (#FFFFFF)
- Texte : Noir (#000000)
- Accents : Nuances de gris

**Mode Sombre :**
- Fond : Noir (#000000)
- Texte : Blanc (#FFFFFF)
- Accents : Nuances de gris inversées

### Principes de Design

- **Minimalisme :** Interface épurée, focus sur l'essentiel
- **Contraste :** Noir et blanc uniquement pour une lisibilité maximale
- **Performance :** Optimisé pour les appareils bas de gamme
- **Accessibilité :** Navigation simple et intuitive

## 🧠 Intelligence Artificielle

L'IA de TAXIA offre plusieurs fonctionnalités clés :

1. **Calcul d'itinéraire optimisé**
   - Analyse de la circulation en temps réel
   - Prise en compte des sens uniques
   - Identification des zones praticables
   - Calcul du trajet le plus court ET le plus rapide

2. **Attribution intelligente des chauffeurs**
   - Sélection basée sur la proximité
   - Prise en compte de la note du chauffeur
   - Optimisation du temps d'attente

3. **Apprentissage continu**
   - Amélioration des estimations de durée
   - Affinement des calculs de prix
   - Adaptation aux conditions locales

## 💳 Système de Paiement

- **Mode de paiement unique :** Cash uniquement
- **Moment du paiement :** À la fin de la course
- **Processus :**
  1. Client paie le chauffeur en espèces
  2. Chauffeur enregistre le paiement dans l'app
  3. Système suit le montant à reverser à l'administration
  4. Chauffeur effectue le versement périodiquement

## 🔐 Sécurité

- Vérification stricte des chauffeurs (documents + véhicule)
- Contrôle GPS pour éviter les fraudes sur la distance
- Système de notation pour maintenir la qualité
- Historique complet de toutes les transactions

## 🌍 Langues Supportées

- Français
- Anglais
- Swahili

## 📱 Compatibilité

- **Web :** Tous les navigateurs modernes
- **Mobile :** Responsive design optimisé pour :
  - Smartphones Android (version 8+)
  - iOS (version 12+)
  - Appareils bas et moyens de gamme

## 🗺️ Roadmap

### Phase 1 : MVP (En cours)
- [x] Page de présentation
- [ ] Système d'authentification
- [ ] Interface client de base
- [ ] Interface chauffeur de base
- [ ] Dashboard administration

### Phase 2 : Fonctionnalités Avancées
- [ ] Intégration IA pour calcul d'itinéraire
- [ ] Système de notifications en temps réel
- [ ] Géolocalisation et suivi GPS
- [ ] Système de paiement et versements

### Phase 3 : Optimisation
- [ ] Amélioration de l'IA
- [ ] Analytics et statistiques avancées
- [ ] Support multilingue complet
- [ ] Optimisation des performances

## 👥 Contribution

Ce projet est actuellement en développement. Les contributions seront bientôt acceptées.

## 📄 Licence

Tous droits réservés © 2025 TAXIA

## 📞 Contact

Pour toute question ou suggestion concernant TAXIA, n'hésitez pas à nous contacter.

---

**TAXIA** - *Déplacez-vous plus vite et malin en RDC* 🚖
- Dev: npm run dev
- Build: npm run build
- Preview: npm run preview

Tailwind est preconfigure.
