/**
 * Created by harika on 12/12/17.
 */
'use strict'

const BaseController = require('../controllers/BaseController')

const studentDetails = require('../models/studentDetailsModel')

class studentDetail extends BaseController {
  constructor () {
    super(studentDetails, 'studentDetails')
  }
}

module.exports = new studentDetail()
