const express = require('express');
const router = express.Router();
const db = require('../database');

//notes to self to test if github is pushing and pulling correctly
//read all data from databases && set data received as parameter for front end
router.get("/", (req, res) => {
    db.any('SELECT users.user_id,firstname,lastname,email,schedules.user_id,day,start_at,end_at FROM users INNER JOIN schedules ON users.user_id = schedules.user_id')
        .then(function(databaseschedules) {
            console.log(databaseschedules)
            res.render('pages/schedules', {
                schedules:databaseschedules
              });
        })
        
        .catch(function(error) {
            console.log(error)
        });
    });
    
//     router.get('/', (req, res) => {
//         res.render('pages/home');
// })


router.post('/', (req, res) => {
    console.log(req.body)
    // const id = req.session.userId
    req.body.user_id = req.session.userId
    db.none('INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4);', [req.body.user_id, req.body.day, req.body.start_at, req.body.end_at])
    .then(() => {
      res.redirect('/')
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
  })

  router.get('/newschedule', (req, res) => {
    res.render('pages/newschedule')
  });  

  router.get("/:id", (req, res) => {
    db.any('SELECT user_id,day,start_at,end_at FROM schedules WHERE schedules.user_id = $1;', req.params.id)
    .then((schedules) => {
      res.render('pages/schedulesid', {
        schedules 
      })
    })
    .catch(error => {
      console.log(error)
      res.send(error)
    })
})



module.exports = router;

