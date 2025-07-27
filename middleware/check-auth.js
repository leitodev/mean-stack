const jwt = require("jsonwebtoken");

// middleware for checking Headers token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, "long_secret_private_key");
        next();
    } catch (error) {
        res.status(401).json({error: error, message: "Unauthorized"});
    }
}