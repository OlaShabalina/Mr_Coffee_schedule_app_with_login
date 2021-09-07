require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt'); // Password encryption

router.get('/', (req, res) => {
    res.render('pages/home');
})





module.exports = router;