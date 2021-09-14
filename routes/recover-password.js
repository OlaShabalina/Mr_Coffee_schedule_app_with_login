const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('pages/recover-password');
});


module.exports = router;