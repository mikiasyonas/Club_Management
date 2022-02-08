const { roles } = require('../roles');
const Division = require('../models/DivisionModel');
const User = require('../models/UserModel');
const jwt = require('jsonwebtoken');
const { findById } = require('../models/DivisionModel');


exports.createDivision = async (req, res, next) => {
    try{
        const { name } = req.body;

        const newDivision = new Division({
            name
        });

        await newDivision.save();

        res.json({
            data: newDivision
        })
    } catch(error) {
        next(error)
    }
}

exports.assignPresident = async (req, res, next) => {
    try {
        const { presidentId, divisionId } = req.params;

        const division = await Division.findByIdAndUpdate(divisionId, {
            president: presidentId
        });

        if(!division) {
            return res.status(500).json({
                message: "Division could not be found"
            })
        }

        const user = await User.findByIdAndUpdate(presidentId, {
            role: "division_president"
        })

        if(!user) {
            return res.status(500).json({
                message: "User could not be found"
            })
        }

        res.status(200).json({
            data: division
        });
    } catch(error) {
        next(error);
    }
}

exports.removePresident = async (req, res, next) => {
    try {
        const { divisionId } = req.params;

        const div = await Division.findById(divisionId);

        const user = div.president;

        if(user != "") {
            await User.findByIdAndUpdate(user, {
                role: "member"
            });
        }

        const division = await Division.findByIdAndUpdate(divisionId, {
            president: ''
        });

        if(!division) {
            return res.status(500).json({
                message: 'division could not be found'
            })
        }

        return res.status(200).json({
            data: division
        });
    } catch(error) {
        next(error)
    }
}

exports.changeName = async (req, res, next) => {
    try {
        const { divisionId } = req.params;
        const { name } = req.body;

        const division = await Division.findByIdAndUpdate(divisionId, {
            name: name
        });

        if(!division) {
            return resizeTo.status(500).json({
                message: "division could not be found"
            });
        }

        res.status(200).json({
            data:division,
            message: "changed name successfully"
        })
    } catch(error) {
        next(error);
    }
}

exports.deleteDivision = async (req, res, next) => {
    try {
        const { divisionId } = req.params;

        const div = await Division.findById(divisionId);
        const user = div.president;
        

        if(user != "") {
            await User.findByIdAndUpdate(user, {
                role: "member"
            });
        }

        const division = await Division.findByIdAndDelete(divisionId);

        if(!division) {
            return res.status(500).json({
                message: 'division could not be found'
            })
        }

        return res.status(200).json({
            message: "deleted division successfully"
        });

    } catch(error) {
        next(error);
    }
}



exports.getDivisionMembers = async (req, res, next) => {
    try {
        const userId = res.locals.loggedInUser._id;
        const user = await User.findById(userId);

        if(user.role != "division_president") {
            return res.status(500).json({
                error: "access denied"
            });
        }

        const division = await Division.find({
            president: userId
        });

        const divisionName = division.name;

        const members = await User.find({
            division: divisionName
        });

        if(!members) {
            return res.json({
                message: "no members or something wrong"
            })
        }

        return res.status(200).json({
            data: members
        });
    } catch(error) {
        next(error);
    }
}

exports.announceMembers = async (req, res, next) => {
    try {
        
    } catch(error) {

    }
}