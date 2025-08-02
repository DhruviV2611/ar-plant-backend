// plantController.js
const Plant = require('../models/plant');
const PDFDocument = require('pdfkit');

exports.getPlants = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    console.log('Fetching plants for user:', req.user._id);

    const plants = await Plant.find({ userId: req.user._id });
    res.status(200).json(plants);
  } catch (error) {
    console.error('Error in getPlants:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.addPlant = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const { name, scientificName } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({
        message: 'Invalid plant data',
        error: 'Plant name is required and must be a string',
      });
    }

    const plantData = { ...req.body, userId: req.user._id };
    const plant = new Plant(plantData);
    await plant.save();

    res.status(201).json(plant);
  } catch (err) {
    console.error('addPlant error:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.getPlantById = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const plant = await Plant.findOne({ _id: req.params.id, userId: req.user._id });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access to this plant.' });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error('getPlantById error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deletePlant = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const plant = await Plant.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access to delete this plant.' });
    }
    res.status(200).json({ message: 'Plant deleted successfully', plantId: req.params.id });
  } catch (error) {
    console.error('deletePlant error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.updatePlant = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const plant = await Plant.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true } // Return the updated document
    );

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access to update this plant.' });
    }
    res.status(200).json(plant);
  } catch (error) {
    console.error('updatePlant error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.identifyPlant = async (req, res) => {
  try {
    // This endpoint should still be protected by authMiddleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }
    // In a real application, this would involve calling an external plant identification API
    // For now, let's simulate a response
    const { imageUrl } = req.body;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image URL is required for identification.' });
    }

    // Simulate identification result
    const identifiedResult = {
      scientificName: 'Monstera deliciosa',
      commonName: 'Swiss Cheese Plant',
      confidenceScore: 0.95,
      careTips: {
        light: 'Bright indirect light',
        water: 'Water when top inch of soil is dry',
        soil: 'Well-draining potting mix',
        temperature: '65-80°F (18-27°C)',
      },
      toxicity: {
        isToxicToCats: true,
        isToxicToDogs: true,
        isToxicToHumans: false,
        symptoms: 'Oral irritation, pain and swelling of mouth, tongue and lips, vomiting, difficulty swallowing.',
      },
    };
    res.status(200).json(identifiedResult);
  } catch (error) {
    console.error('identifyPlant error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getCareTipsBySpecies = async (req, res) => {
  try {
    // This endpoint should still be protected by authMiddleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }
    const { species } = req.params;
    // In a real application, fetch care tips from a database or external API
    const careTips = {
      light: 'Indirect sunlight',
      water: 'Water regularly',
      soil: 'Well-drained soil',
      temperature: 'Moderate',
      growthTips: `Optimal conditions for ${species} include consistent humidity and avoiding direct harsh sunlight.`,
      maintenanceFrequency: 'Weekly',
      indoorSuitability: true,
      outdoorSuitability: false,
    };
    res.status(200).json(careTips);
  } catch (error) {
    console.error('getCareTipsBySpecies error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.getToxicityInfo = async (req, res) => {
  try {
    // This endpoint should still be protected by authMiddleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }
    const { id } = req.params; // Assuming 'id' refers to plant ID to retrieve its toxicity info
    const plant = await Plant.findById(id);

    if (!plant || plant.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Plant not found or you do not have access.' });
    }

    if (plant.toxicity) {
      res.status(200).json(plant.toxicity);
    } else {
      res.status(404).json({ message: 'Toxicity information not available for this plant.' });
    }
  } catch (error) {
    console.error('getToxicityInfo error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.addJournalEntry = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const { plantId } = req.params;
    const { notes, photoUrl } = req.body;

    if (!notes) {
      return res.status(400).json({ message: 'Journal entry notes cannot be empty.' });
    }

    const plant = await Plant.findOne({ _id: plantId, userId: req.user._id });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access to add a journal entry to this plant.' });
    }

    const newEntry = {
      entryId: new Date().getTime().toString(), // Simple unique ID
      timestamp: new Date(),
      notes,
      photoUrl,
    };

    plant.journalEntries.push(newEntry);
    await plant.save();

    res.status(201).json(plant); // Return the updated plant with new journal entry
  } catch (error) {
    console.error('addJournalEntry error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

exports.deleteJournalEntry = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const { plantId, entryId } = req.params;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user._id });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access.' });
    }

    const initialLength = plant.journalEntries.length;
    plant.journalEntries = plant.journalEntries.filter(entry => entry.entryId !== entryId);

    if (plant.journalEntries.length === initialLength) {
      return res.status(404).json({ message: 'Journal entry not found.' });
    }

    await plant.save();
    res.status(200).json(plant); // Return the updated plant
  } catch (error) {
    console.error('deleteJournalEntry error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


exports.updateJournalEntry = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const { plantId, entryId } = req.params;
    const { notes, photoUrl } = req.body;

    const plant = await Plant.findOne({ _id: plantId, userId: req.user._id });

    if (!plant) {
      return res.status(404).json({ message: 'Plant not found or you do not have access.' });
    }

    const entryToUpdate = plant.journalEntries.find(entry => entry.entryId === entryId);

    if (!entryToUpdate) {
      return res.status(404).json({ message: 'Journal entry not found.' });
    }

    if (notes !== undefined) {
      entryToUpdate.notes = notes;
    }
    if (photoUrl !== undefined) {
      entryToUpdate.photoUrl = photoUrl;
    }

    await plant.save(); // Save the parent plant document to persist changes in the subdocument
    res.status(200).json(plant); // Return the updated plant
  } catch (error) {
    console.error('updateJournalEntry error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};


exports.exportPDF = async (req, res) => {
  try {
    // Explicitly check for authenticated user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Unauthorized: User not authenticated.' });
    }

    const plants = await Plant.find({ userId: req.user._id });

    const doc = new PDFDocument();
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      let pdfData = Buffer.concat(buffers);
      res.writeHead(200, {
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
            .moveDown();
        });
      } else {
        doc.fontSize(12).text('No journal entries for this plant.', { italic: true }).moveDown();
      }
    });

    doc.end();
  } catch (error) {
    console.error('exportPDF error:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};