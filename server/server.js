const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const databaseConnection = require("./config/dbConnection");
const port = process.env.PORT || 5001;
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const jwt = require("jsonwebtoken");

databaseConnection();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api/user/", require("./router/userRoute"));

app.get("/", (req, res) => {
    console.log(req.cookies);
    res.send("Cookies logged in server console");
});

const server = app.listen(port, () => {
    console.log(`listening to port ${port}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {
    // console.log("An user has been connected!");

    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");
    if (token) {
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, user) => {
            if (err) throw err;
            const { userId, username } = user.user;
            connection.userId = userId;
            connection.username = username;
        })
    }
    console.log([...wss.clients].user);
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
        }))
    })

});
