// This router is for the pet route.

const express = require('express');
const {
  protectSupplier,
  supplier,
} = require('../middlewares/supplierMiddleware');
const { protect } = require('../middlewares/authMiddleware');
const {
  createPet,
  getPetBySpecies,
  getPetByName,
  getPetById,
  getAllPets,
  getPetByOwner,
  getPetBySearch,
  updatePet,
  deletePet,
  getPetsByOwnerId,
  updatePetStatus,
  toWishList,
  countPets,
} = require('../controller/petController');

const router = express.Router();

// add a pet to wishlist
router.put('/:petId', protect, toWishList);

// create new pet
router.post('/create-pet', protectSupplier, supplier, createPet);

router.get('/getpetbyspecies/:species', getPetBySpecies);

router.get('/get-pets', protectSupplier, supplier, getPetsByOwnerId);

router.get('/summary-pets', protectSupplier, supplier, countPets);

router.get('/getpetbyname/:name', getPetByName);

router.get('/:id', getPetById);

router.get('/', getAllPets);

router.get('/owner/:id', getPetByOwner);

router.get('/search/:query', getPetBySearch);

router.patch('/:id', protectSupplier, updatePet);

router.put('/:id', protectSupplier, updatePetStatus);

router.delete('/:id', protectSupplier, supplier, deletePet);

module.exports = router;
