import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// initialize express app
const app = express();

// set up middleware
// enable CORS
// allow requests from the specified origin
// and allow credentials to be sent
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    })
);

// parse incoming requests with JSON payloads
// and limit the payload size to 16kb
app.use(
    express.json({
        limit: "16kb",
    })
);

// parse incoming requests with URL-encoded payloads
// and limit the payload size to 16kb
// and extended to true to allow for rich objects and arrays
app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

// serve static files from the public directory
app.use(express.static("public"));

// parse cookies from incoming requests
app.use(cookieParser());

export { app };
