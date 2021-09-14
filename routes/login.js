const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

const flash = require('express-flash');
router.use(flash());

//  Login
router.get('/', (req, res) => {
    res.render('pages/login');
});

router.post('/', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, email);
        console.log(user)
        
        if ( user ) {
            console.log(password);
            console.log(user.password)
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (passwordIsValid) {
                req.session.userId = user.user_id;
                console.log(req.session.userId)
                res.redirect('/');
            } else {
                req.flash("error", "Password is not correct");
                res.redirect('/login');
            }
        } else {
            req.flash("error", "Email is not registered");
            res.redirect('/login');
        }
    } catch (err) {
        console.log(err);
    }    
}
);

module.exports = router;