const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
  //res.sendFile('./views/subdir/index.html' , { root: __dirname});
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'index.html'));
});

router.get('/test', async (req, res) => {
  //res.sendFile('./views/subdir/index.html' , { root: __dirname});
  res.sendFile(path.join(__dirname, '..', 'views', 'subdir', 'test.html'));
});



module.exports = router;
