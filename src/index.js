import dotenv from "dotenv";
import { connectDB } from "./db/connect.db.js";
import { app } from "./app.js";

const PORT = process.env.PORT || 3000;

dotenv.config({
    path: "../.env",
});

connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.error("Server error", error);
            throw error;
        });
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to the database", error);
        process.exit(1);
    });
