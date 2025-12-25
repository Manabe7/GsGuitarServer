const cartItems = require('../model/cartItems');
const Product = require('../model/Product');
const Users = require('../model/User');

exports.getCartItems = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;

    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (foundUser) {
        try {
            const userCartItems = await cartItems.find({ userID: foundUser._id });
            if (!userCartItems) {
                const newUserCartItems =  await cartItems.create({ userID: foundUser._id });
                return res.status(200).json(newUserCartItems);
            }else {
                const detailedItems = await Promise.all(userCartItems[0].items.map(async (item) => {
                    const product = await Product.findOne({ productID: item.productID });
                    return {
                        productID: item.productID,
                        quantity: item.quantity,
                        name: product.name,
                        price: product.price,
                        image: product.image
                    };
                }));
                console.log(detailedItems);
                return res.status(200).json(detailedItems);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    } else {
        return res.sendStatus(403); // Forbidden
    }
};

exports.addToCart = async (req, res) => {
    const cookies = req.cookies;
    const { productID, quantity } = req.body;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    
    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (foundUser) {
        try {
            const userCartItems = await cartItems.findOne({ userID: foundUser._id });
            if (!userCartItems) {
                const newUserCartItems =  await cartItems.create({
                    userID: foundUser._id,
                    items: [{ productID, quantity }]
                });
                return res.status(200).json(newUserCartItems);
            } else {
                const checkProductExists = userCartItems.items.find(item => item.productID.toString() === productID);
                if (checkProductExists) {
                    checkProductExists.quantity += quantity;
                    await userCartItems.save();
                    return res.status(200).json(checkProductExists);
                }
                userCartItems.items.push({ productID, quantity });
                await userCartItems.save();
                return res.status(200).json(productID, quantity);
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    } else {
        return res.sendStatus(403); // Forbidden
    }
};

exports.updateCartItems = async (req, res) => {
    const cookies = req.cookies;
    const { productID, quantity } = req.body;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    
    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (foundUser) {
        try {
            const userCartItems = await cartItems.findOne({ userID: foundUser._id });
            if (!userCartItems) {
                return res.status(404).json({ message: 'Cart not found' });
            } else {
                const itemToUpdate = await userCartItems.items.find(item => item.productID.toString() === productID);
                if (itemToUpdate) {
                    itemToUpdate.quantity = quantity;
                    await userCartItems.save();
                    return res.status(200).json(itemToUpdate);
                } else {
                    return res.status(404).json({ message: 'Item not found in cart' });
                }
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    } else {
        return res.sendStatus(403); // Forbidden
    }
};

exports.removeFromCart = async (req, res) => {
    const cookies = req.cookies;
    const { productID } = req.params;
    if (!cookies?.jwt) {
        return res.sendStatus(401).json({ user: null}); // Unauthorized
    }
    const refreshToken = cookies.jwt;
    
    // Check if the refresh token is in the database
    const foundUser = await Users.findOne({ refreshToken: refreshToken }).exec();
    if (foundUser) {
        try {
            const userCartItems = await cartItems.findOne({ userID: foundUser._id });
            if (!userCartItems) {
                return res.status(404).json({ message: 'Cart not found' });
            } else {
                const itemIndex = userCartItems.items.findIndex(item => item.productID.toString() === productID);
                if (itemIndex > -1) {
                    userCartItems.items.splice(itemIndex, 1);
                    await userCartItems.save();
                    return res.status(200).json({ message: 'Item removed from cart' });
                } else {
                    return res.status(404).json({ message: 'Item not found in cart' });
                }
                
            }
        } catch (error) {
            return res.status(500).json({ message: 'Server Error', error });
        }
    } else {
        return res.sendStatus(403); // Forbidden
    }
};


