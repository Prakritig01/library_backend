const mongoose = require("mongoose");

const bookSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true, 
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,  // Use ObjectId for referencing the Author model
      ref: "Author",  // Reference to the Author model
      required: true, 
    },
  ],
  publishedYear: {
    type: Number,
    required: true, 
    min: [1000, "Year must be a valid four-digit number"], 
  },
  genres: [
    {
      type: String,
      required: true, 
    },
  ],
  price: {
    type: Number,
    required: true, 
    min: [0, "Price must be a positive value"], 
  },
  isAvailable: {
    type: Boolean,
    default: true, // By default, set it to true, meaning the book is available
  },
});

module.exports = mongoose.model("Book", bookSchema);
