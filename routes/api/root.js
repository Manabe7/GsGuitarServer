const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

router.get('/404', async (req, res) => {
    res.status(404).sendFile(path.join(__dirname, '..', 'views', '404.html'));
});

module.exports = router;