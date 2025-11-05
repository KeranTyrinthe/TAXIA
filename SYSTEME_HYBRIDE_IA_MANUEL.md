# 🤖✍️ SYSTÈME HYBRIDE : IA + MANUEL

## 🎯 CONCEPT

Le client peut choisir entre **2 modes** :

### 🤖 Mode IA (Automatique)
- Suggestions d'adresses intelligentes
- Calcul automatique de l'itinéraire
- Prix calculé automatiquement
- Attribution automatique du meilleur chauffeur
- Notification automatique au chauffeur

### ✍️ Mode Manuel
- Saisie manuelle des adresses (texte libre)
- Pas de calcul automatique
- **Admin reçoit notification**
- **Admin assigne manuellement un chauffeur**
- **Chauffeur reçoit notification de l'admin**

---

## 🔄 FLUX COMPLET

### Mode IA (Automatique)

```
1. Client active Mode IA 🤖
   ↓
2. Tape "Avenue" → Suggestions apparaissent
   ↓
3. Sélectionne "Avenue Bel-Bien, Lubumbashi"
   ↓
4. Backend calcule automatiquement:
   - Distance: 5.3 km
   - Durée: 11 min
   - Prix: 3669 FC
   - Itinéraire: 247 points (OSRM)
   ↓
5. IA trouve le meilleur chauffeur:
   - Distance du chauffeur au client
   - Note du chauffeur
   - Disponibilité
   ↓
6. Attribution automatique
   ↓
7. Notifications envoyées:
   ✅ Admin: "Chauffeur Jean assigné"
   ✅ Chauffeur: "Nouvelle course assignée"
   ✅ Client: "Chauffeur en route"
```

### Mode Manuel

```
1. Client active Mode Manuel ✍️
   ↓
2. Tape manuellement:
   - Départ: "Avenue du 30 Juin, Lubumbashi"
   - Destination: "Avenue Bel-Bien, Polytechnique"
   ↓
3. Clique "Commander"
   ↓
4. Backend crée la course SANS calcul:
   - Distance: NULL
   - Durée: NULL
   - Prix: NULL
   - Status: 'pending'
   ↓
5. Notification envoyée à l'ADMIN:
   📝 "Nouvelle course MANUELLE
       De: Avenue du 30 Juin, Lubumbashi
       Vers: Avenue Bel-Bien, Polytechnique
       ⚠️ Attribution manuelle requise"
   ↓
6. Admin ouvre l'interface admin
   ↓
7. Admin voit la course en attente
   ↓
8. Admin choisit un chauffeur manuellement
   ↓
9. Admin clique "Assigner à Jean Kabongo"
   ↓
10. Notification envoyée au CHAUFFEUR:
    🚗 "Nouvelle course assignée
        De: Avenue du 30 Juin, Lubumbashi
        Vers: Avenue Bel-Bien, Polytechnique
        Client: +243999224209"
   ↓
11. Chauffeur accepte et démarre
```

---

## 💻 IMPLÉMENTATION

### Frontend (Client Dashboard)

#### Toggle Mode
```jsx
const [useManualMode, setUseManualMode] = useState(false);

<button onClick={() => setUseManualMode(!useManualMode)}>
  {useManualMode ? '✍️ Mode Manuel' : '🤖 Mode IA'}
</button>
```

#### Champs Conditionnels
```jsx
{useManualMode ? (
  // Input texte simple
  <input
    type="text"
    value={pickup.address}
    onChange={(e) => setPickup({ address: e.target.value, lat: null, lng: null })}
    placeholder="Ex: Avenue du 30 Juin, Lubumbashi"
  />
) : (
  // AddressInput avec suggestions IA
  <AddressInput
    value={pickup.address}
    onSelect={(data) => setPickup(data)}
    city={cityForSearch}
  />
)}
```

#### Envoi au Backend
```javascript
const response = await ridesAPI.create({
  pickup_address: pickup.address,
  pickup_lat: pickup.lat,      // NULL en mode manuel
  pickup_lng: pickup.lng,       // NULL en mode manuel
  dropoff_address: dropoff.address,
  dropoff_lat: dropoff.lat,     // NULL en mode manuel
  dropoff_lng: dropoff.lng,     // NULL en mode manuel
  manual_mode: useManualMode    // true ou false
});
```

### Backend (Routes)

#### Détection du Mode
```javascript
const { manual_mode } = req.body;

if (manual_mode) {
  // MODE MANUEL
  console.log('📝 Mode manuel activé');
  
  // Créer course sans calcul
  result = db.prepare(`
    INSERT INTO rides (...)
    VALUES (?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, 'pending', NULL)
  `).run(...);
  
  // Notifier admin pour attribution manuelle
  await notifyUser(admin.id, 
    '📝 Nouvelle course MANUELLE',
    `De: ${pickup_address}\nVers: ${dropoff_address}\n⚠️ Attribution manuelle requise`
  );
  
} else {
  // MODE IA
  console.log('🤖 Mode IA activé');
  
  // Calculer itinéraire
  const route = await calculateRoute(pickup, dropoff);
  
  // Créer course avec calcul
  result = db.prepare(`
    INSERT INTO rides (...)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
  `).run(..., route.distance, route.duration, route.price, ...);
  
  // Trouver meilleur chauffeur
  const bestDriver = await findBestDriver(pickup_lat, pickup_lng);
  
  // Assigner automatiquement
  if (bestDriver) {
    db.prepare(`UPDATE rides SET driver_id = ? WHERE id = ?`)
      .run(bestDriver.id, result.lastInsertRowid);
    
    // Notifier chauffeur
    await notifyUser(bestDriver.id, '🚗 Nouvelle course assignée', ...);
  }
}
```

---

## 🎨 INTERFACE UTILISATEUR

