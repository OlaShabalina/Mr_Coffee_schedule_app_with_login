const express = require('express');
const router = express.Router();
const db = require('../database');

//read all data from databases && set data received as parameter for front end
router.get("/", (req, res) => {
    db.any('SELECT * FROM schedules')
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
    db.none('INSERT INTO schedules(username, day, start_at, end_at) VALUES($1, $2, $3, $4);', [req.body.username, req.body.day, req.body.start_at, req.body.end_at])
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

module.exports = router;

//Adding new comment here as placeholder

// router.get('/:id', (req, res) => {
//     res.render();

