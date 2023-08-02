const mongoose = require('mongoose'); // Erase if already required

// Declare the Schemas of the Mongo models

const petBreedSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

var petCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    breeds: [petBreedSchema]
  },
  {
    timestamps: true,
  },
);

//Export the model
module.exports = mongoose.model('petcategories', petCategorySchema);
