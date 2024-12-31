const mongoose = require('mongoose');
const BookSchema = mongoose.Schema({
    title :  {
        type : String,
        required : true
    },
    author : {
        type : String,
        required : true
    },
    publishedDate: {
        type: Date,
        set: (value) => new Date(value), 
    },
    genre : {
        type: String
    },
    price: {
        type: Number,
        min: [0, 'Price must be a positive value.'], 
    },
});

module.exports = mongoose.model("Book" , BookSchema);