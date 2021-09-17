const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const {redirectToHome} = require('../middleware');

//  Login
router.get('/', redirectToHome, (req, res) => {
    res.render('pages/login');
});

router.post('/', (req, res) => {
    const { email, password } = req.body;

    // Backend validation for the login form
    if ( !email || !password ) {
        res.render('pages/login', { message: "Please enter all fields." });
    } else {
        // If the validation has passed:

        // checking if the email exists
        db.oneOrNone('SELECT * FROM users WHERE email = $1;', email)
        .then(user => {
            if (!user) {
                req.flash("error", "Either this email doesn't exists or password is not correct");
                res.redirect('/login');
            } else {

                // if user exists, we verify his password
                bcrypt.compare(password, user.password)
                .then(result => {
                    if (result) {
                        // if password is correct -> we create a user ID inside the session
                        req.session.userId = user.user_id;
                        res.redirect('/');
                    } else {
                        req.flash("error", "Either this email doesn't exists or password is not correct");
                        res.redirect('/login')
                    }
                })
                .catch(error => {
                    console.log(error);
                });
            };
        });
    };
}
);

module.exports = router;