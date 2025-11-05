# 🔄 FLUX MODE MANUEL COMPLET

## 📋 NOUVEAU WORKFLOW

```
1. Client écrit position + destination
   ↓
2. Status: waiting_price
   ↓
3. Admin reçoit notification → Définit prix
   ↓
4. Status: price_sent
   ↓
5. Client reçoit prix → Valide OU Rejette
   ↓
6a. Si VALIDÉ → Status: price_accepted
    ↓
    Admin assigne chauffeur + temps d'arrivée
    ↓
    Status: assigned
    ↓
    Chauffeur reçoit notification
    ↓
    Client reçoit notification (chauffeur + ETA)
    
6b. Si REJETÉ → Status: price_rejected
    ↓
    Admin notifié
    ↓
    Fin
```

---

## 🎯 STATUTS DE COURSE

### Nouveaux Statuts Ajoutés

| Statut | Description | Qui agit |
|--------|-------------|----------|
| `waiting_price` | En attente du prix admin | Admin |
| `price_sent` | Prix envoyé au client | Client |
| `price_accepted` | Client a accepté le prix | Admin |
| `price_rejected` | Client a refusé le prix | - |
| `assigned` | Chauffeur assigné | Chauffeur |
| `driver_on_way` | Chauffeur en route | - |
| `driver_arrived` | Chauffeur arrivé | Client |
| `in_progress` | Course en cours | - |
| `completed` | Course terminée | - |
| `cancelled` | Course annulée | - |

---

## 💻 BACKEND - ROUTES

### 1. Client Crée Course (Manuel)

**POST** `/rides`
```javascript
{
  pickup_address: "Avenue du 30 Juin, Lubumbashi",
  dropoff_address: "Avenue Bel-Bien, Polytechnique",
  manual_mode: true
}
```

**Réponse** :
```javascript
{
  ride: {
    id: 12,
    status: "waiting_price",
    price: null,
    distance: null,
    duration: null
  }
}
```

**Notification Admin** :
```
💰 Nouvelle demande - Définir prix
De: Avenue du 30 Juin, Lubumbashi
Vers: Avenue Bel-Bien, Polytechnique
⚠️ Veuillez définir le prix
```

### 2. Admin Définit Prix

**POST** `/admin/rides/:id/set-price`
```javascript
{
  price: 5000
}
```

**Réponse** :
```javascript
{
  message: "Prix défini avec succès",
  price: 5000
}
```

**Notification Client** :
```
💰 Prix proposé
Prix pour votre course: 5000 FC
De: Avenue du 30 Juin, Lubumbashi
Vers: Avenue Bel-Bien, Polytechnique
Validez ou refusez dans votre interface
```

### 3a. Client Accepte Prix

**POST** `/rides/:id/accept-price`

**Réponse** :
```javascript
{
  message: "Prix accepté",
  status: "price_accepted"
}
```

**Notification Admin** :
```
✅ Prix accepté
Course #12
Client a accepté le prix de 5000 FC
Assignez maintenant un chauffeur
```

### 3b. Client Refuse Prix

**POST** `/rides/:id/reject-price`

**Réponse** :
```javascript
{
  message: "Prix refusé",
  status: "price_rejected"
}
```

**Notification Admin** :
```
❌ Prix refusé
Course #12
Client a refusé le prix de 5000 FC
```

### 4. Admin Assigne Chauffeur

**POST** `/admin/rides/:id/assign-driver`
```javascript
{
  driver_id: 5,
  estimated_arrival_time: 15
}
```

**Réponse** :
```javascript
{
  message: "Chauffeur assigné avec succès",
  driver: "Jean Kabongo",
  estimated_arrival_time: 15
}
```

**Notification Chauffeur** :
```
🚗 Nouvelle course assignée
De: Avenue du 30 Juin, Lubumbashi
Vers: Avenue Bel-Bien, Polytechnique
Prix: 5000 FC
Temps estimé: 15 min
```

**Notification Client** :
```
✅ Chauffeur assigné
Chauffeur: Jean Kabongo
Véhicule: Toyota Corolla (KIN-001-AB)
Arrivée estimée: 15 min
```

---

## 🎨 FRONTEND - INTERFACE CLIENT

### Étape 1 : Création Demande

```jsx
<div className="toggle">
  <svg><!-- Pencil icon --></svg>
  Mode Manuel
  <toggle-switch />
</div>

<input 
  placeholder="Ex: Avenue du 30 Juin, Lubumbashi"
  value={pickup.address}
/>

<input 
  placeholder="Ex: Avenue Bel-Bien, Polytechnique"
  value={dropoff.address}
/>

<button onClick={createRide}>
  <svg><!-- Send icon --></svg>
  Envoyer la demande
</button>
```

### Étape 2 : En Attente Prix

```jsx
<div className="waiting">
  <svg><!-- Clock icon --></svg>
  <h3>En attente du prix</h3>
  <p>L'administration définit le prix de votre course...</p>
  <p>Vous recevrez une notification dès que le prix sera disponible</p>
</div>
```

### Étape 3 : Prix Reçu

```jsx
<div className="price-proposal">
  <svg><!-- Money icon --></svg>
  <h3>Prix proposé</h3>
  <div className="price">5000 FC</div>
  
  <div className="details">
    <p>De: Avenue du 30 Juin, Lubumbashi</p>
    <p>Vers: Avenue Bel-Bien, Polytechnique</p>
  </div>
  
  <div className="actions">
    <button onClick={acceptPrice} className="accept">
      <svg><!-- Check icon --></svg>
      Accepter
    </button>
    <button onClick={rejectPrice} className="reject">
      <svg><!-- X icon --></svg>
      Refuser
    </button>
  </div>
</div>
```

### Étape 4 : Prix Accepté

