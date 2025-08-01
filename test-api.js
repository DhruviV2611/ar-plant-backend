const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'testpassword123'
};

const testPlant = {
  name: 'Test Plant',
  scientificName: 'Testus plantus',
  careTips: {
    light: 'Bright indirect light',
    water: 'Water when top soil is dry'
  }
};

async function testAPI() {
  try {
    console.log('🧪 Testing API endpoints...\n');

    // Test 1: Register user
    console.log('1. Testing user registration...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data);
    } catch (error) {
      if (error.response?.status === 400 && error.response.data.message === 'User already exists') {
        console.log('ℹ️  User already exists, proceeding with login...');
      } else {
        console.log('❌ Registration failed:', error.response?.data || error.message);
      }
    }

    // Test 2: Login
    console.log('\n2. Testing user login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
      console.log('✅ Login successful');
      const token = loginResponse.data.token;
      
      // Test 3: Get user details
      console.log('\n3. Testing get user details...');
      try {
        const userDetailsResponse = await axios.get(`${BASE_URL}/auth/getUserDetails`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Get user details successful:', userDetailsResponse.data);
      } catch (error) {
        console.log('❌ Get user details failed:', error.response?.data || error.message);
      }

      // Test 4: Add plant (with authentication)
      console.log('\n4. Testing plant addition...');
      try {
        const addPlantResponse = await axios.post(`${BASE_URL}/plants/addPlant`, testPlant, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Plant addition successful:', addPlantResponse.data);
      } catch (error) {
        console.log('❌ Plant addition failed:', error.response?.data || error.message);
      }

      // Test 5: Get plants
      console.log('\n5. Testing get plants...');
      try {
        const getPlantsResponse = await axios.get(`${BASE_URL}/plants/getPlants`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('✅ Get plants successful:', getPlantsResponse.data);
      } catch (error) {
        console.log('❌ Get plants failed:', error.response?.data || error.message);
      }

    } catch (error) {
      console.log('❌ Login failed:', error.response?.data || error.message);
    }

    console.log('\n🎉 API testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAPI(); 