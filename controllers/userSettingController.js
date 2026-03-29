const User = require('../model/User');
const UserSetting = require('../model/UserSetting');

const updateUserSetting = async (req, res) => {
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
        const { darkMode, notifications } = req.body;
        let userSetting = await UserSetting.findOne({ userID: foundUser._id }).exec();
        if (!userSetting) {
            const newUserSetting ={
                userID: foundUser._id,
                darkMode: darkMode || false,
                notifications: {
                    email: notifications?.email || false,
                    sms: notifications?.sms || false,
                    push: notifications?.push || false
                }
            };
            userSetting = new UserSetting(newUserSetting);
        } else {
            userSetting.darkMode = darkMode;
            userSetting.notifications = notifications;
        }
        await userSetting.save();
        res.status(200).json({ message: 'User settings updated successfully', userSetting });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserSetting = async (req, res) => {
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
        const userSetting = await UserSetting.findOne({ userID: foundUser._id }).exec();
        if (!userSetting) {
            return res.status(404).json({ message: 'User settings not found' });
        }   
        res.status(200).json({ userSetting });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { updateUserSetting, getUserSetting };
