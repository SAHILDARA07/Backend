import express from "express";
import { connectdb } from "./db.js";
import bookRoutes from "./routes/bookRoutes.js";

const app = express();

app.use(express.json());



app.use("/books", bookRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});

connectdb();