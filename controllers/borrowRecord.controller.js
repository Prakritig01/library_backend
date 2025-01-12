const BorrowedRecord = require("./../models/borrowRecord.model");
const Book = require("./../models/book.model");
const User = require("./../models/user.model");

// Borrow a book
async function borrowBook(req, res) {
    try {
      const { userId, bookId, borrowDate } = req.body;
  
      
      const book = await Book.findById(bookId);
      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }
  
      
      if (!book.isAvailable) {
        return res
          .status(400)
          .json({ message: "Book is not available for borrowing" });
      }
  
      
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      user.borrowedBooks.push({
        book: bookId,
        borrowDate: borrowDate,
      });
      await user.save();
  
      const borrowedRecord = await BorrowedRecord.create({
        user: userId,
        book: bookId,
        borrowDate,
      });
  
     
      book.isAvailable = false;
      await book.save();
  
      res.status(201).json({
        message: "Book borrowed successfully",
        borrowedRecord,
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Unable to borrow the book", error: err.message });
    }
  }
  

async function returnBook(req, res) {
    try {
      const { userId, bookId } = req.body;
  
      
      const borrowedRecord = await BorrowedRecord.findOne({
        user: userId,
        book: bookId,
      });
  
      if (!borrowedRecord) {
        return res.status(404).json({ message: "Borrowed record not found" });
      }
  
     
      const book = await Book.findById(bookId);
      if (book) {
        book.isAvailable = true;
        await book.save();
      }
  
      
      const user = await User.findById(userId);
      if (user) {
        user.borrowedBooks = user.borrowedBooks.filter(
          (item) => item.book.toString() !== bookId.toString()
        );
        await user.save();
      }
  
      
      await borrowedRecord.deleteOne();
  
      res.json({ message: "Book returned successfully", borrowedRecord });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "Unable to return the book", error: err.message });
    }
  }
  


async function getUserBorrowedBooks(req, res) {
  try {
    const { userId } = req.params;

    // Find all borrowed records for the user
    const borrowedRecords = await BorrowedRecord.find({
      user: userId,
    })
      .populate("book")
      .populate("user");

    if (!borrowedRecords.length) {
      return res
        .status(404)
        .json({ message: "No borrowed books found for this user" });
    }

    res.json({ borrowedRecords });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Unable to fetch borrowed books", error: err.message });
  }
}

module.exports = {
  borrowBook,
  returnBook,
  getUserBorrowedBooks,
};
