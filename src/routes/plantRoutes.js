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
const {protect,verifyToken} = require('../middleWare/authMiddleware');

router.get('/getPlants', protect, getPlants);
router.post('/addPlant', protect, addPlant);
router.get('/:id', protect, getPlantById);
router.delete('/:id', protect, deletePlant);
router.put('/:id', protect, updatePlant); 
router.post('/identify', protect, identifyPlant);
router.get('/care/:species', protect, getCareTipsBySpecies);
router.get('/toxicity/:id', protect, getToxicityInfo);
router.post('/:plantId/journal', protect, addJournalEntry);
router.delete('/:plantId/journal/:entryId', protect, deleteJournalEntry);

module.exports = router;