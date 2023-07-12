const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const Pet = require('../models/petModel');
const User = require('../models/userModel');
const Supplier = require('../models/supplierModel');
const validateMongiDbId = require('../utils/validateMongoDB');
const fs = require('fs');
// const { getSavedPetContacts } = require('./petController');


// @desc    Create new pet
// @router POST/api/pets
// @access Public

const createPet = asyncHandler(async (req, res) => {
  const { _id } = req.supplier;

  const {
    cardType,
    name,
    postalCodeLocation,
    species,
    breed,
    price,
    dateOfBirth,
    adoptionDate,
    dateOfDeath,
    active,
    searchable,
    owner,
    pictures,
    about,
    sex,
    reproductiveStatus,
    alteredDate,
    tattooID,
    microchipID,
    size,
    energyLevel,
    hairLength,
    hairColor,
    eyeColor,
    allergyFriendly,
    socializedWith,
    specialNeeds,
    images,
} = req.body;

  //input validation
  if (!name || !species || !breed) {
    res.status(400);
    throw new Error('Please fill out all required fields');
  }
  const supplier = await Supplier.findById(owner);
  if (!supplier) {
    res.status(400);
    throw new Error('Invalid Supplier User');
  }
  if (supplier.status !== 'Accepted') {
    res.status(401);
    throw new Error(
      'Please wait to admin verify your account before you can post',
    );
  }
  const pet = await Pet.create({
    cardType,
    name,
    postalCodeLocation,
    species,
    breed,
    price,
    dateOfBirth,
    adoptionDate,
    dateOfDeath,
    active,
    searchable,
    owner,
    pictures,
    about,
    sex,
    reproductiveStatus,
    alteredDate,
    tattooID,
    microchipID,
    size,
    energyLevel,
    hairLength,
    hairColor,
    eyeColor,
    allergyFriendly,
    socializedWith,
    specialNeeds,
    images,
  });
  if (pet) {
    res.status(200).json({
      _id: pet._id,
      owner_id: pet.owner_id,
      name: pet.name,
      species: pet.species,
    });
  } else {
    res.status(400);
    throw new Error('Invalid pet data');
  }
});

// @desc    Get pets by name
// @router GET/api/pets
// @access Public

const getPetByName = asyncHandler(async (req, res) => {
  console.log(req.params.name);
  const pets = await Pet.findOne({ name: req.params.name });
  res.json(pets);
});

// @desc    Get pets by pet ID
// @router GET/api/pets/:id
// @access supplier only

const getPetById = asyncHandler(async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate(
    'owner',
    'name businessInfo phone',
  );
  if (pet) {
    res.json(pet);
  } else {
    res.status(404);
    throw new Error('Pet not found');
  }
});

const getPetByOwner = asyncHandler(async (req, res) => {
  const owner = await Supplier.findById(req.params.id);
  const pets = await Pet.find({ owner: owner }).populate({
    path: 'owner',
    select: 'name businessInfo phone',
    populate: {
      path: 'reviews',
      select:
        'satisfaction communication healthOnArrival healthAfter6Months healthAfter1Year problemSolving handoverSatisfaction adopted',
    },
  });
  res.json(pets);
});

const getPetBySpecies = asyncHandler(async (req, res) => {
  const pets = await Pet.find({ species: req.params.species });
  res.json(pets);
});

const getPetBySearch = asyncHandler(async (req, res) => {
  const pets = await Pet.find({
    $or: [
      { name: { $regex: req.params.query, $options: 'i' } },
      { species: { $regex: req.params.query, $options: 'i' } },
      { breed: { $regex: req.params.query, $options: 'i' } },
    ],
  }).populate({
    path: 'owner',
    select: 'name businessInfo phone',
    populate: {
      path: 'reviews',
      select:
        'satisfaction communication healthOnArrival healthAfter6Months healthAfter1Year problemSolving handoverSatisfaction adopted',
    },
  });
  res.json(pets);
});

const getAllPets = asyncHandler(async (req, res) => {
  const pets = await Pet.find({}).populate({
    path: 'owner',
    select: 'name businessInfo phone',
    populate: {
      path: 'reviews',
      select:
        'satisfaction communication healthOnArrival healthAfter6Months healthAfter1Year problemSolving handoverSatisfaction adopted',
    },
  });
  res.json(pets);
});

const getPetsByOwnerId = asyncHandler(async (req, res) => {
  const { _id } = req.supplier; // get owner id when supplier login

  try {
    const getedPets = await Pet.find({ owner: _id });
    res.json(getedPets);
  } catch (error) {
    throw new Error(error);

  }
});

const updatePet = asyncHandler(async (req, res) => {
  /*
  Middleware should have verified owner identity prior to this function being
  called.
  */

  const petId = req.params.id;
  const supplierId = req?.supplier._id.toString();

  if (!petId) {
    res.status(404);
    throw new Error('Pet not updated');
  }

  const pet = await Pet.findOneAndUpdate({_id: petId, owner: supplierId}, req.body);

  if (!pet) {
    res.status(403);
    throw new Error('Pet not found or not owned by you');
  }

  res.json({
    _id: pet._id,
    owner_id: pet.owner_id,
    name: pet.name,
    species: pet.species,
  });
});

