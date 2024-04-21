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
const Message = require("./Models/messageSchema");
const mongoose = require("mongoose");

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
    console.log("New connection established");
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
    // Handle errors
    connection.on('error', (error) => {
        console.error("WebSocket connection error:", error);
    });

    // Handle incoming messages
    connection.on('message', async (message) => {
        [...wss.clients].forEach(c => console.log(c.userId));
        try {
            const messageDatas = JSON.parse(message.toString());
            console.log("Received raw message:", message.toString());
            console.log("Parsed message:", messageDatas);

            // Check if messageData has the expected structure
            if (messageDatas) {
                const { recipient, textMessage } = messageDatas;
                console.log(recipient, textMessage)
                // Filter clients and send message
                const messageDocumented = await Message.create({
                    sender: connection.userId,
                    recipient: recipient,
                    message: textMessage,
                });
                [...wss.clients]
                    // .filter(c => c.userId === recipient)
                    .forEach(c => c.send(JSON.stringify({
                        message: [...wss.clients].map(c => (messageDatas))
                        , sender: connection.userId,
                        id: messageDocumented._id,
                    })));
                console.log("Received message:", messageDatas);
            } else {
                console.error("Invalid message data:", messageDatas);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    });


    // Notify other clients about the new connection

    console.log([...wss.clients].user);
    [...wss.clients].forEach(client => {
        client.send(JSON.stringify({
            online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
        }))
    })
});
