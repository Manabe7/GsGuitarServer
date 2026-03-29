const Users = require('../model/User');
const UserProfile = require('../model/UserProfile');
const bcrypt = require('bcrypt');


const getUserProfile = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;   
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const userData = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    };
    console.log(userData);
    res.status(201).json({ userData }); // Created
       
}

const updateUserProfile = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const updatedUser = {
        firstName: req.body.firstName? req.body.firstName : user.firstName,
        lastName: req.body.lastName? req.body.lastName : user.lastName,
        email: req.body.email? req.body.email : user.email
    };
    const index = await Users.findOne({ _id: user._id }).exec();
    if (index !== -1) {
        await Users.updateOne({ _id: user._id }, updatedUser);
        res.status(200).json(updatedUser);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const getUserAddress = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const userProfile = await UserProfile.findOne({ userID: user._id }).exec();
    if (userProfile) {
        const currentUserProfile = {
            street: userProfile.street,
            city: userProfile.city,
            country: userProfile.country,
            postalCode: userProfile.postalCode,
            phoneNumber: userProfile.phoneNumber
        };
        console.log(currentUserProfile);
        res.status(200).json(currentUserProfile);
    } else {
        try {
            const newProfile = {
                userID: user._id,
                street: '',
                city: '',
                country: '',
                postalCode: '',
                phoneNumber: ''
            };
            const result = await UserProfile.create(newProfile);
            const newUserProfile = {
                street: result.street,
                city: result.city,
                country: result.country,
                postalCode: result.postalCode,
                phoneNumber: result.phoneNumber
            };
            console.log(newUserProfile);
            res.status(201).json({ newUserProfile, 'message': 'UserProfile created successfully'}); // Created
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }
}

const UpdateUserPassword = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    const updatedUser = req.body;
    if (foundUser) {
        const match = await bcrypt.compare(updatedUser.Password, foundUser.Password);
        if (!match) {
            const hashedPassword = await bcrypt.hash(updatedUser.Password, 10);
            updatedUser.Password = hashedPassword;
            await Users.updateOne({ _id: foundUser._id }, updatedUser);
            res.status(200).json(updatedUser);
        }else if (match) {
            res.status(400).json({ message: 'Password is the same as the current one' });
            return;
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const updateUserAddress = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const foundUserProfile = await UserProfile.findOne({ userID: user._id }).exec();
    const updatedUser = await UserProfile.updateOne({ userID: user._id }, {
            street: req.body.street || foundUserProfile.street,
            city: req.body.city || foundUserProfile.city,
            country: req.body.country || foundUserProfile.country,
            postalCode: req.body.postalCode || foundUserProfile.postalCode,
            phoneNumber: req.body.phoneNumber || foundUserProfile.phoneNumber
        });
        res.status(200).json(updatedUser);
}


const deleteUser = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const index = await Users.findOne({ _id: user._id }).exec();
    if (index !== -1) {
        await Users.deleteOne({ _id: user._id });
        res.status(200).json({ message: 'User deleted successfully' });
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    getUserAddress,
    UpdateUserPassword,
    updateUserAddress,
    deleteUser
};