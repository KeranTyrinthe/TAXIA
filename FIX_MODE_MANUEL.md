# 🔧 FIX : Mode Manuel - "Impossible de créer la course"

## 🐛 PROBLÈME

**Erreur** : "Impossible de créer la course" en mode manuel

**Cause** : Validation backend rejetait les valeurs `null` pour les coordonnées

---

## ✅ CORRECTIONS APPLIQUÉES

### 1. Frontend - Ne pas envoyer de valeurs null

**Avant** :
```javascript
const response = await ridesAPI.create({
  pickup_address: pickup.address,
  pickup_lat: pickup.lat,      // null en mode manuel ❌
  pickup_lng: pickup.lng,       // null en mode manuel ❌
  dropoff_address: dropoff.address,
  dropoff_lat: dropoff.lat,    // null en mode manuel ❌
  dropoff_lng: dropoff.lng,    // null en mode manuel ❌
  manual_mode: useManualMode
});
```

**Après** :
```javascript
// Préparer les données selon le mode
const rideData = {
  pickup_address: pickup.address,
  dropoff_address: dropoff.address,
  manual_mode: useManualMode
};

// Ajouter les coordonnées seulement si elles existent (mode IA)
if (pickup.lat && pickup.lng) {
  rideData.pickup_lat = pickup.lat;
  rideData.pickup_lng = pickup.lng;
}
if (dropoff.lat && dropoff.lng) {
  rideData.dropoff_lat = dropoff.lat;
  rideData.dropoff_lng = dropoff.lng;
}

const response = await ridesAPI.create(rideData);
```

**Fichier** : `src/pages/client/Dashboard.jsx` ligne 152-169

---

### 2. Backend - Accepter les valeurs null

**Avant** :
```javascript
body('pickup_lat').optional().isFloat(),  // Rejette null ❌
body('pickup_lng').optional().isFloat(),
body('dropoff_lat').optional().isFloat(),
body('dropoff_lng').optional().isFloat()
```

**Après** :
```javascript
body('pickup_lat').optional({ nullable: true }).isFloat(),  // Accepte null ✅
body('pickup_lng').optional({ nullable: true }).isFloat(),
body('dropoff_lat').optional({ nullable: true }).isFloat(),
body('dropoff_lng').optional({ nullable: true }).isFloat()
```

**Fichier** : `backend/routes/rides.js` ligne 25-29

---

## 🎯 RÉSULTAT

### Mode IA
```javascript
{
  pickup_address: "30 Juin, Lubumbashi",
  pickup_lat: -11.67,     // ✅ Présent
  pickup_lng: 27.47,      // ✅ Présent
  dropoff_address: "Avenue Bel-Bien",
  dropoff_lat: -11.65,    // ✅ Présent
  dropoff_lng: 27.48,     // ✅ Présent
  manual_mode: false
}
```
✅ **Validation OK** → Calcul automatique

### Mode Manuel
```javascript
{
  pickup_address: "Avenue du 30 Juin, Lubumbashi",
  // pickup_lat: undefined  // ✅ Pas envoyé
  // pickup_lng: undefined  // ✅ Pas envoyé
  dropoff_address: "Avenue Bel-Bien, Polytechnique",
  // dropoff_lat: undefined // ✅ Pas envoyé
  // dropoff_lng: undefined // ✅ Pas envoyé
  manual_mode: true
}
```
✅ **Validation OK** → En attente prix admin

---

## 🧪 TEST

### Mode Manuel

1. **Activer Mode Manuel**
   ```
   Toggle → Mode Manuel
   ```

2. **Remplir les champs**
   ```
   Point de départ: Avenue du 30 Juin, Lubumbashi
   Destination: Avenue Bel-Bien, Polytechnique
   ```

3. **Cliquer "Envoyer la demande"**
   ```
   ✅ Demande envoyée !
   Course #12
   ✅ Votre demande a été transmise à l'administration
   ```

4. **Vérifier les logs backend**
   ```
   📝 Mode manuel activé - Course sans calcul automatique
   ✅ Course manuelle #12 créée - En attente du prix admin
   ```

---

## ✅ CHECKLIST

- [x] Frontend n'envoie pas de valeurs null
- [x] Backend accepte les champs absents
- [x] Validation avec `nullable: true`
- [x] Mode IA fonctionne toujours
- [x] Mode Manuel fonctionne maintenant

---

**FIX APPLIQUÉ LE** : 4 Novembre 2025, 17:00 UTC+1
**STATUT** : ✅ RÉSOLU
