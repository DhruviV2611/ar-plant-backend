// plantController.js
const Plant = require('../models/plant');
const PDFDocument = require('pdfkit');

exports.getPlants = async (req, res) => {
  try {
    console.log('Token decoded user:', req.user); // should log user with an id
    const plants = await Plant.find({ userId: req.user.id });
    res.status(200).json(plants);
  } catch (error) {
    console.error('Error in getPlants:', error);
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
  } catch (err) {
    console.error('addPlant error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    const plant = await Plant.findOne({ _id: req.params.id, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized' });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error('Error in getPlantById:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    const plant = await Plant.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized to delete' });
    }
    res.status(200).json({ message: 'Plant removed' });
  } catch (error) {
    console.error('Error in deletePlant:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized to update' });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error('Error in updatePlant:', error);
    res.status(400).json({ message: 'Error updating plant', error: error.message });
  }
};

exports.identifyPlant = async (req, res) => {
  // This is a placeholder for actual plant identification logic (e.g., external API call)
  try {
    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ message: 'Photo URL is required for identification.' });
    }

    // Simulate an external API call for plant identification
    const identifiedData = {
      scientificName: 'Monstera deliciosa',
      commonName: 'Swiss Cheese Plant',
      confidenceScore: 0.95,
      careTips: {
        light: 'Bright indirect light',
        water: 'Water when top inch of soil is dry',
        soil: 'Well-draining potting mix',
        temperature: '18-30°C',
      },
      toxicity: {
        isToxicToCats: true,
        isToxicToDogs: true,
        isToxicToHumans: true,
        symptoms: 'Oral irritation, vomiting, difficulty swallowing',
        severity: 'Mild to Moderate',
      },
      imageUrl: photoUrl,
    };
    res.status(200).json(identifiedData);
  } catch (error) {
    console.error('Error in identifyPlant:', error);
    res.status(500).json({ message: 'Plant identification failed.' });
  }
};

exports.getCareTipsBySpecies = async (req, res) => {
  try {
    const { species } = req.params;
    // In a real application, you might fetch this from a database or external API
    const careTips = {
      'Monstera deliciosa': {
        light: 'Bright indirect light',
        water: 'Water when top inch of soil is dry',
        soil: 'Well-draining potting mix',
        temperature: '18-30°C',
        growthTips: 'Provide a moss pole for climbing.',
        maintenanceFrequency: 'Moderate',
        indoorSuitability: true,
        outdoorSuitability: false,
      },
      'Aloe vera': {
        light: 'Bright direct light',
        water: 'Water thoroughly, allow soil to dry completely between waterings',
        soil: 'Sandy, well-draining soil',
        temperature: '13-27°C',
        growthTips: 'Propagate from pups.',
        maintenanceFrequency: 'Low',
        indoorSuitability: true,
        outdoorSuitability: true,
      },
      // ... more species
    };
    const tips = careTips[species];
    if (tips) {
      res.status(200).json(tips);
    } else {
      res.status(404).json({ message: 'Care tips not found for this species.' });
    }
  } catch (error) {
    console.error('Error in getCareTipsBySpecies:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.getToxicityInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const plant = await Plant.findOne({ _id: id, userId: req.user.id }).select('toxicity');
    if (!plant || !plant.toxicity) {
      return res.status(404).json({ message: 'Toxicity information not found for this plant.' });
    }
    res.status(200).json(plant.toxicity);
  } catch (error) {
    console.error('Error in getToxicityInfo:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addJournalEntry = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { notes, photoUrl } = req.body;

    if (!notes) {
      return res.status(400).json({ message: 'Journal entry notes are required.' });
    }

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized.' });
    }

    const newEntry = {
      entryId: new mongoose.Types.ObjectId().toString(), // Generate a unique ID for the entry
      notes,
      photoUrl,
      timestamp: new Date(),
    };
    plant.journalEntries.push(newEntry);
    await plant.save();

    res.status(201).json(plant); // Return the updated plant object
  } catch (error) {
    console.error('Error adding journal entry:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    const { plantId, entryId } = req.params;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized.' });
    }

    plant.journalEntries = plant.journalEntries.filter(
      (entry) => entry.entryId !== entryId
    );
    await plant.save();

    res.status(200).json(plant); // Return the updated plant object
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateJournalEntry = async (req, res) => {
  try {
    const { plantId, entryId } = req.params;
    const { notes, photoUrl } = req.body;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user.id });
    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or not authorized.' });
    }

    const entryIndex = plant.journalEntries.findIndex(
      (entry) => entry.entryId === entryId
    );

    if (entryIndex === -1) {
      return res.status(404).json({ message: 'Journal entry not found.' });
    }

    // Update the entry
    plant.journalEntries[entryIndex].notes = notes || plant.journalEntries[entryIndex].notes;
    plant.journalEntries[entryIndex].photoUrl = photoUrl || plant.journalEntries[entryIndex].photoUrl;
    // Optionally update timestamp if the entry content changes
    plant.journalEntries[entryIndex].timestamp = new Date();

    await plant.save();

    res.status(200).json(plant); // Return the updated plant object
  } catch (error) {
    console.error('Error updating journal entry:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Export journal to PDF
exports.exportJournalPDF = async (req, res) => {
  const plants = await Plant.find({ userId: req.user.id }).populate('journalEntries');

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
      .text(`Plant Name: ${plant.name}`, { underline: true })
      .fontSize(12)
      .text(`Scientific Name: ${plant.scientificName || 'N/A'}`)
      .text(`Planted Date: ${plant.plantedDate ? new Date(plant.plantedDate).toLocaleDateString() : 'N/A'}`)
      .moveDown()
      .text('Care Tips:', { underline: true })
      .text(`  Light: ${plant.careTips?.light || 'N/A'}`)
      .text(`  Water: ${plant.careTips?.water || 'N/A'}`)
      .text(`  Temperature: ${plant.careTips?.temperature || 'N/A'}`)
      .text(`  Soil: ${plant.careTips?.soil || 'N/A'}`)
      .moveDown();

    if (plant.journalEntries && plant.journalEntries.length > 0) {
      doc.fontSize(12).text('Journal Entries:', { underline: true });
      plant.journalEntries.forEach((entry) => {
        doc
          .text(`  Date: ${new Date(entry.timestamp).toLocaleDateString()}`)
          .text(`  Notes: ${entry.notes}`)
          .text(`  Photo: ${entry.photoUrl || 'N/A'}`)
          .moveDown();
      });
    } else {
      doc.fontSize(12).text('No journal entries for this plant.', { italic: true }).moveDown();
    }
    doc.moveDown(); // Space between plants
  });

  doc.end();
};