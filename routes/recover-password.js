const express = require('express');
const router = express.Router();
const {redirectToHome} = require('../middleware');

router.get('/', redirectToHome, (req, res) => {
    res.render('pages/recover-password');
});


module.exports = router;