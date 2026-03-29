const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization; // Get the Authorization header from the request
    // Check if the Authorization header is present
    console.log('Authorization Header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.sendStatus(401); // Unauthorized
    }
    console.log(authHeader);
    // Extract the token from the Authorization header
    const token = authHeader && authHeader.split(' ')[1]; // Get the token from the Authorization header
    console.log(token);

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.sendStatus(403); // invalid token Forbidden
            }
            req.email = decoded.email; // Attach the decoded user information to the request object
            next(); // Call the next middleware or route handler
        }
    );
}

module.exports = verifyJWT;