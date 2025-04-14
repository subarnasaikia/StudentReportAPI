import dotenv from "dotenv";
import { connectDB } from "./db/connect.db.js";

dotenv.config({
    path: "./env",
});

connectDB();
