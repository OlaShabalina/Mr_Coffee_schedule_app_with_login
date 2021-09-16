const express = require('express');
const router = express.Router();
const db = require('../database');
const {redirectToLogin} = require('../middleware');

// Home page is only accessible once the user is logged in
router.get('/', redirectToLogin, (req, res) => {
    const userId = req.session.userId;
    db.any("SELECT users.user_id,firstname,day,TO_CHAR(start_at, 'HH12:MI AM') start_at,TO_CHAR(end_at, 'HH12:MI AM') end_at FROM users LEFT JOIN schedules ON users.user_id = schedules.user_id WHERE users.user_id = $1;", [ userId ])
    .then((userSchedules) => {
        // generating schedules of the user
        userSchedules.forEach((schedule) => {

            if (schedule.day !== null) {
                
                // converting days of the week from numbers to actual days
                const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                for (let i = 1; i <= 7; i++) {
                    if (i == schedule.day) {
                        schedule.day = week[i - 1];
                    };
                };   
            }

            return schedule;
        })

        console.log(userSchedules);
        const userName = userSchedules[0].firstname;

        res.render('pages/home', { userSchedules, userName });
    })
    .catch(error => {
        console.log(error)
    });
});

module.exports = router;