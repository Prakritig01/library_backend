const Library = require("./../models/book.model");

async function getAllBooks(req, res) {
  try {
    const books = await Library.find();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch books" });
  }
}

async function getSingleBookById(req, res) {
  try {
    const book = await Library.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch the book" });
  }
}

const createBook = async (req, res) => {
  try {
    const result = await Library.create(req.body);
    res.status(201).json({
      message: "Book added successfully",
      book: result,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to add the book", error: err.message });
  }
};

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
    const result = await Library.findOneAndDelete({ title: req.params.title });

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
  getBookByGenre
};
