const express = require("express");
const router = express.Router();
const db = require("../connectDB");
const collection = db.collection("library");
const mongodb = require("mongodb");

router.get("/", async (req, res) => {
  try {
    const books = await collection.find().toArray(); 
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch books" });
  }
});

router.get("/:id", getObjectId, async (req, res) => {
  try {
    const o_id = req.o_id;

    const book = await collection.findOne({ _id: o_id });

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch the book" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { title, author, year, genres, copiesSold } = req.body;

    if (!title || !author || !year || !genres || !copiesSold) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newBook = {
      title,
      author,
      year: parseInt(year),
      genres,
      copiesSold: parseInt(copiesSold),
    };

    const result = await collection.insertOne(newBook);
    res.status(201).json({
      message: "Book added successfully",
      book: newBook,
      insertedId: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to add the book" });
  }
});

router.patch("/:id", getObjectId, async (req, res) => {
  try {
    const o_id = req.o_id;

    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const result = await collection.updateOne(
      { _id: o_id },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(404)
        .json({ message: "Book not found or no changes made" });
    }

    res.json({ message: "Book updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to update the book" });
  }
});

router.delete("/:id", getObjectId, async (req, res) => {
    try {
      const o_id = req.o_id; // Access the ObjectId from req.o_id set by getObjectId middleware
  
      const result = await collection.deleteOne({ _id: o_id });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      res.json({ message: "Book deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Unable to delete the book" });
    }
  });
  

function getObjectId(req, res, next) {
  const o_id = new mongodb.ObjectId(req.params.id);
  req.o_id = o_id;
  next();
}

module.exports = router;
