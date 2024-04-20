const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

// @Desc Register a user
// @Route /api/user/register
// @Access public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return res.status(400).json({ message: "All fields are mandatory to be filled." });
    }

    try {
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, username, password: hashedPassword });
        res.status(201).json({ user });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Registration failed, please try again later." });
    }
});

// @Desc login user
// @Route /api/user/login
// @access public
const loginUser = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are mandatory" });
    }

    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password))) {
            const accessToken = jwt.sign({
                user: {
                    userId: user._id,
                    email: user.email,
                    username: user.username,
                },
            }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1d' });
            const loggedInUser = User.findById(user._id).select("-password");
            res.json({ user, accessToken });
        } else {
            res.status(400).json({ message: "Invalid username or password" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Login failed, please try again later." });
    }
});

const logoutUser = expressAsyncHandler(async (req, res) => {
    const options = {
        httpOnly: true,
        secure: false,
    };
    res.clearCookie("token", options).status(200).json({ message: "Logged out successfully" });
});

module.exports = { registerUser, loginUser, logoutUser };
