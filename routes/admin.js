var express = require('express');
var router = express.Router();
const adminHelpers = require('../helpers/admin-helpers');

/* GET users listing. */
router.get('/', function (req, res) {
  if (req.session.loggedIn) {
    res.redirect('admin/tabview')
  } else {

    res.render('admin/adminLogin', { 'loginErr': req.session.loginErr });
    req.session.loginErr = false
  }

});
router.post('/admin-login', (req, res) => {

  adminHelpers.adminLogin(req.body).then((response) => {
    if (response.status) {
      req.session.loggedIn = true
      req.session.admin = response.admin
      adminHelpers.getAllDoctors().then((doctors) => {
        adminHelpers.getAllPatients().then((patients) => {
          let admin = req.session.admin
          console.log(admin);
          res.render('admin/tabview', { doctors, admin, patients });
        })
      })
    } else {
      console.log("invalid password or userId");
      req.session.loginErr = true
      res.redirect('/admin')
    }
  })
})
router.get('/tab-view', (req, res) => {
  if (req.session.loggedIn) {
    let admin = req.session.admin
    adminHelpers.getAllDoctors().then((doctors) => {
      adminHelpers.getAllPatients().then((patients) => {
        res.render('admin/tabview', { doctors, admin, patients });
      })

    })
  }
})
router.get('/add-doctor', (req, res) => {
  let admin = req.session.admin
  res.render('admin/addDoctor', { admin });
})
router.post('/add-doctor', (req, res) => {
  console.log(req.body);
  adminHelpers.addDoctor(req.body).then((id) => {
    let image = req.files.Image
    console.log(id)
    image.mv('./public/doctors-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/addDoctor')
      } else {
        console.log(err)
      }
      res.render('admin/addDoctor')
    })


  })
})
router.get('/logout', (req, res) => {
  req.session.destroy()
  console.log("session destroyed");
  res.redirect('/admin')
})
router.get('/delete-doctor/:id',async (req, res) => {
  let docId = req.params.id
 await adminHelpers.changeStatusDelete(docId).then(() => {
  let admin = req.session.admin
 adminHelpers.getAllDoctors().then((doctors) => {
      adminHelpers.getAllPatients().then((patients) => {
        res.render('admin/tabview', { doctors,admin, patients });
      })

    })
  })
})
router.get('/delete-patient/:id',async (req, res) => {
  let patId = req.params.id
 await adminHelpers.changeStatusDeletePatient(patId).then(() => {
  let admin = req.session.admin
 adminHelpers.getAllDoctors().then((doctors) => {
      adminHelpers.getAllPatients().then((patients) => {
        res.render('admin/tabview', { doctors,admin, patients });
      })

    })
  })


})
router.get('/edit-doctor/:id', async (req, res) => {
  let doctor = await adminHelpers.getDoctorDetails(req.params.id)
  res.render('admin/editDoctor', { doctor })
})
router.get('/add-patient', (req, res) => {
  let admin = req.session.admin
  res.render('admin/addPatient', { admin });
})
router.post('/add-patient', (req, res) => {
  console.log(req.body);
  adminHelpers.addPatient(req.body).then((id) => {
    let image = req.files.Image
    console.log(id)
    image.mv('./public/patients-images/' + id + '.jpg', (err, done) => {
      if (!err) {
        res.render('admin/addPatient')
      } else {
        console.log(err)
      }
      res.render('admin/addPatient')
    })


  })
})
router.post('/edit-doctor/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  adminHelpers.updateDoctor(req.params.id, req.body).then(() => {
    res.render('admin/editDoctor')
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/doctors-images/' + id + '.jpg')
    }
  })
})

router.get('/edit-patient/:id', async (req, res) => {
  let patient = await adminHelpers.getPatientDetails(req.params.id)
  res.render('admin/editPatient', { patient })
})
router.post('/edit-patient/:id', (req, res) => {
  console.log(req.params.id);
  let id = req.params.id
  adminHelpers.updatePatient(req.params.id, req.body).then(() => {
    res.render('admin/editPatient')
    if (req.files.Image) {
      let image = req.files.Image
      image.mv('./public/patients-images/' + id + '.jpg')
    }
  })
})


module.exports = router;
