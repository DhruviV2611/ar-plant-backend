// plant.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  entryId: { type: String, required: true }, // Unique ID for each entry
  timestamp: { type: Date, default: Date.now },
  notes: { type: String, required: true },
  photoUrl: String, // URL to the stored photo
  // Add more fields here for growth measurement, e.g., height: Number
});

const reminderSchema = new mongoose.Schema({
  reminderId: { type: String, required: true },
  type: { type: String, enum: ['watering', 'fertilizing', 'pruning', 'repotting', 'general'], required: true },
  date: { type: Date, required: true }, // The date the reminder is due
  notes: String,
  isCompleted: { type: Boolean, default: false },
});

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  scientificName: { // New field for scientific name
    type: String,
    trim: true,
    default: ''
  },
  commonName: { // New field for common name (if different from 'name')
    type: String,
    trim: true,
    default: ''
  },
  confidenceScore: { // From AR identification
    type: Number,
    min: 0,
    max: 1,
  },
  careTips: {
    light: String,
    water: String,
    soil: String,
    temperature: String,
    growthTips: String,
    maintenanceFrequency: String,
    indoorSuitability: { type: Boolean, default: false },
    outdoorSuitability: { type: Boolean, default: false },
  },
  toxicity: {
    isToxicToCats: { type: Boolean, default: false }, // Specific for cats
    isToxicToDogs: { type: Boolean, default: false }, // Specific for dogs
    isToxicToHumans: { type: Boolean, default: false }, // Specific for humans
    symptoms: String, // e.g., "Vomiting, diarrhea"
    severity: String, // e.g., "Mild", "Moderate", "Severe"
    notes: String, // Additional details
    sources: [String], // Array to store sources like "ASPCA"
  },
  // imageUrl: [String], // This is replaced by photos in journalEntries for specific timestamps
  journalEntries: [journalEntrySchema], // Array of journal entries
  reminders: [reminderSchema], // Array of reminders for this plant
   userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // userNotes: String, // General notes about the plant, can be combined with journal
  foundLocation: String,
  plantedDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Plant', plantSchema);