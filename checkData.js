const { MongoClient } = require('mongodb');
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let db;

async function connectToMongo() {
  try {
    await client.connect();

    // ✅ Explicitly connect to the correct database
    db = client.db("AR-Plant-Identifier");

    console.log("✅ Connected to MongoDB: AR-Plant-Identifier");
    return db;
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

module.exports = connectToMongo;
