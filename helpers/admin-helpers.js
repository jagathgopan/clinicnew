const { response } = require('express')
const collection = require('../config/collection')
var db = require('../config/connection')
/* var collection = require('../config/collections') */
/* const bcrypt = require('bcrypt'); */
/* const { reject, resolve } = require('promise');*/
var objectId = require('mongodb').ObjectId
module.exports = {

    adminLogin: (details) => {
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ name: details.name })
            if (admin) {
                if (details.password == admin.password) {
                    response.admin = admin
                    response.status = true
                    resolve(response)
                } else {
                    resolve({ status: false })
                }
            } else {
                resolve({ status: false })
            }
        })

    },
    addDoctor: (doctors) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DOCTORS_COLLECTION).insertOne(doctors).then((data) => {
                resolve(data.ops[0]._id)
            })

        })

    },
    addPatient: (patients) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PATIENTS_COLLECTION).insertOne(patients).then((data) => {
                resolve(data.ops[0]._id)
            })

        })

    },
    getAllDoctors: () => {
        return new Promise(async (resolve, reject) => {
            let doctors = await db.get().collection(collection.DOCTORS_COLLECTION).find({status:'false'}).toArray()
            resolve(doctors)
        })

    },
    getAllPatients: () => {
        return new Promise(async (resolve, reject) => {
            let patients = await db.get().collection(collection.PATIENTS_COLLECTION).find().toArray()
            resolve(patients)
        })

    },
    getDoctorDetails: (docId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DOCTORS_COLLECTION).findOne({ _id: objectId(docId) }).then((doctorDetails) => {
                resolve(doctorDetails)
                console.log(doctorDetails);
            })
        })
    },
    getPatientDetails: (patId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PATIENTS_COLLECTION).findOne({ _id: objectId(patId) }).then((patientDetails) => {
                resolve(patientDetails)
                console.log(patientDetails);
            })
        })
    },
    updateDoctor: (docId, docDetails) => {
        /* docDetails.Price=parseInt(prodDetails.Price) */
        return new Promise((resolve, reject) => {
            db.get().collection(collection.DOCTORS_COLLECTION)
                .updateOne({ _id: objectId(docId) }, {
                    $set: {
                        doctorName: docDetails.doctorName,
                        specialised: docDetails.specialised,
                        speciality: docDetails.speciality,
                        accountStatus: docDetails.accountStatus
                    }

                }).then((response) => {
                    resolve()
                })
        })
    },

    updatePatient: (patId, patDetails) => {
        /* docDetails.Price=parseInt(prodDetails.Price) */
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PATIENTS_COLLECTION)
                .updateOne({ _id: objectId(patId) }, {
                    $set: {
                        patientName: patDetails.patientName,
                        age: patDetails.age,
                        mobileNo: patDetails.mobileNo,
                        accountStatusPatient: patDetails.accountStatusPatient
                    }

                }).then((response) => {
                    resolve()
                })
        })
    },
    changeStatusDelete: (docId) => {
        return new Promise(async (resolve, reject) => {
            let doctors = await db.get().collection(collection.DOCTORS_COLLECTION).find().toArray()
            db.get().collection(collection.DOCTORS_COLLECTION).updateOne({ _id: objectId(docId) }, { $set: { status:'false'} })
            console.log(doctors);
            resolve()
        })

    }

}

