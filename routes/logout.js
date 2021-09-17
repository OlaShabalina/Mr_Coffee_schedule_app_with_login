const express = require('express')
const router = express.Router();
const {redirectToLogin} = require('../middleware');

router.get('/', (req, res) => {
    req.session.destroy(error => {
        if (error) {
            console.log(error)
            res.send(error);
        } else {
            res.clearCookie('mrcoffee_project4');
            res.redirect('/login');
        }
    })
})

module.exports = router;