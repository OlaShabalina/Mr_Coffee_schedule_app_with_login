const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
    res.send('check')
})


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
  

module.exports = router;

//Adding new comment here as placeholder

// router.get('/:id', (req, res) => {
//     res.render();
// })

