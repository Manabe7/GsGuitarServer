const User = require('../model/User');
const Notification = require('../model/Notification');

const getUserNotifications = async (req, res) => {
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
        const userNotifications = await Notification.findOne({ userID: foundUser._id }).exec();
        if (!userNotifications) {
            return res.status(404).json({ message: 'No notifications yet' });
        }
        res.status(200).json(userNotifications.notifications);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const markNotificationAsRead = async (req, res) => {
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
        const { notificationId } = req.body;
        const userNotification = await Notification.findOne({userID: foundUser._id }).exec();
        const notification = await userNotification.notifications.id(notificationId);
        if (!userNotification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        notification.read = true;
        await userNotification.save();
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};  

const deleteNotification = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    const foundUser = await User.findOne({ refreshToken: refreshToken }).exec();    
    if (!foundUser) {
        return res.sendStatus(401).json({ user: null }); // Unauthorized
    }
    try {        const { notificationId } = req.body;
        const userNotification = await Notification.findOne({userID: foundUser._id }).exec();
        const notification = await userNotification.notifications.id(notificationId);
        if (!notification) {
            return res.status(404).json({ message: 'Notification not found' });
        }
        await notification.remove();
        res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

module.exports = { getUserNotifications, markNotificationAsRead, deleteNotification };