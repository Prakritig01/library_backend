const express = require("express");
const { getAllUsers, addUser, borrowBook, returnBook } = require("./../controllers/user.controller");

const router = express.Router();

// Route to list all users and their borrowed books
router.get("/", getAllUsers);

// Route to add a new user
router.post("/", addUser);

// Route for borrowing a book (by userId)
router.put("/:id/borrow", borrowBook);

// Route for returning a borrowed book (by userId)
router.put("/:id/return", returnBook);

module.exports = router;
