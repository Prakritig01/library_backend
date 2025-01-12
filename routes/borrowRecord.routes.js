const express = require("express");
const {
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
} = require("./../controllers/borrowRecord.controller");

const router = express.Router();

router.put("/:userId/borrow", borrowBook);

router.put("/:userId/return", returnBook);

router.get("/:userId/borrowed-books", getUserBorrowedBooks);

module.exports = router;
