require("dotenv").config();
const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt'); // Password encryption

// Authentification modules 
const session = require('express-session');
router.use(session({
    secret: 'secret',
    // should we keep the data secret? 

    resave: false,
    // should we resave the information cahnge?

    saveUninitialized: false
}));

const flash = require('express-flash');
router.use(flash());

// Registration
router.get('/register', (req, res) => {
    res.render('pages/register');
});

router.post('/register', async (req, res) => {
    let { firstname, lastname, email, password } = req.body;
    
    // Backend validation for the form
    let errors = [];

    if (!firstname || !lastname || !email || !password ) {
        errors.push({ message: "Please enter all fields." });
    }

    if ( password.length < 6 ) {
        errors.push({ message: "Password should be at least 6 characters." });
    }

    if (errors.length > 0) {
        res.render('pages/register', { errors });
    } else {
        // Form validation has passed

        // encryption with Bcrypt
        let hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        try {
            const userExists = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
            console.log(userExists)

            if ( !userExists ) {
                await db.none(
                    `INSERT INTO users (firstname, lastname, email, password)
                    VALUES ($1, $2, $3, $4)`, 
                    [firstname, lastname, email, hashedPassword]);
                req.flash("success_msg", "You are now registered, please log in");
                console.log(req.session.flash.success_msg[0])
                res.redirect('/login');
            } else {
                errors.push({ message: "Email is already registered" });
                res.render('pages/register', { errors });
            }
        } catch (err) {
            console.log(err);
        }    
    }

})

//  Login
router.get('/login', (req, res) => {
    res.render('pages/login');
});


// Home page is only accessible once the user is logged in
router.get('/', (req, res) => {
    res.render('pages/home', { user: "Olga "});
});




module.exports = router;