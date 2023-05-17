const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var petCategorySchema = new mongoose.Schema(
  {
    species: {
      type: String,
      required: true,
    },
    breed: {
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

//Export the model
module.exports = mongoose.model('PetCategory', petCategorySchema);
