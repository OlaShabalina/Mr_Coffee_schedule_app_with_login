const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');
const {redirectToHome} = require('../middleware');

// Registration
router.get('/', redirectToHome, (req, res) => {
    res.render('pages/register');
});

router.post('/', redirectToHome, (req, res) => {
    let { firstname, lastname, email, password, confirmed_password } = req.body;
    
    // Back-end validation for the form
    const errors = [];

    if (!firstname || !lastname || !email || !password || !confirmed_password) errors.push({ message: "Please enter all fields." });
    if (!isNameValid(firstname)) errors.push({ message: "Please enter a valid name." });
    if (!isNameValid(lastname)) errors.push({ message: "Please enter a valid last name." });  
    if (!isEmailValid(email)) errors.push({ message: "Please enter a valid email." });
    if ( password.length < 6 ) errors.push({ message: "Password should be at least 6 characters." });
    if ( password !== confirmed_password ) errors.push({ message: "Your confirmation password doesn't match" });

    if (errors.length > 0) {
        res.render('pages/register', { errors });
    } else {
        // IF it gets here - means the form validation has passed

        db.oneOrNone("SELECT * FROM users WHERE email = $1;", email)
        .then(userExists => {
            if (userExists) {
                errors.push({ message: "Email is already registered" });
                res.render('pages/register', { errors });
            } else {
                // Hash password and clean the email
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                const cleanedEmail = email.toLowerCase().trim()

                // savind data in db
                db.none('INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4);', [firstname, lastname, cleanedEmail, hash])
                .then(() => {
                    req.flash("success_msg", "You are now registered, please log in");
                    res.redirect('/login');
                })
                .catch((error) => {
                    console.log(error);
                    res.render('pages/404error', { error });
                });
            };
        }); 
    }

})


// validation functions for inputs 

function isNameValid(input) {
    return /^[A-Za-z\s\-`']+[\.]?[A-Za-z\s]*$/.test(input);
};

function isEmailValid(email) {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    );
};

module.exports = router;