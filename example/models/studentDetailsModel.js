'use strict'

const mongoose = require('mongoose')

const studentDetails = new mongoose.Schema({
  "class": { "type": "string" },
  "email": { "type": "string", "required":true},
    "marks": { "type": "number"},
    "created": { "type": "Date", "default": Date.now }
})

module.exports = mongoose.model('studentDetails', studentDetails)
