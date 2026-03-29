require('dotenv').config();
const Users = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    // Find user in the database
    const foundUser = await Users.findOne({ email: email }).exec();
    console.log('Found User:', foundUser);
    if (!foundUser) {
        return res.status(401).json({ 'message': 'Unauthorized' }); // Unauthorized
    }

    // Compare passwords
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
        // Create JWT token
        const accessToken = jwt.sign(
            { "email": foundUser.email } ,
            process.env.ACCESS_TOKEN_SECRET,    
            { expiresIn: '600s' }    
        );
        const refreshToken = jwt.sign(
            { "email": foundUser.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Store refresh token in the user object (or database)
        await Users.updateOne({ email: foundUser.email }, { refreshToken: refreshToken });
        const currentUser = {
            email: foundUser.email,
            firstName: foundUser.firstName,
            image: foundUser.image,
            roles: foundUser.roles
        };

        const cookie = req.cookies.jwt; // Check for existing cookie
        if (cookie) {
            res.clearCookie('jwt'); // Clear any existing cookie
            res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'none', // Use 'None' if your site is served over HTTPS
            secure: true, // Set to true if your site is served over HTTPS
            maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
        }else {
            res.cookie('jwt', refreshToken, {
                httpOnly: true,
                sameSite: 'none', // Use 'None' if your site is served over HTTPS
                secure: true, // Set to true if your site is served over HTTPS
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            });
        }
        // Respond with the access token and user information
        res.status(200).json({ accessToken, currentUser, message: 'Login successful' });
        
    } else {
        res.status(401).json({ 'message': 'Unauthorized' }); // Unauthorized
    }
}

module.exports = { handleLogin };