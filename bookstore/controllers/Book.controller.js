
import Book from "../models/bookModel.js";


export const addBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);

    res.status(201).json({
      message: "Book added successfully",
      book: book
    });
  } catch (error) {
    res.status(500).json({
      message: "Book add failed",
      error: error.message
    });
  }
};

export const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book updated successfully",
      book: book
    });
  } catch (error) {
    res.status(500).json({
      message: "Book update failed",
      error: error.message
    });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "Book delete failed",
      error: error.message
    });
  }
};

