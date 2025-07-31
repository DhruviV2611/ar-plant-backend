const express = require('express');
const router = express.Router();
const {
  getPlants,
  addPlant,
  getPlantById,
  deletePlant,
  updatePlant,
  identifyPlant,
  getCareTipsBySpecies,
  getToxicityInfo,
  addJournalEntry,
  deleteJournalEntry
} = require('../controllers/plantController');
const authMiddleware = require('../middleware/authMiddleware'); // Import auth middleware

// Public route to get all plants (e.g., for Browse, though typically this would be filtered by user)
router.get('/getPlants', authMiddleware, getPlants);

router.post('/addPlant', authMiddleware, addPlant); // Protect addPlant
router.get('/:id', authMiddleware, getPlantById); // Protect getPlantById if it's for user's own plants
router.delete('/:id', authMiddleware, deletePlant); // Protect deletePlant
router.put('/:id', authMiddleware, updatePlant); // Protect updatePlant
router.post('/identify', authMiddleware, identifyPlant);
router.get('/care/:species', authMiddleware, getCareTipsBySpecies);
router.get('/toxicity/:id', authMiddleware, getToxicityInfo);
router.post('/:plantId/journal', authMiddleware, addJournalEntry);
router.delete('/:plantId/journal/:entryId', authMiddleware, deleteJournalEntry);

module.exports = router;