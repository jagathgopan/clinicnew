var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
/* GET home page. */
router.get('/', (req, res) => {
  adminHelpers.getAllDoctors().then((doctors) => {
    res.render('user/userhome',{doctors})
  })    
})
router.get('/user-login', (req, res) => {    
    res.render('user/userLogin');
  })
  router.get('/user-signup', (req, res) => {
    res.render('user/userSignup');
  })
module.exports = router;
