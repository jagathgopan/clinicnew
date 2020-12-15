var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');
const userHelpers = require('../helpers/user-helpers.js');
/* GET home page. */
router.get('/', (req, res) => {
  adminHelpers.getAllDoctors().then((doctors) => {
    let user=req.session.user
    console.log(user);
    res.render('user/userhome', { doctors,user })
  })
})
router.get('/user-login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  } else {
    res.render('user/userLogin', { 'loginErr': req.session.loginErr });
    req.session.loginErr = false
  }
})
router.get('/user-signup', (req, res) => {
  res.render('user/userSignup');
})
router.post('/user-signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
    req.session.loggedIn = true
    req.session.user = response
    res.redirect('/')
  })
})
router.post('/user-login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.user = response.user
      res.redirect('/')
    } else {
      req.session.loginErr = "Invalid username or password"
      res.redirect('login')
    }
  })

})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/book-doctor',(req,res)=>{
  if (req.session.loggedIn){
res.render('user/bookDoctor')
  }else{
    res.redirect('user/userLogin')
  }
})
module.exports = router;
