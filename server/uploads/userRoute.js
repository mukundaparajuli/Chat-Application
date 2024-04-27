const express = require("express");
const { registerUser, loginUser, getAllUser, logoutUser } = require("../controller/userController");
const validateJWT = require("../middleware/validateJWT");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/people", validateJWT, getAllUser);
router.post("/logout", validateJWT, logoutUser);

module.exports = router;