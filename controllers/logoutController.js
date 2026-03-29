const Users = require('../model/User');

const handleLogout = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        console.log('No cookies found');
        return res.sendStatus(204); // No content
    }
    const refreshToken = cookies.jwt;
    console.log('Refresh Token from Cookie:', refreshToken);
    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    console.log('Found User:', foundUser);
    if (!foundUser) {
        // Clear the cookie if the user is not found
        res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure : true });
        console.log('User not found for the provided refresh token');
        return res.sendStatus(204); // No content
    }

    // Remove the refresh token from the user's record
    await Users.updateOne({ email: foundUser.email }, { refreshToken: "" });
    console.log('User logged out:', foundUser.email);
    
    // Optionally, you can also remove the refresh token from the database
    // or perform any other cleanup operations as needed.
    // Respond with a success status
    // Clear the cookie
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure : true });
    
    res.status(200).send('Logout successful');
}

module.exports = { handleLogout };
