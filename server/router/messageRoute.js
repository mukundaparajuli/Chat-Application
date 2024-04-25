const express = require("express");
const router = express.Router();
const validateJWT = require("../middleware/validateJWT");
const { getMessages } = require("../controller/messageController");

router.get("/messages/:id", validateJWT, getMessages);

module.exports = router;
