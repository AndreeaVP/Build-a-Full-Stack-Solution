const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.USER_TOKEN);
        const now = Math.floor(Date.now() / 1000);
        if (decodedToken.exp < now) {
            throw new Error('Token has expired');
        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: new Error('Authentication failed! Please provide a valid token!')
        });
    }
};