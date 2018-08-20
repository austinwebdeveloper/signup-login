'use strict';
var g = require('../../../loopback/lib/globalize');
var isEmail = require('isemail');
var loopback = require('../../../loopback/lib/loopback');
var utils = require('../../../loopback/lib/utils');
var path = require('path');
var qs = require('querystring');
var SALT_WORK_FACTOR = 10;
var crypto = require('crypto');
// bcrypt's max length is 72 bytes;
// See https://github.com/kelektiv/node.bcrypt.js/blob/45f498ef6dc6e8234e58e07834ce06a50ff16352/src/node_blf.h#L59
var modelName = path.basename(__filename, path.extname(__filename))
var MAX_PASSWORD_LENGTH = 72;
var bcrypt;
try {
  // Try the native module first
  bcrypt = require('bcrypt');
  // Browserify returns an empty object
  if (bcrypt && typeof bcrypt.compare !== 'function') {
    bcrypt = require('bcryptjs');
  }
} catch (err) {
  // Fall back to pure JS impl
  bcrypt = require('bcryptjs');
}

var DEFAULT_TTL = 1209600; // 2 weeks in seconds
var DEFAULT_RESET_PW_TTL = 15 * 60; // 15 mins in seconds
var DEFAULT_MAX_TTL = 31556926; // 1 year in seconds
var assert = require('assert');

var debug = require('debug')('loopback:user');
module.exports = function(User) {
    User.signup = function(credentials, fn) { 
        credentials.email = credentials.email.toLowerCase(); 
        fn = fn || utils.createPromiseCallback();
        User.find({where: {email: credentials.email}}, function(err, fetchresult) {
            if(err)
            {
                var defaultError = new Error(g.f(err.message));
              defaultError.statusCode = 400;
              defaultError.code = 'BAD_REQUEST';
              fn(defaultError);
            }
            else
            {
                if(fetchresult.length >0)
                {
                    var defaultError = new Error(g.f("Email ALready exists"));
              defaultError.statusCode = 400;
              defaultError.code = 'BAD_REQUEST';
              fn(defaultError);
           
        }
        else{
            User.create(credentials, function(err, result) { 
                if(err)
                    {
                   var defaultError = new Error(g.f(err.message));
                   defaultError.statusCode = 400;
                   defaultError.code = 'BAD_REQUEST';
                   fn(defaultError);
              
                       }
                  else
                    {  
                     fn(err, result);          
     
                    }
                 })
        }
        }
        
            return fn.promise;
         })
        }


    User.normalizeCredentials = function(credentials, realmRequired, realmDelimiter) {
        var query = {};
        credentials = credentials || {};
        if (!realmRequired) {
          if (credentials.email) {
            query.email = credentials.email.toLowerCase();
          } else if (credentials.username) {
            query.username = credentials.username;
          }
        } else {
          if (credentials.realm) {
            query.realm = credentials.realm;
          }
          var parts;
          if (credentials.email) {
            parts = splitPrincipal(credentials.email, realmDelimiter);
            query.email = parts[1];
            if (parts[0]) {
              query.realm = parts[0];
            }
          } else if (credentials.username) {
            parts = splitPrincipal(credentials.username, realmDelimiter);
            query.username = parts[1];
            if (parts[0]) {
              query.realm = parts[0];
            }
          }
        }
        return query;
      };
    


  /**
   *
   * @param {object} data
   * @param {Function(Error, object)} callback
   */
 /* User.login = function (credentials, include, callback) {
    // Invoke the default login function
    User.find({where: {and: [{email: credentials.email }, {username: 'svl'}]}},
      function (err, posts) {
      console.log(posts)
     callback(null, posts)
      });
  };
  */
  User.login = function(credentials, include, fn) {
    var self = this;
    if (typeof include === 'function') {
      fn = include;
      include = undefined;
    }

    fn = fn || utils.createPromiseCallback();

    include = (include || '');
    if (Array.isArray(include)) {
      include = include.map(function(val) {
        return val.toLowerCase();
      });
    } else {
      include = include.toLowerCase();
    }

    var realmDelimiter;
    // Check if realm is required
    var realmRequired = !!(self.settings.realmRequired ||
      self.settings.realmDelimiter);
    if (realmRequired) {
      realmDelimiter = self.settings.realmDelimiter;
    }
    var query = self.normalizeCredentials(credentials, realmRequired,
      realmDelimiter);

    if (realmRequired && !query.realm) {
      var err1 = new Error(g.f('{{realm}} is required'));
      err1.statusCode = 400;
      err1.code = 'REALM_REQUIRED';
      fn(err1);
      return fn.promise;
    }
    if (!query.email && !query.username) {
      var err2 = new Error(g.f('{{username}} or {{email}} is required'));
      err2.statusCode = 400;
      err2.code = 'USERNAME_EMAIL_REQUIRED';
      fn(err2);
      return fn.promise;
    }

    self.findOne({where: query}, function(err, user) {
        var defaultError = new Error(g.f('login failed'));
      defaultError.statusCode = 401;
      defaultError.code = 'LOGIN_FAILED';

      function tokenHandler(err, token) {
        if (err) return fn(err);
        if (Array.isArray(include) ? include.indexOf('user') !== -1 : include === 'user') {
          // NOTE(bajtos) We can't set token.user here:
          //  1. token.user already exists, it's a function injected by
          //     "AccessToken belongsTo User" relation
          //  2. ModelBaseClass.toJSON() ignores own properties, thus
          //     the value won't be included in the HTTP response
          // See also loopback#161 and loopback#162
          token.__data.user = user;
        }
        fn(err, token);
      }

      if (err) {
        debug('An error is reported from User.findOne: %j', err);
        fn(defaultError);
      } else if (user) {
        user.hasPassword(credentials.password, function(err, isMatch) {
          if (err) {
            debug('An error is reported from User.hasPassword: %j', err);
            fn(defaultError);
          } else if (isMatch) {
            if (self.settings.emailVerificationRequired && !user.emailVerified) {
              // Fail to log in if email verification is not done yet
              debug('User email has not been verified');
              err = new Error(g.f('login failed as the email has not been verified'));
              err.statusCode = 401;
              err.code = 'LOGIN_FAILED_EMAIL_NOT_VERIFIED';
              err.details = {
                userId: user.id,
              };
              fn(err);
            } else {
              if (user.createAccessToken.length === 2) {
                user.createAccessToken(credentials.ttl, tokenHandler);

              } else {
                user.createAccessToken(credentials.ttl, credentials, tokenHandler);
              }
            }
          } else {
            debug('The password is invalid for user %s', query.email);
            fn(defaultError);
          }
        });
      } else {
        debug('No matching record is found for user %s', query.email );
        fn(defaultError);
      }
    });
    return fn.promise;
  };


  User.remoteMethod('signup',{
    "accepts": [{"arg":"credentials","type":modelName,"description":"User credentials","required":true,"http":{"source":"body"}}],
"returns": [
  {
    "arg": "response",
    "type": modelName,
    "root": true,
    "description": ""
  }
],
"description":" Create a new instance of the "+modelName+" and persist it into the data source",
"http": [
  {
    "path": "/",
    "verb": "post"
  }
]
});
};
