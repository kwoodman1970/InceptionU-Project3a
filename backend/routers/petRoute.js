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
  updatePetContacts,
  deletePet,
  getPetsByOwnerId,
  updatePetStatus,
  toWishList,
  countPets,
 getSavedPetContacts,
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

router.put('/:id', protectSupplier, updatePetStatus);

 router.put('/:petId/contacts', protectSupplier, updatePetContacts);

// router.post('/addcontacts', addPetContact);

router.delete('/:id', protectSupplier, supplier, deletePet);

router.put('/addcontacts/:petId', updatePet);

// Get saved pet contacts
// router.get('/contacts', getSavedPetContacts);
router.get('/:petId/contacts', getSavedPetContacts);



module.exports = router;
