// This router is for the pet category route.

const express = require('express');
const {
  createPetCategory,
  updatePetCategory,
  deletePetCategory,
  getPetCategory,
  getAllPetCategory,
} = require('../controller/petCategoryController');
const { protect, admin } = require('../middlewares/authMiddleware');
const router = express.Router();

//create new pet category
router.post('/add-species', protect, admin, createPetCategory); // token and admin to create pet category [protect, admin,]
router.put('/:id', protect, admin, updatePetCategory); // token and admin to create pet category
router.delete('/:id', protect, admin, deletePetCategory); // token and admin to create pet category
router.get('/:id', getPetCategory);
router.get('/', getAllPetCategory);

module.exports = router;
