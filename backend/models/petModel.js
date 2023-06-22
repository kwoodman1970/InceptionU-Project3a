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
      enum: ['No Preference', 'Unknown', 'Male', 'Female',],
      required: true,
    },
    reproductiveStatus: {
      type: String,
      enum: ['', 'No Preference', 'Unknown', 'Fixed/Altered', 'Breeding',],
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
      enum: [
        'No Preference',
        'Not Applicable',
        'Miniture',
        'X-Small',
        'Small',
        'Small-Medium',
        'Medium',
        'Medium-Large',
        'Large',
        'X-Large',
        'Giant',
      ],
    },
    energyLevel: {
      type: String,
      enum: [
      '',
      'No Preference',
      'Unknown',
      'Docile',
      'Low',
      'Medium',
      'High',
      'Aggressive',
      ],
    },
    hairLength: {
      type: String,
      enum: [
        '',
        'No Preference',
        'Not Applicable',
        'Hairless',
        'Short',
        'Short-Medium',
        'Medium',
        'Medium-Long',
        'Long',
        ],
    },
    hairColor: {
      type: String,
      enum: [
        '',
        'No Preference',
        'Not Applicable',
        'Agouti',
        'Albino',
        'Apricot Point',
        'Black',
        'Black Otter',
        'Blue',
        'Blue Cream',
        'Blue Point',
        'Broken',
        'Brown',
        'Calico',
        'Caramel Point',
        'Castor',
        'Chinchilla Grey',
        'Chocolate',
        'Chocolate Point',
        'Cinnamon',
        'Cinnamon Point',
        'Cream',
        'Cream Point',
        'Fawn',
        'Fawn Point',
        'Frosted Pearl',
        'Gold',
        'Golden',
        'Grey',
        'Lavender',
        'Lavender Cream',
        'Lilac',
        'Lilac Point',
        'Liver',
        'Lynx Point',
        'Morph',
        'Opal',
        'Orange',
        'Pearl',
        'Piebalds',
        'Red',
        'Red Point',
        'Rust',
        'Sable',
        'Sable',
        'Sandy',
        'Seal Point',
        'Self',
        'Shaded',
        'Silver',
        'Standard',
        'Steel',
        'Tabby',
        'Tabby Point',
        'Tan Pattern',
        'Ticked',
        'Tortie Point',
        'Tortoise',
        'Tortoiseshell',
        'Tri-colored',
        'Tuxedo',
        'White',
        'Wideband',
        'Yellow',
      ],
    },
    eyeColor: {
      type: String,
      enum: [
        '',
        'No Preference',
        'Not Applicable',
        'Brown',
        'Amber',
        'Orange/Copper',
        'Hazel',
        'Yellow',
        'Green',
        'Blue',
        'Heterochromia',
        'Dichroic',
        'Blue-Green',
        'Red',
      ],
    },
    allergyFriendly: {
      type: String,
      enum: ['', 'No Preference', 'Yes', 'No'],
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
