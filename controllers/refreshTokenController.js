const Users = require('../model/User');
const UserSettings = require('../model/UserSetting');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;

    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }
    const foundUserSettings = await UserSettings.findOne({ userID: foundUser._id }).exec();

    const currentUser = {
        email: foundUser.email,
        firstName: foundUser.firstName,
        image: foundUser.image,
        darkMode: foundUserSettings?.darkMode || false,
        roles: foundUser.roles
    }

    // Verify the refresh token
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.email !== decoded.email) {
                return res.sendStatus(403); // Forbidden
            }
            // Create a new access token
            const accessToken = jwt.sign(
                { "email": decoded.email },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            );
            res.status(200).json({ accessToken, currentUser });
            console.log(currentUser); // Send the new access token to the client
            console.log('New Access Token:', accessToken);
        }
    );
}

module.exports = { handleRefreshToken };