const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");


const verifyJWT = expressAsyncHandler(async (req, res, next) => {
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization || req.cookies.accessToken;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
    }
    jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "User is not authorized!" })
        } else {
            return user = decoded.user;
        }
    })
    next();
});

module.exports = { verifyJWT };