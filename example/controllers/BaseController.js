/**
 * Created by harika on 12/11/17.
 */
const loggingService = require('../service/logging_service')

class BaseController {
  constructor (model, name) {
    this.model = model
    this.name = name
  }

  find (params, callback) {
    this.model.find(params, function (err, dbObjects) {
      if (err) {
        return callback(err)
      }
      // loggingService.debug(that.name + '-> find() : ' + dbObjects);
      return callback(null, dbObjects)
    })
  }

  findById (id, callback) {
    this.model.findById(id, function (err, dbObject) {
      if (err) {
        return callback(err)
      }
      // loggingService.debug(that.name + '-> findById() : ' + dbObject);
      return callback(null, dbObject)
    })
  }
  findForPaginate (perPage, page, callback) {
    this.model.find({})
      .skip((perPage * page) - perPage)
      .limit(perPage)
      .exec(function (err, dbObject) {
        if (err) {
          return callback(err)
        }
        return callback(null, dbObject)
      })
  }
  findCount (callback) {
    this.model.count().exec(function (err, count) {
      if (err) {
        return callback(err)
      }
      return callback(null, count)
    })
  }
  findone (params, callback) {
    this.model.findOne(params, function (err, dbUser) {
      if (err) {
        return callback(err)
      }
      loggingService.debug('loginSchema -> findone() : ' + dbUser)
      return callback(null, dbUser)
    })
  }
  create (params, callback) {
    this.model.create(params, function (err, dbNewObject) {
      if (err) {
        return callback(err)
      }
      // loggingService.debug(that.name + '-> create() : ' + dbNewObject);
      return callback(null, dbNewObject)
    })
  }

  update (id, params, callback) {
    this.model.findByIdAndUpdate(id, params, { new: true }, function (err, dbObject) {
      if (err) {
        return callback(err)
      }
      // loggingService.debug(that.name + '-> update() : ' + dbObject);
      return callback(null, dbObject)
    })
  }

  delete (id, callback) {
    const that = this
    this.model.findByIdAndRemove(id, function (err) {
      if (err) {
        return callback(err)
      }
      loggingService.debug(that.name + '-> delete() : ' + id)
      return callback()
    })
  }
}
module.exports = BaseController
