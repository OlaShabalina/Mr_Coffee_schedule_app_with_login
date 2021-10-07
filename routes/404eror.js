const express = require('express');
const router = express.Router();
const db = require('../database');

// Home page is only accessible once the user is logged in
router.get('/', (req, res) => {
    res.render('pages/404error');
});

module.exports = router;