const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

exports.checkToken = async (req, res, next) => {
    if(req.headers["x-access-token"]) {
        const accessToken = req.headers["x-access-token"];
        const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);

        if(exp < Date.now().valueOf() / 1000) {
            return res.status(401).json({
                error: "JWT token expired, please login"
            });
        }

        res.locals.loggedInUser = await User.findById(userId);
        next();
    } else {
        next();
    }
}