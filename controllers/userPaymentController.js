const User = require('../model/User');
const UserPayment = require('../model/Payment');

const addUserPayment = async (req, res) => {
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
        const paymentMethod = req.body;
        console.log('Received payment method:', paymentMethod);
        let userPayment = await UserPayment.findOne({ userID: foundUser._id }).exec();
        if (!userPayment) {
            res.status(404).json({ message: 'User payment information not found' });
        }
        else {
            const newPaymentMethod = {
                cardHolderName: paymentMethod.cardHolderName || '',
                cardNumber: paymentMethod.cardNumber || '',
                expiryDate: paymentMethod.expiryDate || '',
                cvv: paymentMethod.cvv || ''
            };
            userPayment.paymentMethod.push(newPaymentMethod);
        }
        await userPayment.save();
        res.status(200).json({ message: 'User payment information updated successfully', userPayment: userPayment.paymentMethod });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateUserPayment = async (req, res) => {
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
        const { paymentId, paymentMethod} = req.body;
        console.log('Received payment method:', paymentMethod);
        let userPayment = await UserPayment.findOne({ userID: foundUser._id }).exec();
        if (!userPayment) {
            res.status(404).json({ message: 'User payment information not found' });
        }
        else {
            const updatedPaymentMethod = userPayment.paymentMethod.map(method => {
                if (method._id.toString() === paymentId) {
                    return {
                        ...method,
                        cardHolderName: paymentMethod.cardHolderName || method.cardHolderName,
                        cardNumber: paymentMethod.cardNumber || method.cardNumber,
                        expiryDate: paymentMethod.expiryDate || method.expiryDate,
                        cvv: paymentMethod.cvv || method.cvv
                    };
                }
                return method;
            });
            userPayment.paymentMethod = [...updatedPaymentMethod];
        }
        await userPayment.save();
        res.status(200).json({ message: 'User payment information updated successfully', userPayment: userPayment.paymentMethod });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getUserPayment = async (req, res) => {
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
        const userPayment = await UserPayment.findOne({ userID: foundUser._id }).exec();
        if (!userPayment) {
            const newUserPayment = {
                userID: foundUser._id,
                paymentMethod: [] 
            };
            userPayment = new UserPayment(newUserPayment);
        }
        res.status(200).json({ userPayment: userPayment.paymentMethod });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};

const deleteUserPayment = async (req, res) => {
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
        const { paymentId } = req.body;
        console.log('Received payment ID for deletion:', paymentId);
        const userPayment = await UserPayment.findOne({ userID: foundUser._id}).exec();
        if (!userPayment) {
            return res.status(404).json({ message: 'User payment information not found' });
        }
        userPayment.paymentMethod = userPayment.paymentMethod.filter(method => method._id.toString() !== paymentId);
        await userPayment.save();
        res.status(200).json({ message: 'User payment information deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};  

module.exports = { addUserPayment, getUserPayment, deleteUserPayment, updateUserPayment };