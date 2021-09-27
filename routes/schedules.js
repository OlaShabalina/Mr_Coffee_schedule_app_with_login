const express = require('express');
const router = express.Router();
const db = require('../database');
const {redirectToLogin} = require('../middleware');

//notes to self to test if github is pushing and pulling correctly
//read all data from databases && set data received as parameter for front end
router.get("/", redirectToLogin, (req, res) => {
    db.any("SELECT users.user_id,firstname,lastname,email,schedules.schedule_id,day,TO_CHAR(start_at, 'HH12:MI AM') start_at,TO_CHAR(end_at, 'HH12:MI AM') end_at FROM users INNER JOIN schedules ON users.user_id = schedules.user_id")
        .then(function(databaseschedules) {

          // Converting numbers into days of the week
          convertNumbersToDays(databaseschedules);
            // console.log(databaseschedules)
            res.render('pages/schedules', {
                schedules:databaseschedules
              });
        })
        .catch((error) => {
            console.log(error);
            res.render('pages/404error', { error });
        });
    });


router.post('/', redirectToLogin, (req, res) => {

    // const id = req.session.userId
    const id = req.session.userId;
    const {day, start_at, end_at} = req.body;

    // creating function to convert time into minutes
    const timeConversion = (time) => Number(time.split(':')[0] * 60) + Number(time.split(':')[1]);

    const startTimeConverted = timeConversion(start_at);
    const endTimeConverted = timeConversion(end_at);

    // Set up a condition to make sure end time is always after start time
    if (!day || !start_at || !end_at) {
      req.flash("error", "Please fill all the fields");
      res.redirect('/schedules/newschedule');
    } else if (endTimeConverted <= startTimeConverted) {
      req.flash("error", "End time should be after Start time");
      res.redirect('/schedules/newschedule');
    } else {
        // If we reach here means the validation has passed

        // get existing schedules of the user from bd to compare the times
      db.any("SELECT TO_CHAR(start_at, 'HH24:MI') start_at,TO_CHAR(end_at, 'HH24:MI') end_at,day FROM schedules WHERE user_id = $1;", id)
      .then((times) => {

        // looking for overlap within the array returned from db
        const overlap = times.some((time) => {

          // Converted db times into minutes as well
          const startTimeFromDatabaseConverted = timeConversion(time.start_at);
          const endTimeFromDatabaseConverted = timeConversion(time.end_at);

          // conditions when the time overlaps
          return (time.day === Number(day) && startTimeConverted <= startTimeFromDatabaseConverted && endTimeConverted >= startTimeFromDatabaseConverted) || (time.day === Number(day) && startTimeConverted >= startTimeFromDatabaseConverted && startTimeConverted < endTimeFromDatabaseConverted)
        });

        if (overlap) {
          req.flash("error", "There is an overlap with your previous schedules.");
          res.redirect('/schedules/newschedule')
        } else {
          db.none('INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4);', [id, day, start_at, end_at])
          .then(() => {
            req.flash("success_msg", "New schedule has been added");
            res.redirect('/')
          })
          .catch(error => {
            console.log(error)
          })
        }
      })
      .catch(error => {
        console.log(error);
        res.render('pages/404error', { error });
      })
    }
    
  })

  router.get('/newschedule', redirectToLogin, (req, res) => {
    res.render('pages/newschedule')
  });  


  router.get("/:id",  redirectToLogin, (req, res) => {
    db.any("SELECT users.user_id,firstname,lastname,day,TO_CHAR(start_at, 'HH12:MI AM') start_at,TO_CHAR(end_at, 'HH12:MI AM') end_at FROM users INNER JOIN schedules ON users.user_id = schedules.user_id WHERE schedules.user_id = $1;", req.params.id)
    .then((schedules) => {
      const userName = schedules[0].firstname + ' ' + schedules[0].lastname

      // converting numbers into days of the week
      convertNumbersToDays(schedules);
      res.render('pages/schedulesid', { schedules, userName })
    })
    .catch(error => {
      console.log(error);
      res.render('pages/404error', { error });
    })
})


// Function to convert numbers to days
const convertNumbersToDays = (schedules) => {
  schedules.forEach((schedule) => {
    const week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      for (let i = 1; i <= 7; i++) {
          if (i == schedule.day) {
              schedule.day = week[i - 1];
          };
      };   
  })
}




module.exports = router;

