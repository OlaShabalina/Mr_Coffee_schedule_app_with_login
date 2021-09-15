const express = require('express');
const router = express.Router();
const db = require('../database');

//notes to self to test if github is pushing and pulling correctly
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
    const id = req.session.userId
    db.none('INSERT INTO schedules(user_id, day, start_at, end_at) VALUES($1, $2, $3, $4);', [id, req.body.day, req.body.start_at, req.body.end_at])
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

