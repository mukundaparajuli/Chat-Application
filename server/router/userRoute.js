const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");
const { verifyJWT } = require("../middleware/validateJWT");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;