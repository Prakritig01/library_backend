const Author = require("./../models/author.model");
const Book = require("./../models/book.model");
const Library = require("./../models/book.model");

async function getAllBooks(req, res) {
  try {
    const books = await Library.find().populate("authors", "name email nationality");
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch books" });
  }
}

async function getSingleBookById(req, res) {
  try {
    const book = await Library.findById(req.params.id).populate("authors");
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch the book" });
  }
}

async function createBook(req, res) {
  try {
    const { title, price, authors, genres, publishedYear } = req.body;
    console.log(title, price, authors, genres, publishedYear );
    console.log(req.body);

    if (!authors || authors.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide at least one author name." });
    }

    // Find authors by their name
    const authorsFound = await Author.find({ name: { $in: authors } });
    if (authorsFound.length !== authors.length) {
      return res
        .status(400)
        .json({
          message:
            "One or more authors not found. Please provide valid author names.",
        });
    }

    // Extract the author IDs
    const authorIds = authorsFound.map(author => author._id);

    // Create the book with the found author IDs
    const book = await Book.create({
      title,
      price,
      authors: authorIds,
      genres,
      publishedYear,
    });

    // Update each author's books array
    for (let i = 0; i < authorsFound.length; i++) {
      authorsFound[i].books.push(book._id);
      await authorsFound[i].save();
    }

    res.status(201).json({
      book,
      message: "Book added successfully",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to add the book", error: err.message });
  }
}


const updateByTitle = async (req, res) => {
  try {
    console.log("Title:", req.params.title);
    console.log("Request Body:", req.body);
    const result = await Library.findOneAndUpdate(
      { title: req.params.title },
      req.body,
      {
        new: true,
      }
    );

    res.json({ message: "Book updated successfully", updated: result });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to update the book", error: err.message });
  }
};

const deleteBookByTitle = async (req, res) => {
  try {
    const book = await Library.findOne({ title: req.params.title });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    for (let i = 0; i < book.authors.length; i++) {
      const author = await Author.findById(book.authors[i]);
      if (author) {
        const index = author.books.indexOf(book._id);

        if (index !== -1) {
          author.books.splice(index, 1);
          await author.save();
        }
      }
    }

    await book.delete();

    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to delete the book", error: err.message });
  }
};

const getBookByGenre = async (req, res) => {
  try {
    const result = await Library.find({ genre: req.params.genre });
    res.json(result);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to get the book", error: err.message });
  }
};

module.exports = {
  getAllBooks,
  getSingleBookById,
  createBook,
  deleteBookByTitle,
  updateByTitle,
  getBookByGenre,
};
