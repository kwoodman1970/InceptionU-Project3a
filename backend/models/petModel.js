const mongoose = require('mongoose');

var petSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Supplier',
      required: true,
    },
    adoptionRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
      },
    ],
    name: {
      type: String,
      required: true,
    },
    species: {
      type: String,
      required: true,
    },
    breed: {
      type: String,
    },
    age: {
      type: String,
    },
    color: {
      type: String,
    },
    eyeColor: {
      type: String,
    },
    size: {
      type: String,
    },
    weight: {
      type: String,
    },
    price: {
      type: Number,
    },
    description: {
      type: String,
    },
    images: [
      {
        type: String,
      },
    ],

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
