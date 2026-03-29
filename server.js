require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOrigins');
const credentials = require('./middleware/credentials');
const connectDB = require('./config/dbConnect');


const PORT = process.env.PORT || 5000;


connectDB();

app.use(logger);

app.use(credentials);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use('/', express.static('./routes/api/root.js'));
app.use('/subdir', require('./routes/api/subdir'));
app.use('/register', require('./routes/api/register'));
app.use('/blog', require('./routes/api/blog'));
app.use('/login', require('./routes/api/login'));
app.use('/productDetail', require('./routes/api/productDetail'));
app.use('/refresh', require('./routes/api/refresh'));


app.use('/logout', require('./routes/api/logout'));
app.use('/blogComment', require('./routes/api/blogComment'));
app.use('/productComment', require('./routes/api/productComment'));
app.use('/orderHistory', require('./routes/api/orderHistory'));
app.use('/userProfileImage', require('./routes/api/userProfileImage'));
app.use('/userSetting', require('./routes/api/userSetting'));
app.use('/cartItems', require('./routes/api/cartItems'));
app.use('/userPayment', require('./routes/api/userPayment'));
app.use('/notifications', require('./routes/api/notification'));
app.get('/', async (req, res) => {
    res.send('Welcome to the Guitar Store API');
});
//app.use(verifyJWT);
app.use('/userProfile', require('./routes/api/userProfile'));
app.use('/product', require('./routes/api/product'));
//app.use('/orders', require('./routes/api/order'));
//app.use('/notifications', require('./routes/api/notification'));

app.all('/*path', (req, res) => {
  res.status(404);
  if (req.accepts('html')){
    res.sendFile('./views/404.html', { root: __dirname });
  }else if (req.accepts('json')){
    res.json({ error: "404 Not Found"});
  }else {
    res.type('txt').send("404 Not Found");
  }
});

app.use(errorHandler);
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
