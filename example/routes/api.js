const express = require('express')
const router = express.Router()
const loggingService = require('../service/logging_service')
const studentDetailsController = require('../controllers/studentDetailsController')



router.get('/getstudentDetails/:email', function ( req, res) {
  let email = req.params.email
  studentDetailsController.find({email: email}, function (err, result) {
    if (err) throw err
    if (result.length > 0) {
      res.json({
        confirmation: 'Success',
        response: result
      })
    } else {
    
      res.json({
        confirmation: 'Failed',
        message: 'Nothong Found'
      })
    }
  })
})

router.post('/submitstudentDetails', function ( req, res) {
let email = req.body.email
studentDetailsController.find({email: email}, function (err, result) {
    if (err) throw err
    if (result.length > 0) {
      studentDetailsController.update(result[0].id, req.body, function (err, updateresult) {
        if (err) throw err
  
        res.json({
          confirmation: 'Success',
          response: updateresult
        })
      })
    } else {
      studentDetailsController.create(req.body, function (err, response) {
        if (err) throw err
        else {
          loggingService.info('Created')
          res.json({
            confirmation: 'Success',
            message: response
          })
        }
      })
    }
  }) 
})

module.exports = router
