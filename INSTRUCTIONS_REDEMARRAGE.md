# 🔄 INSTRUCTIONS DE REDÉMARRAGE

## ✅ BASE DE DONNÉES SUPPRIMÉE

La base de données `backend/database/taxia.db` a été supprimée.

---

## 🚀 REDÉMARRER LE BACKEND

### 1. Arrêter le backend actuel
```bash
# Appuyer sur Ctrl+C dans le terminal du backend
```

### 2. Redémarrer le backend
```bash
cd backend
npm run dev
```

### 3. Vérifier les logs

Tu devrais voir :
```
✅ Admin créé - Téléphone: +243999224209
✅ 3 chauffeurs de test créés (password: driver123)
✅ Colonnes GPS ajoutées à la table drivers
✅ Base de données initialisée avec succès
🚀 Serveur démarré sur le port 5000
```

---

## 🎯 NOUVELLE STRUCTURE

La nouvelle base de données aura :

### Table `rides`
```sql
CREATE TABLE rides (
  id INTEGER PRIMARY KEY,
  client_id INTEGER NOT NULL,
  driver_id INTEGER,
  pickup_address TEXT NOT NULL,
  pickup_lat REAL,              -- ✅ Accepte NULL (mode manuel)
  pickup_lng REAL,              -- ✅ Accepte NULL (mode manuel)
  dropoff_address TEXT NOT NULL,
  dropoff_lat REAL,             -- ✅ Accepte NULL (mode manuel)
  dropoff_lng REAL,             -- ✅ Accepte NULL (mode manuel)
  distance REAL,
  duration INTEGER,
  price REAL,
  status TEXT DEFAULT 'pending',
  estimated_arrival_time INTEGER,
  ...
)
```

---

## 🧪 TESTER LE MODE MANUEL

### 1. Activer Mode Manuel
```
Toggle → Mode Manuel
```

### 2. Remplir les champs
```
Point de départ: Avenue du 30 Juin, Lubumbashi
Destination: Avenue Bel-Bien, Polytechnique
```

### 3. Cliquer "Envoyer la demande"

### 4. Vérifier les logs backend
```
📝 Mode manuel activé - Course sans calcul automatique
✅ Course manuelle #1 créée - En attente du prix admin
```

### 5. Vérifier l'interface
```
✅ Demande envoyée !
Course #1
✅ Votre demande a été transmise à l'administration
⏳ Un chauffeur vous sera assigné manuellement
📱 Vous recevrez une notification dès l'attribution
```

---

## 📊 DONNÉES PAR DÉFAUT

### Admin
- **Téléphone** : +243999224209
- **Password** : Dimanche07
- **Email** : keranenexus@gmail.com

### Chauffeurs de test
1. **Jean Kabongo** - +243810000001 - Toyota Corolla (KIN-001-AB) - Kinshasa
2. **Marie Tshimanga** - +243810000002 - Honda Civic (KIN-002-CD) - Kinshasa
3. **Pierre Mwamba** - +243810000003 - Nissan Sentra (LUB-001-EF) - Lubumbashi

**Password pour tous** : driver123

---

## ✅ CHECKLIST

- [ ] Backend arrêté
- [ ] Backend redémarré
- [ ] Logs de création affichés
- [ ] Mode Manuel testé
- [ ] Course créée avec succès

---

**PRÊT À REDÉMARRER ! 🚀**
