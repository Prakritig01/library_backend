const Author = require("./../models/author.model");
const Book = require("./../models/book.model");

async function getAllAuthors(req, res) {
  try {
    const authors = await Author.find().populate("books");
    res.json(authors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Unable to get authors!" });
  }
}

async function getAuthorById(req, res) {
  try {
    const author = await Author.findById(req.params.id).populate("books");
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }
    res.json(author);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch the book" });
  }
}

async function createAuthor(req, res) {
  try {
    const { name, email, dateOfBirth, nationality } = req.body;
    const newAuthor = new Author({
      name,
      email,
      dateOfBirth,
      nationality,
    });

    const result = await newAuthor.save();
    res.status(201).json({
      message: "Author added successfully",
      author: result,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to add the author", error: err.message });
  }
}
async function addBookToAuthor(req, res) {
  try {
    const { bookId } = req.body;
    const authorId = req.params.id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const author = await Author.findById(authorId);
    if (!author) {
      return res.status(404).json({ message: "Author not found" });
    }

    // Add the book to the author's list
    author.books.push(bookId);
    await author.save();

    res.status(200).json({
      message: "Book added to author successfully",
      author,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to add book to author", error: err.message });
  }
}

module.exports = {
  getAllAuthors,
  getAuthorById,
  createAuthor,
  addBookToAuthor,
};
