import express from "express";
import { connectdb } from "./config/db.js";

const app = express();

app.use(express.json());
app.use(express.json());
connectdb();

app.get("/books", (req, res) => {
  res.send("Books API Working");
});
app.post("/books", (req, res) => {
  console.log("BODY:", req.body);

  res.json({
    message: "Book added successfully",
    data: req.body
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});