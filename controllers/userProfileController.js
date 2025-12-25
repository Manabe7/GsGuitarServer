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
    const userProfile = await UserProfile.findOne({ userID: user._id }).exec();
    const currentUserProfile = {
        street: userProfile ? userProfile.street : '',
        city: userProfile ? userProfile.city : '',
        country: userProfile ? userProfile.country : '',
        postalCode: userProfile ? userProfile.postalCode : '',
        phoneNumber: userProfile ? userProfile.phoneNumber : ''
    };
    if (userProfile) {
        console.log(currentUserProfile,userData);
        res.status(200).json({currentUserProfile,userData});
    }else {
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
            console.log(newUserProfile,userData);
            res.status(201).json({ newUserProfile, userData, 'message': 'UserProfile created successfully'}); // Created
        } catch (err) {
            console.error(err);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }
}

const UpdateUser = async (req, res) => {
    const updatedUser = req.body;
    const index = await Users.findOne({ _id: updatedUser._id }).exec();
    if (index !== -1) {
        const match = await bcrypt.compare(updatedUser.Password, index.Password);
        if (!match) {
            const hashedPassword = await bcrypt.hash(updatedUser.Password, 10);
            updatedUser.Password = hashedPassword;
            await Users.updateOne({ _id: updatedUser._id }, updatedUser);
            res.status(200).json(updatedUser);
        }else if (match) {
            res.status(400).json({ message: 'Password is the same as the current one' });
            return;
        }
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

const updateUserProfile = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    
    const user = await Users.findOne({ refreshToken: refreshToken }).exec();
    const updatedProfile = {
        userID: user._id,
        street: req.body.street,
        city: req.body.city,
        country: req.body.country,
        postalCode: req.body.postalCode,
        phoneNumber: req.body.phoneNumber
    };
    const index = await UserProfile.findOne({ userID: user._id }).exec();
    if (index !== -1) {
        await UserProfile.updateOne({ userID: user._id }, updatedProfile);
        res.status(200).json(updatedProfile);
    } else {
        try {
            const result = await UserProfile.create(updatedProfile);
            console.log(result);
            res.status(201).json({ 'message': 'UserProfile created successfully'}); // Created
        }catch (err) {
            console.error(err);
            res.status(500).json({ 'message': 'Internal server error' });
        }
    }
}


const deleteUser = async (req, res) => {
    const id = req.params.id;
    const index = await Users.findOne({ _id: id }).exec();
    if (index !== -1) {
        await Users.deleteOne({ _id: id });
        res.status(200).json({ message: 'User deleted successfully' });
        res.status(204).end();
    } else {
        res.status(404).json({ message: 'User not found' });
    }
}

module.exports = {
    getUserProfile,
    UpdateUser,
    updateUserProfile,
    deleteUser
};