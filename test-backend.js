// Script de test rapide du backend
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function testBackend() {
  console.log('🧪 Test du backend TAXIA...\n');

  try {
    // Test 1: Health check
    console.log('1️⃣ Test health check...');
    const health = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend actif:', health.data);

    // Test 2: Login admin
    console.log('\n2️⃣ Test login admin...');
    const login = await axios.post(`${API_URL}/auth/login`, {
      phone: '+243999224209',
      password: 'Dimanche07'
    });
    console.log('✅ Login réussi:', login.data.user.name);
    const token = login.data.token;

    // Test 3: Get profile
    console.log('\n3️⃣ Test récupération profil...');
    const profile = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Profil récupéré:', profile.data.user.email);

    // Test 4: Get rides
    console.log('\n4️⃣ Test récupération courses...');
    const rides = await axios.get(`${API_URL}/rides/my-rides`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Courses récupérées:', rides.data.rides.length);

    console.log('\n✅ Tous les tests passés !');
  } catch (error) {
    console.error('\n❌ Erreur:', error.response?.data || error.message);
    process.exit(1);
  }
}

testBackend();
