import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";

// signup controller
export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }


        const user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName,
            email,
            password: hashedPassword,
        });

        if (newUser) {
            generateToken(newUser._id, res);

            const userToReturn = {
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            };

            res.status(201).json({
                message: "User created successfully",
                user: userToReturn,
            });
        }

    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// login controller
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found / invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password / invalid credentials" });
        }

        generateToken(user._id, res);

        const userToReturn = {
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        };

        res.status(200).json({ message: "User logged in successfully", user: userToReturn });
    } catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// logout controller
export const logout = (req, res) => {

    try {
        res.clearCookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
        console.log(error);
    }
};

// update profile controller
export const updateProfile = async (req, res) => {

    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true }).select("-password");

        res.status(200).json({ updatedUser });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// check auth controller
export const checkAuth = async (req, res) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(200).json({ user: null });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select("-password");

            if (!user) {
                return res.status(200).json({ user: null });
            }

            res.status(200).json(user);
        } catch (error) {
            // Token verification failed (expired/invalid)
            return res.status(200).json({ user: null });
        }
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
