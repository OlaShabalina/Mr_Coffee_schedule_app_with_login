const express = require('express');
const router = express.Router();
const db = require('../database');


router.get('/', (req, res) => {
    res.render('pages/schedules');
})

// router.get('/:id', (req, res) => {
//     res.render();
// })


module.exports = router;