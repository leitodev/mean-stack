const jwt = require("jsonwebtoken");

// middleware for checking Headers token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "long_secret_private_key");
        // we can get userId from our token
        req.userTokenData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (error) {
        res.status(401).json({error: error, message: "Unauthorized"});
    }
}