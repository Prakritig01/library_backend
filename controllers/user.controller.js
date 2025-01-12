const User = require("./../models/user.model");
const Book = require("./../models/book.model");
const BorrowedRecord = require("./../models/borrowRecord.model"); 


async function getAllUsers(req, res) {
  try {
    const users = await User.find().populate("borrowedBooks.book"); 
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to fetch users", error: err.message });
  }
}


async function addUser(req, res) {
  try {
    const { name, email } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    const user = new User({
      name,
      email,
      borrowedBooks: [],
    });

    await user.save();
    res.status(201).json({ message: "User added successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to add user", error: err.message });
  }
}


async function borrowBook(req, res) {
  try {
    const { userId } = req.params;
    const { bookId, borrowDate } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.isAvailable) {
      return res.status(400).json({ message: "Book is not available for borrowing" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const alreadyBorrowed = user.borrowedBooks.some(
      (item) => item.book.toString() === bookId.toString()
    );
    if (alreadyBorrowed) {
      return res.status(400).json({ message: "User has already borrowed this book" });
    }

    // Add to borrowedBooks in User model
    user.borrowedBooks.push({
      book: bookId,
      borrowDate,
    });

    
    const borrowedRecord = new BorrowedRecord({
      user: userId,
      book: bookId,
      borrowDate,
    });

    await borrowedRecord.save();

    
    book.isAvailable = false;
    await book.save();

    await user.save();

    res.status(201).json({
      message: "Book borrowed successfully",
      borrowedRecord,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to borrow the book", error: err.message });
  }
}


async function returnBook(req, res) {
  try {
    const { userId } = req.params;
    const { bookId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    
    const borrowedBook = user.borrowedBooks.find(
      (item) => item.book.toString() === bookId.toString()
    );
    if (!borrowedBook) {
      return res.status(404).json({ message: "This book was not borrowed by the user" });
    }

    
    user.borrowedBooks = user.borrowedBooks.filter(
      (item) => item.book.toString() !== bookId.toString()
    );

    
    const borrowedRecord = await BorrowedRecord.findOne({ user: userId, book: bookId });
    if (borrowedRecord) {
      await borrowedRecord.deleteOne();
    }

   
    const book = await Book.findById(bookId);
    if (book) {
      book.isAvailable = true;
      await book.save();
    }

    await user.save();

    res.json({ message: "Book returned successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Unable to return the book", error: err.message });
  }
}

module.exports = {
  getAllUsers,
  addUser,
  borrowBook,
  returnBook,
};
