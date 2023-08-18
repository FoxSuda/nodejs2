const jwt = require('jsonwebtoken');
const {UserToken} = require('../models/models');

module.exports = async function (req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            return res.status(401).json({message: "Not authorized"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const userToken = await UserToken.findOne({ where: { userId: decoded.id, token } });
        if (!userToken) {
            return res.status(401).json({ message: "Not authorized" });
        }

        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({message:"Not authorized"});
    }
};