const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up AR Plant Backend...\n');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('📝 Creating .env file...');
  
  const envContent = `# MongoDB Connection String
MONGO_URI=mongodb://localhost:27017/ar-plant-app

# JWT Secret for token signing
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL for CORS
CLIENT_URL=http://localhost:3000
`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created successfully!');
  console.log('⚠️  Please update the MONGO_URI and JWT_SECRET in the .env file');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running on your system');
console.log('2. Update the MONGO_URI in .env if needed');
console.log('3. Run: npm install (if not already done)');
console.log('4. Run: npm run dev (to start the server)');
console.log('5. Run: node test-api.js (to test the APIs)');
console.log('\n�� Setup complete!'); 