```jsx
<div className="waiting-driver">
  <svg><!-- User icon --></svg>
  <h3>Prix accepté</h3>
  <p>L'administration assigne un chauffeur...</p>
  <p>Vous recevrez une notification avec les détails</p>
</div>
```

### Étape 5 : Chauffeur Assigné

```jsx
<div className="driver-assigned">
  <svg><!-- Car icon --></svg>
  <h3>Chauffeur assigné</h3>
  
  <div className="driver-info">
    <img src={driver.photo} />
    <div>
      <p className="name">{driver.name}</p>
      <p className="vehicle">{driver.vehicle_model}</p>
      <p className="plate">{driver.vehicle_plate}</p>
    </div>
  </div>
  
  <div className="eta">
    <svg><!-- Clock icon --></svg>
    <p>Arrivée estimée: <strong>15 min</strong></p>
  </div>
  
  <button onClick={trackRide}>
    <svg><!-- Map icon --></svg>
    Suivre la course
  </button>
</div>
```

---

## 🎨 FRONTEND - INTERFACE ADMIN

### Liste Courses en Attente Prix

```jsx
<div className="pending-prices">
  <h2>
    <svg><!-- Money icon --></svg>
    Courses en attente de prix
  </h2>
  
  {rides.filter(r => r.status === 'waiting_price').map(ride => (
    <div className="ride-card">
      <div className="header">
        <span className="id">Course #{ride.id}</span>
        <span className="badge">En attente</span>
      </div>
      
      <div className="addresses">
        <p>
          <svg><!-- Map pin icon --></svg>
          {ride.pickup_address}
        </p>
        <p>
          <svg><!-- Target icon --></svg>
          {ride.dropoff_address}
        </p>
      </div>
      
      <div className="client">
        <svg><!-- User icon --></svg>
        {ride.client_name} - {ride.client_phone}
      </div>
      
      <div className="price-input">
        <input 
          type="number" 
          placeholder="Prix en FC"
          value={price}
        />
        <button onClick={() => setPrice(ride.id, price)}>
          <svg><!-- Check icon --></svg>
          Définir le prix
        </button>
      </div>
    </div>
  ))}
</div>
```

### Liste Courses Prix Accepté

```jsx
<div className="accepted-prices">
  <h2>
    <svg><!-- Check icon --></svg>
    Courses à assigner
  </h2>
  
  {rides.filter(r => r.status === 'price_accepted').map(ride => (
    <div className="ride-card">
      <div className="header">
        <span className="id">Course #{ride.id}</span>
        <span className="price">{ride.price} FC</span>
      </div>
      
      <div className="addresses">
        <p>{ride.pickup_address}</p>
        <p>{ride.dropoff_address}</p>
      </div>
      
      <div className="assign-driver">
        <select value={selectedDriver}>
          {availableDrivers.map(driver => (
            <option value={driver.id}>
              {driver.name} - {driver.vehicle_model}
            </option>
          ))}
        </select>
        
        <input 
          type="number" 
          placeholder="Temps d'arrivée (min)"
          value={eta}
        />
        
        <button onClick={() => assignDriver(ride.id, selectedDriver, eta)}>
          <svg><!-- User check icon --></svg>
          Assigner
        </button>
      </div>
    </div>
  ))}
</div>
```

---

## 📱 NOTIFICATIONS

### Client

| Étape | Titre | Message |
|-------|-------|---------|
| Prix envoyé | 💰 Prix proposé | Prix: 5000 FC<br/>Validez ou refusez |
| Chauffeur assigné | ✅ Chauffeur assigné | Jean Kabongo<br/>Toyota Corolla<br/>ETA: 15 min |

### Admin

| Étape | Titre | Message |
|-------|-------|---------|
| Nouvelle demande | 💰 Définir prix | De: ...<br/>Vers: ...<br/>Veuillez définir le prix |
| Prix accepté | ✅ Prix accepté | Client a accepté 5000 FC<br/>Assignez un chauffeur |
| Prix refusé | ❌ Prix refusé | Client a refusé 5000 FC |

### Chauffeur

| Étape | Titre | Message |
|-------|-------|---------|
| Course assignée | 🚗 Nouvelle course | De: ...<br/>Vers: ...<br/>Prix: 5000 FC<br/>ETA: 15 min |

---

## ✅ CHECKLIST IMPLÉMENTATION

### Backend
- [x] Nouveaux statuts ajoutés
- [x] Colonne `estimated_arrival_time`
- [x] Route `/admin/rides/:id/set-price`
- [x] Route `/admin/rides/:id/assign-driver`
- [x] Route `/rides/:id/accept-price`
- [x] Route `/rides/:id/reject-price`
- [x] Notifications à chaque étape

### Frontend API
- [x] `ridesAPI.acceptPrice(id)`
- [x] `ridesAPI.rejectPrice(id)`
- [x] `adminAPI.setPrice(id, price)`
- [x] `adminAPI.assignDriver(id, driver_id, eta)`

### Frontend Client
- [ ] Interface en attente prix
- [ ] Interface validation prix
- [ ] Interface en attente chauffeur
- [ ] Interface chauffeur assigné

### Frontend Admin
- [ ] Liste courses en attente prix
- [ ] Formulaire définir prix
- [ ] Liste courses prix accepté
- [ ] Formulaire assigner chauffeur

---

## 🎉 RÉSULTAT FINAL

**Mode Manuel = Contrôle Total**

✅ Client décrit sa course librement
✅ Admin définit le prix manuellement
✅ Client valide ou refuse
✅ Admin choisit le chauffeur
✅ Admin définit le temps d'arrivée
✅ Tout le monde est notifié à chaque étape

**FLUX COMPLET ET LOGIQUE ! 🚀**
