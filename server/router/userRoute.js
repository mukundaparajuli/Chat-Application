const express = require("express");
const { registerUser, loginUser, getAllUser } = require("../controller/userController");
const validateJWT = require("../middleware/validateJWT");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/people", validateJWT, getAllUser);

module.exports = router;