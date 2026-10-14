// make a user an admin
// do this : node makeAdmin.js youremail@gmail.com
import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/user_model.js";

dotenv.config();

const makeAdmin = async () => {
  const email = process.argv[2];

  if (!email) {
    console.log(
      "Please give an email. Example: node makeAdmin.js you@gmail.com",
    );
    return;
  }

  try {
    await connectDB();

    const user = await User.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { role: "admin" },
      { new: true },
    );

    if (!user) {
      console.log("User not found ! Signup first, then run this again.");
    } else {
      console.log(`${user.email} is now an admin !`);
    }
  } catch (error) {
    console.log("Something went wrong !", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

makeAdmin();