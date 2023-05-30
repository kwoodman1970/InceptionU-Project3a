const mongoose = require('mongoose');

var petSchema = new mongoose.Schema(
  {
    // owner: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Supplier',
    //   required: true,
    // },
    // adoptionRequest: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Request',
    //   },
    // ],
    name: {
      type: String,
      required: true,
    },
    postalCodeLocation: {
      type: String,
    },
    species: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
    },
    dateOfBirth: {
      type: Date,
    },
    adoptionDate: {
      type: Date,
    },
    dateOfDeath: {
      type: Date,
    },
    activateDeactivate: {
      type: Boolean,
    },
    searchability: {
      type: Boolean,
    },
    pictures: {
      type: [Buffer],
    },
    aboutAnimal: {
      type: String,
    },
    sex: {
      type: String,
    },
    reproductiveStatus: {
      type: String,
    },
    alteredDate: {
      type: Date,
    },
    tattooNumber: {
      type: String,
    },
    microchipNumber: {
      type: String,
    },
    petSize: {
      type: String,
    },
    energyLevel: {
      type: String,
    },
    hairLength: {
      type: String,
    },
    hairColor: {
      type: String,
    },
    eyeColor: {
      type: String,
    },
    allergyFriendly: {
      type: String,
    },
    socializedWith: {
      type: String,
    },
    specialNeeds: {
      type: String,
    },

    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      default: 'Available',
      enum: ['Available', 'Pending', 'Not Available'],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Pet', petSchema);
