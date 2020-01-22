'use strict'

var mongoose = require('mongoose')
var bcrypt = require('bcryptjs')

var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    userId: String
  },
  password: {
    type: String,
    required: true
  },
  passwordConf: {
    type: String,
    required: true
  }
})

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this
  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) {
      return next(err)
    }
    user.password = hash
    next()
  })
})

// hashing a password before saving it to the database
UserSchema.pre('save', function (next) {
  var user = this
  bcrypt.hash(user.passwordConf, 10, function (err, hash) {
    if (err) {
      return next(err)
    }
    user.passwordConf = hash
    next()
  })
})

var User = mongoose.model('User', UserSchema)
module.exports = User
