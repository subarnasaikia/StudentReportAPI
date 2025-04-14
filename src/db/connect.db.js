import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGODB_URI}/${DB_NAME}`
        );
        console.log(
            `MongoDB connected host: ${connectionInstance.connection.host}`
        );
        console.log(
            `MongoDB connected name: ${connectionInstance.connection.name}`
        );
    } catch (error) {
        console.error("MongoDB connection failed", error);
        process.exit(1);
    }
};

export { connectDB };
