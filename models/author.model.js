const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
  },
  dateOfBirth: {  
    type: Date, 
    required: true,
  },
  nationality: {  
    type: String,
    required: true,
  },
  books: [  
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const Author = mongoose.model("Author", authorSchema);
module.exports = Author;
