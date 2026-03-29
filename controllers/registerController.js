const Users = require('../model/User');
const bcrypt = require('bcrypt');



const handleNewUser = async (req, res) => {
    const { firstName, email, lastName, password} = req.body;

    // Check for missing fields
    if ( !firstName || !lastName || !email || !password) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }
    
    // Check for duplicate usernames
    const duplicate = await Users.findOne({ email: email }).exec();
    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // Encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // Save the new user to the database
        await Users.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            darkMode: false,
            image: "https://api.dicebear.com/9.x/toon-head/svg?scale=120&skinColor=f1c3a5,c68e7a,b98e6a&backgroundColor=b6e3f4&seed=Brian",
            password: hashedPwd,
            roles: { User: 2001 } 
        });

        //const jsonNewUser = JSON.stringify(newUser);
        res.status(201).json({ 'message': 'OK'}); // Created
    } catch (err) {
        console.error(err);
        res.status(500).json({ 'message': 'Internal server error' });
    }
}

module.exports = { handleNewUser };