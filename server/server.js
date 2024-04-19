const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const databaseConnection = require("./config/dbConnection");
const port = process.env.PORT || 5001;
const asyncHandler = require("express-async-handler");
const cors = require("cors");

databaseConnection();

app.use(cors());
app.use(express.json());
app.use("/api/user/", require("./router/userRoute"));

app.listen(port, () => {
    console.log(`listening to port ${port}`);
})