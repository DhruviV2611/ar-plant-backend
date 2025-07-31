// plantController.js
const Plant = require('../models/plant');
const PDFDocument = require('pdfkit');
exports.getPlants = async (req, res) => {
  try {
    console.log(req,'req');
    
  const userId = req.id;
console.log("userId",userId)
    if (!userId) {
      return res.status(400).json({ message: 'User ID not found in token' });
    }

    const plants = await Plant.find({ userId });
    res.json(plants);
  } catch (err) {
    console.error('getPlants error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};



exports.addPlant = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid request body',
        error: 'Request body must be a valid JSON object'
      });
    }

    // Validate required fields
    const { name, scientificName } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ 
        message: 'Invalid plant data',
        error: 'Plant name is required and must be a string'
      });
    }

    // Add the userId from the authenticated user to the plant data
    const plantData = { ...req.body, userId: req.user.id };
    const plant = new Plant(plantData);
    await plant.save();
    res.status(201).json(plant);
    console.log('plant', plant);
  } catch (err) {
    console.error('Add plant error:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error',
        error: Object.values(err.errors).map(e => e.message).join(', ')
      });
    }
    res.status(500).json({ 
      message: 'Server Error',
      error: 'Failed to add plant'
    });
  }
};

// Get one plant by ID (ensure it belongs to the user)
exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plant) return res.status(404).json({ message: 'Plant not found or you do not have permission to access it' });
    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a plant by ID (ensure it belongs to the user)
exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!plant) return res.status(404).json({ message: 'Plant not found or you do not have permission to delete it' });
    res.json({ message: 'Plant deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update a plant by ID (ensure it belongs to the user)
exports.updatePlant = async (req, res) => {
  try {
    // Also ensure updatedBy field is set to current user id, useful for auditing
    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() }, // Update updatedAt timestamp
      { new: true }
    );
    if (!plant) return res.status(404).json({ message: 'Plant not found or you do not have permission to update it' });
    res.json(plant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

// AR Plant Identification (stub/mock version)
exports.identifyPlant = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ 
        message: 'Invalid request body',
        error: 'Request body must be a valid JSON object'
      });
    }

    const { imageBase64 } = req.body;

    // Validate imageBase64
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ 
        message: 'Invalid image data',
        error: 'imageBase64 field is required and must be a string'
      });
    }

    // Basic validation for base64 format
    if (!imageBase64.startsWith('data:image/') && !/^[A-Za-z0-9+/]*={0,2}$/.test(imageBase64)) {
      return res.status(400).json({ 
        message: 'Invalid image format',
        error: 'imageBase64 must be a valid base64 encoded image'
      });
    }

    // Replace this stub with a real ML model or external API integration
    const mockResult = {
      scientificName: 'Ficus lyrata',
      commonName: 'Fiddle Leaf Fig',
      confidenceScore: 0.91,
    };

    res.json(mockResult);
  } catch (err) {
    console.error('Plant identification error:', err);
    res.status(500).json({ 
      message: 'Identification failed',
      error: 'An error occurred during plant identification'
    });
  }
};

exports.getCareTipsBySpecies = async (req, res) => {
  const species = req.params.species;
  // In future, fetch from a central care guide collection
  const plant = await Plant.findOne({ scientificName: species });
  if (!plant) return res.status(404).json({ message: 'Not found' });

  res.json(plant.careTips);
};

exports.getToxicityInfo = async (req, res) => {
  const plant = await Plant.findOne({ _id: req.params.id, userId: req.user.id });
  if (!plant) return res.status(404).json({ message: 'Not found' });

  res.json(plant.toxicity);
};

exports.addJournalEntry = async (req, res) => {
  const { notes, photoUrl } = req.body;
  const { plantId } = req.params;

  const entry = {
    entryId: new mongoose.Types.ObjectId().toString(),
    notes,
    photoUrl,
  };

  const plant = await Plant.findOneAndUpdate(
    { _id: plantId, userId: req.user.id },
    { $push: { journalEntries: entry }, updatedAt: Date.now() },
    { new: true }
  );

  res.json(plant);
};

exports.deleteJournalEntry = async (req, res) => {
  const { plantId, entryId } = req.params;

  const plant = await Plant.findOneAndUpdate(
    { _id: plantId, userId: req.user.id },
    { $pull: { journalEntries: { entryId } }, updatedAt: Date.now() },
    { new: true }
  );

  res.json(plant);
};

exports.exportPDF = async (req, res) => {
  const plants = await Plant.find({ userId: req.user.id });
  const doc = new PDFDocument();
  let buffers = [];

  doc.on('data', buffers.push.bind(buffers));
  doc.on('end', () => {
    let pdfData = Buffer.concat(buffers);
    res
      .writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment;filename=garden_journal.pdf',
        'Content-Length': pdfData.length,
      })
      .end(pdfData);
  });

  doc.fontSize(18).text('Your Garden Journal', { align: 'center' });
  plants.forEach((plant) => {
    doc
      .moveDown()
      .fontSize(14)
      .text(`🌿 ${plant.name} (${plant.scientificName})`, { underline: true })
      .fontSize(12)
      .text(`Care: ${plant.careTips?.light || ''}`)
      .text(`Toxicity: ${plant.toxicity?.severity || 'None'}`)
      .text(`Journal Entries: ${plant.journalEntries.length}`);
  });

  doc.end();
};