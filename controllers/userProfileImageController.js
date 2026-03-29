const User = require('../model/User');
const UserProfileImage = require('../model/UserProfileImage');

const uploadProfileImage = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(401).json({ user: null }); // Unauthorized
    }
    try {
        const imageUrl = req.file ? req.file.path : null;
        const userProfileImage = new UserProfileImage({ image: imageUrl });
        await userProfileImage.save();
        res.status(201).json({ message: 'Profile image uploaded successfully', imageUrl });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserProfileImage = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(401).json({ user: null }); // Unauthorized
    }
    try {
        const { image } = req.body;
        console.log('Updating profile image to:', image);
        foundUser.image = image;
        await foundUser.save();
        console.log('Profile image updated for user:', foundUser);
        res.status(200).json({ message: 'Profile image updated successfully', image });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addProfileImage = async (req, res) => {   
    const { image } = req.body;
    const checkImage = await UserProfileImage.findOne({ image: image }).exec();
    console.log('Check Image:', image);
    if (checkImage) {
        return res.status(400).json({ message: 'Image already exists' });
    }
    try {
        const userProfileImage = new UserProfileImage({ image: image });
        await userProfileImage.save();
        res.status(201).json({ message: 'Profile image added successfully', imageUrl: image });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


const getAllProfileImages = async (req, res) => {
    try {
        const profileImages = await UserProfileImage.find().exec();
        res.status(200).json(profileImages);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    uploadProfileImage,
    updateUserProfileImage,
    getAllProfileImages,
    addProfileImage

};