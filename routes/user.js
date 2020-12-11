var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
    res.render('user/userhome')
    console.log('hi i m here ');
})
router.get('/user-login', (req, res) => {
    console.log('hi i m here ');
    res.render('user/userLogin');
  })

module.exports = router;
