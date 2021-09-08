require('dotenv').config();

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000
const path = require('path');

// Body Parser
app.use(express.json());
app.use(express.urlencoded( { extended: false }));

// Setting up our static folder
app.use(express.static(path.join(__dirname,'public')));

// Set view engine as EJS 
app.set('view engine', 'ejs');

// Routes
const homeRouter = require('./routes/home');
const schedulesRouter = require('./routes/schedules');

// Middleware routes
app.use('/', homeRouter);
// app.use('/schedules', schedulesRouter);



app.listen(PORT, () => console.log(`We are listening on http://localhost:${PORT}`));