### Toggle Switch

```
┌─────────────────────────────────────────┐
│ 🤖 Mode IA                    ⚪────○   │
│ Suggestions automatiques                │
└─────────────────────────────────────────┘

Clic sur le toggle →

┌─────────────────────────────────────────┐
│ ✍️ Mode Manuel                ○────⚪   │
│ Saisie manuelle des adresses            │
└─────────────────────────────────────────┘
```

### Mode IA

```
📍 Localisation détectée
   30 Juin / Lubumbashi

Point de départ
┌─────────────────────────────────────────┐
│ 30 Juin, Lubumbashi                  🔍 │
└─────────────────────────────────────────┘
  ↓ Suggestions
  • 30 Juin, Lubumbashi
  • Avenue du 30 Juin, Lubumbashi
  • Boulevard du 30 Juin, Lubumbashi

Destination
┌─────────────────────────────────────────┐
│ Avenue                                🔍 │
└─────────────────────────────────────────┘
  ↓ Suggestions
  • Avenue Bel-Bien, Lubumbashi
  • Avenue Kambove, Lubumbashi
  • Avenue Kasai, Lubumbashi
```

### Mode Manuel

```
Point de départ
┌─────────────────────────────────────────┐
│ Avenue du 30 Juin, Lubumbashi           │
└─────────────────────────────────────────┘
(Pas de suggestions)

Destination
┌─────────────────────────────────────────┐
│ Avenue Bel-Bien, Polytechnique          │
└─────────────────────────────────────────┘
(Pas de suggestions)
```

---

## 📱 NOTIFICATIONS

### Admin (Mode Manuel)

```
╔═══════════════════════════════════════╗
║ 📝 Nouvelle course MANUELLE           ║
╠═══════════════════════════════════════╣
║ De: Avenue du 30 Juin, Lubumbashi     ║
║ Vers: Avenue Bel-Bien, Polytechnique  ║
║                                       ║
║ ⚠️ Attribution manuelle requise       ║
╚═══════════════════════════════════════╝
```

### Admin (Mode IA)

```
╔═══════════════════════════════════════╗
║ 🚕 Nouvelle commande                  ║
╠═══════════════════════════════════════╣
║ Course de 30 Juin vers Bel-Bien       ║
║ 5.3km - 3669FC                        ║
║                                       ║
║ ✅ Jean Kabongo assigné automatiquement║
╚═══════════════════════════════════════╝
```

### Chauffeur (Mode Manuel - après attribution admin)

```
╔═══════════════════════════════════════╗
║ 🚗 Nouvelle course assignée           ║
╠═══════════════════════════════════════╣
║ De: Avenue du 30 Juin, Lubumbashi     ║
║ Vers: Avenue Bel-Bien, Polytechnique  ║
║                                       ║
║ Client: +243999224209                 ║
║ Assigné par: Admin                    ║
╚═══════════════════════════════════════╝
```

### Chauffeur (Mode IA - attribution automatique)

```
╔═══════════════════════════════════════╗
║ 🚗 Nouvelle course assignée           ║
╠═══════════════════════════════════════╣
║ De: 30 Juin vers Bel-Bien             ║
║ 5.3km - 3669FC                        ║
║                                       ║
║ Client: +243999224209                 ║
║ Assigné automatiquement par IA        ║
╚═══════════════════════════════════════╝
```

---

## 🔍 LOGS BACKEND

### Mode Manuel
```
📝 Mode manuel activé - Course sans calcul automatique
✅ Course manuelle #12 créée - En attente d'attribution admin
📧 Notification envoyée à admin (ID: 1)
```

### Mode IA
```
🤖 Mode IA activé - Calcul automatique
🗺️ Calcul route: De [-11.67, 27.47] À [-11.65, 27.48]
✅ OSRM Geometry points: 247
✅ Route OSRM calculée: 5.3km, 11min, 3669FC, 247 points
🔍 Recherche meilleur chauffeur...
✅ Course #13 assignée à Jean Kabongo
📧 Notification envoyée à chauffeur (ID: 5)
```

---

## ✅ AVANTAGES

### Mode IA
- ✅ **Rapide** : Attribution en quelques secondes
- ✅ **Précis** : Calcul exact de distance/prix
- ✅ **Optimal** : Meilleur chauffeur sélectionné
- ✅ **Automatique** : Aucune intervention admin

### Mode Manuel
- ✅ **Flexible** : Adresses non standardisées acceptées
- ✅ **Contrôle** : Admin choisit le chauffeur
- ✅ **Personnalisé** : Cas particuliers gérés
- ✅ **Simple** : Pas besoin de GPS précis

---

## 🎯 CAS D'USAGE

### Utiliser Mode IA quand :
- ✅ Adresse connue et standardisée
- ✅ GPS fonctionne bien
- ✅ Besoin de prix immédiat
- ✅ Urgence (attribution rapide)

### Utiliser Mode Manuel quand :
- ✅ Adresse non standardisée ("Chez Jean, près du marché")
- ✅ GPS imprécis ou indisponible
- ✅ Cas particulier (VIP, livraison spéciale)
- ✅ Client préfère décrire l'adresse

---

## 🚀 PROCHAINES ÉTAPES

### Immédiat
1. ✅ Toggle IA/Manuel implémenté
2. ✅ Backend gère les 2 modes
3. ✅ Notifications différenciées
4. [ ] Interface admin pour attribution manuelle

### À venir
1. [ ] Admin peut définir prix manuellement
2. [ ] Admin peut envoyer message au chauffeur
3. [ ] Historique des attributions manuelles
4. [ ] Stats : % IA vs % Manuel

---

**LE SYSTÈME HYBRIDE EST PRÊT ! Le client choisit, l'admin contrôle ! 🎉**
