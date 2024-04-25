const expressAsyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateJWT = expressAsyncHandler(async (req, res, next) => {
    let token;
    const authHeader = req.headers.authorization || req.headers.Authentication;
    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.SECRET_ACCESS_KEY, (err, decoded) => {
            if (err) {
                res.status(401);
                throw new Error("Unauthorized!");
            }
            req.user = decoded.user;
            console.log(req.user);
            next();
        });
    } else {
        res.status(401);
        throw new Error("Unauthorized!");
    }
});

module.exports = validateJWT;