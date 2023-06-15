const mongoose = require('mongoose');

var petSchema = new mongoose.Schema(
  {
    cardType: {
      type:  String,
      required: true,
      default: 'Supplier',
      enum: ['Supplier', 'Adopter'],
    },
    name: {
      type: String,
      required: true,
    },
    postalCodeLocation: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    adoptionDate: {
      type: Date,
    },
    dateOfDeath: {
      type: Date,
    },
    active: {
      type: Boolean,
    },
    searchable: {
      type: Boolean,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: 'cardType',
      required: true,
    },
    pictures: {
      type: [String],
    },
    about: {
      type: String,
    },
    sex: {
      type: String,
      default: 'Unknown',
      enum: ['Unknown', 'Male', 'Female'],
      required: true,
    },
    reproductiveStatus: {
      type: String,
    },
    alteredDate: {
      type: Date,
    },
    tattooID: {
      type: String,
    },
    microchipID: {
      type: String,
    },
    size: {
      type: String,
      required: true,
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    energyLevel: {
      type: String,
      enum: ['', 'Low', 'Medium', 'High'],
    },
    hairLength: {
      type: String,
      enum: ['', 'Short', 'Medium', 'Long'],
    },
    hairColor: {
      type: String,
    },
    eyeColor: {
      type: String,
    },
    allergyFriendly: {
      type: Boolean,
    },
    socializedWith: {
      type: [String],
    },
    specialNeeds: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Pet', petSchema);
