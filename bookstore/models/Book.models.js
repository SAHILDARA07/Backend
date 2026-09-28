import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  name: { type: String,required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  }
});

export default bookSchema;