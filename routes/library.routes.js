const express = require("express");
const router = express.Router();
const Library = require("./../models/book.model");
const { getAllBooks,getSingleBookById,createBook ,updateByTitle,deleteBookByTitle, getBookByGenre} = require( "../controllers/book.controller");

router.get("/", getAllBooks);

router.get("/:id", getSingleBookById);

router.post("/",createBook );

router.put("/:title", updateByTitle);

router.delete("/:id", deleteBookByTitle);

router.get("/genre/:genre" ,getBookByGenre);

module.exports = router;
