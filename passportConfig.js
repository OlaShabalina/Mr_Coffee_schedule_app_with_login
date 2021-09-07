const LocalStrategy = require("passport-local").Strategy;
const db = require("./database");
const bcrypt = require("bcrypt");

function initialize(passport) {
    const authenticateUser = async (email, password, done) => {
        
            const user = await db.oneOrNone(`SELECT * FROM users WHERE email = $1;`, [email]);

            if ( user ) {
                const passwordChecked = await bcrypt.compare(password, user.password, (err, isMatch) => {
                    
                    if (err) {
                        console.log(err);
                    }

                    if (isMatch) {
                        console.log('there')
                        console.log(user)
                        return done(null, user);
                    } else {
                        console.log('here')
                        return done(null, false, { message: "Password is not correct" });
                    }
                }).then(user => {
                    if (user) {
                        return user;
                    }
                });

            } else {
                done(null, false, { message: "Email is not registered"});
            }  
    }

    passport.use(
        new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password"
        },
        authenticateUser
        )
    );

    passport.serializeUser((user, done) => done(null, user.user_id));

    passport.deserializeUser( async (id, done) => {
        console.log(id)
        console.log(user)
    const userFound = await db.oneOrNone(`SELECT * FROM users WHERE user_id = $1`, [id])
    
    if ( userFound ) {
        console.log(`ID is ${userFound[0].user_id}`);
        done(null, userFound[0]);
    }
    }) 
};

module.exports = initialize;