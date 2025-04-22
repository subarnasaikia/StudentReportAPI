import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.model.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Couldn't generate Access And Refresh Tokens as something went wrong!!!"
        );
    }
};

const registerUser = asyncHandler(async (req, res) => {
    // How to register a user?
    // Step 1: get the data from the frontend
    // Step 2: Check whether user send the correct details or not. -> Validation
    // Step 3: Check user and email exits in the database or not.
    // Step 4: If user is not  exits, create the access and refresh token
    // Step 5: Insert the details to db -> create object
    // Step 6: Send the accecc and refresh token to the user also the other details. -> return res

    // fetching the data from body.
    const {
        username,
        firstName,
        middleName,
        lastName,
        email,
        userType,
        password,
        confirmPassword,
    } = req.body;

    // Validating the data
    if (
        [
            username,
            firstName,
            lastName,
            email,
            userType,
            password,
            confirmPassword,
        ].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Please provide all the required fields!!!");
    }

    // checking whether the password and confirm password are same or not.
    if (password !== confirmPassword) {
        throw new ApiError(
            400,
            "Password and Confirm Password are not same!!!"
        );
    }

    // checking whether the user and email already exists or not.
    const existedUser = await User.findOne({
        $or: [{ username }, { "email.emailAddress": email.toLowerCase() }],
    });

    if (existedUser) {
        throw new ApiError(
            400,
            "User already exists with this username or email!!!"
        );
    }

    const user = await User.create({
        username: username.toLowerCase(),
        name: {
            firstName,
            middleName,
            lastName,
        },
        email: {
            emailAddress: email.toLowerCase(),
        },
        userType,
        password,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500, "Couldn't create user!!!");
    }

    return res
        .status(201)
        .json(
            new ApiResponse(200, createdUser, "User created successfully!!!")
        );
});

const loginUser = asyncHandler(async (req, res) => {
    // Step 1: fetching the data
    // Step 2: validating the data
    // Step 3; Check the user and email exists or not.
    // Step 4: check the password is correct or not. (if user exists)
    // Step 5: if password is correct, generate the access and refresh token.
    // Step 6: send the access and refresh token to the user.
    // Step 7: send the user details to the user.

    // fetching the data from body.
    const { username, email, password } = req.body;
});

const logoutUser = asyncHandler(async (req, res) => {});

export { registerUser, loginUser, logoutUser };
