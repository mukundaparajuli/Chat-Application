// server.js
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const databaseConnection = require("./config/dbConnection");
const port = process.env.PORT || 5001 || 5555;
const asyncHandler = require("express-async-handler");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const ws = require("ws");
const jwt = require("jsonwebtoken");
const Message = require("./Models/messageSchema");
const mongoose = require("mongoose");
const fs = require("fs");
// const path = require("path");

databaseConnection();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(__dirname + '/uploads'))
app.use("/api/user/", require("./router/userRoute"));
app.use("/api/", require("./router/messageRoute"));
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'none'; font-src 'self' http://localhost:5000;"
    );
    next();
});

app.get("/", (req, res) => {
    console.log(req.cookies);
    res.send("Cookies logged in server console");
});

const server = app.listen(port, () => {
    console.log(`listening to port ${port}`);
});

const wss = new ws.WebSocketServer({ server });

wss.on('connection', (connection, req) => {

    const notifyOnConnection = () => {
        [...wss.clients].forEach(client => {
            client.send(JSON.stringify({
                online: [...wss.clients].map(c => ({ userId: c.userId, username: c.username }))
            }))
        })
    }

    connection.isAlive = true;
    connection.timer = setTimeout(() => {
        connection.ping();
        connection.deathTimer = setTimeout(() => {
            connection.isAlive = false;
            clearInterval(connection.timer);
            connection.terminate();
            notifyOnConnection();
            console.log("Death")
        }, 1000);
    }, 5000);

    connection.on('pong', () => {
        clearTimeout(connection.deathTimer);
    })


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

    connection.on('error', (error) => {
        console.error("WebSocket connection error:", error);
    });

    connection.on('message', async (message) => {
        [...wss.clients].forEach(c => console.log(c.userId));
        try {
            const messageDatas = JSON.parse(message.toString());
            // console.log("Received raw message:", message.toString());
            // console.log("Parsed message:", messageDatas);

            if (messageDatas) {
                console.log(messageDatas)
                let fileName = null;
                const { recipient, textMessage, file } = messageDatas.message;
                if (file) {
                    const ext = file.name;
                    fileName = Date.now() + '.' + ext;
                    const path = __dirname + '/uploads/' + fileName;
                    const bufferData = Buffer.from(file.data.split(',')[1], 'base64');
                    fs.writeFile(path, bufferData, () => {
                        console.log('file saved:' + path);
                    })
                }
                const messageDocumented = await Message.create({
                    sender: connection.userId,
                    recipient: recipient,
                    message: textMessage,
                    file: file ? fileName : null,
                });
                console.log(messageDocumented);
                [...wss.clients]
                    .forEach(c => {
                        if (c !== connection) {
                            c.send(JSON.stringify({
                                message: [...wss.clients].map(c => (messageDatas)),
                                sender: connection.userId,
                                id: messageDocumented._id,
                                recipient: messageDocumented.recipient,
                                file: messageDocumented.file,
                            }))
                        }
                    });
                console.log("Received message:", messageDatas);
            } else {
                console.error("Invalid message data:", messageDatas);
            }
        } catch (error) {
            console.error("Error parsing WebSocket message:", error);
        }
    });

    console.log([...wss.clients].user);
    notifyOnConnection();
});
