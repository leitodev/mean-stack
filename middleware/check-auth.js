const jwt = require("jsonwebtoken");
require('dotenv').config();

const JWT_PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

// middleware for checking Headers token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, JWT_PRIVATE_KEY);
        // we can get userId from our token
        req.userTokenData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (error) {
        res.status(401).json({error: error, message: "Unauthorized"});
    }
}