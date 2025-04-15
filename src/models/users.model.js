import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// .................... Writing the Schemas .......................

// Writing separate schema to handle the full name structure of the user
const fullNameSchema = new Schema(
    {
        firstName: {
            type: String,
            required: [true, "firstName is required!"],
            trim: true,
        },
        middleName: {
            type: String,
            required: false, // No need compulsory for middleName as someone might not have any middle name
            trim: true,
            default: "", // If no middleName is given then it will be empty string
        },
        lastName: {
            type: String,
            required: [true, "lastName is required!"],
            trim: true,
        },
    },
    {
        _id: false, // Prevents separate _id for embedded subdocument
    }
);

const emailSchema = new Schema(
    {
        emailAddress: {
            type: String,
            required: [true, "Email is required!"],
            trim: true,
            lowercase: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false }
);

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "username is required!"],
            unique: true,
            trim: true,
            lowercase: true,
            index: true,
        },
        name: fullNameSchema,
        email: emailSchema,
        password: {
            type: String,
            required: [true, "password is required"],
        },
        userType: {
            type: String,
            enum: ["administration", "student"],
            default: "student",
        },
        avatar: {
            type: String,
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

// .................. Setting up the virtual functions ..............................

// virtually concatanating name into fullName to easily access full name of the user
// Also seting that virtuals will be added to toJSON and toObjects
userSchema.virtual("fullName").get(function () {
    const { firstName, middleName, lastName } = this.name;
    return [firstName, middleName, lastName].filter(Boolean).join(" ");
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

// ...................... Setting up the methods (Middlewares)...........................

// Hashing the pasword using bcrypt before saving the password. (Middleware)
userSchema.pre("save", async function (next) {
    // there is no need to hash password as it is not beging touched.
    if (!this.isModified("password")) return next();

    // Hashing the password.. Till the 10th deep, (I need to learn it more)
    this.password = await bcrypt.hash(this.password, 10);
});

// checking the hashing password, whether it is correct or not.
userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Access token generating using jwt
userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
    );
};

//  Refresh token generating using jwt
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }
    );
};

export const User = mongoose.model("User", userSchema);
