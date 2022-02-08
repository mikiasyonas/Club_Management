const { roles } = require('../roles');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.signup = async (req, res, next) => {
    try {
        const { email, userName, telegramUserName, password, role, division } = req.body;

        const hashedPassword = await hashPassword(password);

        const newUser = new User({ 
            email, 
            userName,
            telegramUserName,
            password: hashedPassword,
            division: division,
            role:role || "member"
        });

        const accessToken = jwt.sign({
            userId: newUser._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            });

        newUser.accessToken = accessToken;

        await newUser.save();

        return res.status(200).json({
            data: newUser,
            accessToken
        });
    } catch (error) {
        next(error);
    }
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            email 
        });
        
        if(!user) {
            return res.status(401).json({
                error: "No Account With This Email"
            })
        }

        const validPassword = await validatePassword(password, user.password);

        if(!validPassword) {
            return res.status(403).json({
                error: "Password"
            });
        }

        const accessToken = jwt.sign({
            userId: user._id,
            }, process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            });

        await User.findByIdAndUpdate(user._id, { 
            accessToken 
        });

        return res.status(200).json({
            data: {
                user: user,
            },
            accessToken
        });
    } catch(error) {
        next(error);
    }
}

exports.getUsers = async (req, res, next) => {
    const users = await User.find({}); //Shoudl return users with member flag in the database
    if(!users) {
        return res.status(403).json({
            message: "No Users In The Database Yet!"
        });
    }
    return res.status(200).json({
        data: users
    });
}


exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);

        if(!user) {
            // return next(new Error("User does not exist"));
            return res.status(409).json({
                error: "The User Does Not Exist!"
            });
        }

        return res.status(200).json({
            data: user
        });
    } catch (error) {
        next(error);
    }
}

exports.updateUser = async (req, res, next) => {
    try {
        // const update = req.body;
        const { userName, telegramUserName } = req.body;
        const userId = req.params.userId;
        const updatedUser = await User.findByIdAndUpdate(userId, {
            userName: userName, 
            telegramUserName: telegramUserName
        });

        if(!updatedUser) {
            return res.status(401).json({
                error: "User Not Found"
            });
        }
        return res.status(200).json({
            data: user,
            message: `User ${ updatedUser.userName } Has Been Updated`
        });
    } catch(error) {
        next(error);
    }
}

exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = await User.findByIdAndDelete(userId);
        if(!user) {
            return res.status(401).json({
                error: "User Not Found"
            });
        }
        return res.status(200).json({
            data: null,
            message: "user has been deleted"
        });
    } catch (error) {
        next(error);
    }
}

exports.grantAccess = function(action, resource) {
    return async (req, res, next) => {
        try {
            const permission = roles.can(req.user.role)[action](resource);
            if(!permission.granted) {
                return res.status(401).json({
                    error: "You dont have enough permission to perform this action"
                });
            }
            next();
        } catch(error) {
            next(error);
        }
    } 
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if(!user) {
            return res.status(401).json({
                error: "Login to access this route"
            });
        }
        req.user = user;
        next();
    } catch(error) {
        next(error);
    }
}

