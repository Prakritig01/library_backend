const express = require("express");
const router = express.Router();
const {getAllAuthors,getAuthorById,createAuthor,addBookToAuthor} = require('./../controllers/author.controller');

router.get('/', getAllAuthors);

router.get('/:id',getAuthorById);

router.post('/', createAuthor);

router.post('/:id', addBookToAuthor);

module.exports = router;