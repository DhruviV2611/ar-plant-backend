const express = require('express');
const router = express.Router();
const {
  getPlants,
  addPlant,
  getPlantById,
  deletePlant,
  updatePlant
} = require('../controllers/plantController');

router.get('/getPlants', getPlants);
router.post('/addPlant', addPlant);

// New routes
router.get('/:id', getPlantById);
router.delete('/:id', deletePlant);
router.put('/:id', updatePlant);

module.exports = router;
