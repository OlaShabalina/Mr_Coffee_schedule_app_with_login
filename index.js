require('dotenv').config();

const express = require('express');
const app = express();
const session = require('express-session');

const PORT = process.env.PORT || 3000
const path = require('path');

// Session redirection config 
const {redirectToHome} = require('./middleware');
const {redirectToLogin} = require('./middleware');

// Setting up our static folder
app.use(express.static(path.join(__dirname,'public')));

// Session configuration 
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: process.env.NODE_ENV === true,

    },
    name: 'mrcoffee_project4',
    secret: process.env.SESS_SECRET,
    // should we keep the data secret? 

    resave: false,
    // should we resave the information cahnge?

    saveUninitialized: false
}));

// Will be using flash to display success and error messages
const flash = require('express-flash');
app.use(flash());

// Body Parser
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

// Set view engine as EJS 
app.set('view engine', 'ejs');

// Routes
const homeRouter = require('./routes/home');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const schedulesRouter = require('./routes/schedules');

// Middleware routes
app.use('/register', redirectToHome, registerRouter);
app.use('/login', redirectToHome, loginRouter);
app.use('/', homeRouter);
app.use('/logout', redirectToLogin, logoutRouter);
app.use('/schedules', schedulesRouter);

app.listen(PORT, () => console.log(`We are listening on http://localhost:${PORT}`));