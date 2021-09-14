const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

const flash = require('express-flash');
router.use(flash());

// Registration
router.get('/', (req, res) => {
    res.render('pages/register');
});

router.post('/', async (req, res) => {
    let { firstname, lastname, email, password, confirmed_password } = req.body;
    

    // Backend validation for the form
    const errors = [];

    if (!firstname || !lastname || !email || !password || !confirmed_password) {
        console.log(errors)
        errors.push({ message: "Please enter all fields." });
    }

    if ( password.length < 6 ) {
        errors.push({ message: "Password should be at least 6 characters." });
    }

    if ( password !== confirmed_password ) {
        errors.push({ message: "Your confirmation password doesn't match" });
    }

    errors.forEach(error => console.log(error.message))

    if (errors.length > 0) {
        res.render('pages/register', { errors });
    } else {
        // IF it gets here - means the form validation has passed

        // encryption with Bcrypt
        let hashedPassword = await bcrypt.hash(password, 10);

        try {
            const userExists = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
            
            if ( !userExists ) {
                await db.none(
                    `INSERT INTO users (firstname, lastname, email, password)
                    VALUES ($1, $2, $3, $4)`, 
                    [firstname, lastname, email, hashedPassword]);
                req.flash("success_msg", "You are now registered, please log in");
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



module.exports = router;