let express = require('express')
let router = express.Router()
const loggingService = require('../service/logging_service')
let CryptoJS = require('crypto-js')
let moment = require('moment')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Signup-login-module'})
})
module.exports = router
