const mongoose = require("mongoose");

const borrowRecordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
  borrowDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
//   returnDate: {
//     type: Date,
//     default: null, // Null means the book hasn't been returned yet
//   },
});

const BorrowRecord = mongoose.model("BorrowRecord", borrowRecordSchema);

module.exports = BorrowRecord;
