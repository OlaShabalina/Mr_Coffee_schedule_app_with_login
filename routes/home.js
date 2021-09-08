const express = require('express');
const router = express.Router();
const db = require('../database');
const bcrypt = require('bcrypt');

// Authentification modules 
const session = require('express-session');
router.use(session({
    secret: 'secret',
    // should we keep the data secret? 

    resave: false,
    // should we resave the information change?

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

        try {
            const userExists = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
            
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

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);
        console.log(user)
        
        if ( user ) {
            console.log(password);
            console.log(user.password)
            const passwordIsValid = bcrypt.compareSync(password, user.password);
            if (passwordIsValid) {
                res.render('pages/home', { user } );
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


// Home page is only accessible once the user is logged in
router.get('/', (req, res) => {
    res.render('pages/home');
})

router.get("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
          if (err) {
              console.log(err);
              res.redirect("/");
          } else {
              res.redirect("/login");
          }
        });
      } else {
        res.end()
      }
});

// router.delete('/logout', (req, res) => {
//     if (req.session) {
//       req.session.destroy(err => {
//         if (err) {
//             res.status(400).send('Unable to log out')
//         } else {
//             req.flash("success_msg", "You have logged out successfully");
//             res.redirect("/login");
//         }
//       });
//     } else {
//       res.end()
//     }
// })


module.exports = router;