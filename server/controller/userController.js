const expressAsyncHandler = require("express-async-handler");
const User = require("../Models/userSchema");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config();

// @Desc Register a user
// @Route /api/user/register
// @Access public
const registerUser = expressAsyncHandler(async (req, res) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        res.status(400).json({ message: "All fields are mandatory to be filled." });
    }
    const userExists = await User.findOne({ email } || { username });
    if (userExists) {
        res.status(400).json({ message: "User already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, password: hashedPassword });
    res.status(201).json({ user });
});

// @Desc login user
// @Route /api/user/login
// @access public

const loginUser = expressAsyncHandler(async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "username and password is mandatory" })
    }
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
        const accessToken = jwt.sign({
            user: {
                email: user.email,
                username: user.username,
            }
        }, process.env.SECRET_ACCESS_KEY, { expiresIn: '1d' })
        res.json({ accessToken });
    } else {
        res.status(400).json({ message: "User could not be logged in!" })
    }
})



module.exports = { registerUser, loginUser };