const updatePetContacts= asyncHandler(async (req, res) => {
  const { petId } = req.params;
  const {
    //token,
    //name,
    //species,
    // breed,
    // age,
    // color,
    // eye_color,
    // size,
    // price,
    // image_1,
    // location,
    serviceCompanyName,
    serviceLocationName,
    serviceWebsite,
    serviceAddress,
    serviceCity,
    serviceProvince,
    servicePostalCode,
    serviceEmail,
    servicePhoneNumber,
    serviceContactFirstName,
    serviceContactLastName,
    accountNumber,
    activateDeactivate,
  } = req.body;

try {
    const pet = await Pet.findById(petId);
console.log("pet : ",pet)
    if (!pet) {
      res.status(404);
      throw new Error('Pet not found');
    }


   // Construct the new contact object
   const newContact = {
    serviceCompanyName,
    serviceLocationName,
    serviceWebsite,
    serviceAddress,
    serviceCity,
    serviceProvince,
    servicePostalCode,
    serviceEmail,
    servicePhoneNumber,
    serviceContactFirstName,
    serviceContactLastName,
    accountNumber,
    activateDeactivate,
  };

  // Update the contacts array in the pet document
    pet.contacts.push({
    serviceCompanyName:serviceCompanyName,
      serviceLocationName:serviceLocationName,
      serviceWebsite:serviceWebsite,
      serviceAddress:serviceAddress,
      serviceCity:serviceCity,
      serviceProvince:serviceProvince,
      servicePostalCode:servicePostalCode,
      serviceEmail:serviceEmail,
      servicePhoneNumber:servicePhoneNumber,
      serviceContactFirstName:serviceContactFirstName,
      serviceContactLastName:serviceContactLastName,
      accountNumber:accountNumber,
      activateDeactivate:activateDeactivate,
    });


    // Save the updated pet document
    const updatedPet = await pet.updateOne({contacts:pet.contacts});

    res.json(pet.contacts);
  } catch (error) {
    res.status(400);
    throw new Error(error);
  }
});

const deletePet = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongiDbId(id);
  try {
    const pet = await Pet.findById(id);
    if (
      pet &&
      (pet.owner._id.equals(req.supplier._id) || req.user.role === 'admin')
    ) {
      await pet.images.forEach(async (image) => {
        console.log(image);
        fs.unlink(`./backend/public/images/pets/${image}`, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });
      await pet.remove();
      res.json({ message: 'Pet removed' });
    } else {
      res.status(404);
      throw new Error('Pet not found or unauthorized');
    }
  } catch (error) {
    throw new Error(error);
  }
});
//@desc     Update PET STATUS
//@route PUT /api/PETS/:id
//@access Public

const updatePetStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    const updatedPet = await Pet.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedPet);
  } catch (error) {
    res.status(400);

    throw new Error(error);
  }
});

// create wishlist for pet
// desc push pet into wishlist
//@router PUT/api/pets/:id
//@access private/only user login can push pet to wishlist

const toWishList = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { petId } = req.params;

  try {
    // find user have _id
    const user = await User.findById(_id);
    const alreadyInWishList = user.wishlist.find(
      (id) => id.toString() === petId,
    );
    if (alreadyInWishList) {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $pull: { wishlist: petId },
        },
        { new: true },
      ).populate('owner', 'name businessInfo phone');
      res.json(user);
    } else {
      let user = await User.findByIdAndUpdate(
        _id,
        {
          $push: { wishlist: petId },
        },
        { new: true },
      ).populate('owner', 'name businessInfo phone');
      res.json(user);
    }
  } catch (error) {
    throw new Error(error);
  }
});
// create user request pet for pet
// desc push request into request pet
//@router PUT/api/pets/:requestId
//@access private/only user login can send request pet to adopt pet

const requestPetAdoption = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  const { requestId } = req.params;

  try {
    // find user have _id
    const pet = await Pet.findById(requestId);
    const alreadySentRequest = pet.adoptionRequest.find(
      (id) => id.toString() === _id,
    );
    if (alreadySentRequest) {
      let pet = await Pet.findByIdAndUpdate(
        requestId,
        {
          $pull: { adoptionRequest: _id },
        },
        { new: true },
      );
      res.json(pet);
    } else {
      let pet = await Pet.findByIdAndUpdate(
        requestId,
        {
          $push: { adoptionRequest: _id },
        },
        { new: true },
      );
      res.json(pet);
    }
  } catch (error) {
    throw new Error(error);
  }
});

// Count and statistic pets in database

const countPets = asyncHandler(async (req, res) => {
  try {
    const { _id } = req.supplier; // assuming the supplier ID is stored in the `req.user` object
    const petCountByStatus = await Pet.aggregate([
      { $match: { owner: _id } }, // filter by the supplier ID
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    const totalPets = await Pet.countDocuments({ owner: _id }); // count only the pets belonging to the supplier
    res.json({ petCountByStatus, totalPets });
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }



});

// Fetch saved pet contacts
 const getSavedPetContacts = asyncHandler(async (req, res) => {
  const savedData = await Pet.findById(req.params.petId);
  res.json(savedData.contacts);
});





//export
module.exports = {
  createPet,
  getPetBySpecies,
  getPetByName,
  getPetById,
  getPetByOwner,
  getAllPets,
  getPetBySearch,
  getPetsByOwnerId,
  getSavedPetContacts,
  updatePet,
   updatePetContacts,
  deletePet,
  updatePet,
  updatePetStatus,
  toWishList,
  countPets,
};