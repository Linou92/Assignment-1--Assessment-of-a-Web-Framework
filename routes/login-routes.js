'use strict'

var router = require('express').Router()
var User = require('../models/user-model')
var bcrypt = require('bcryptjs')

router.post('/', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  // if all fields entered
  if (username && password) {
    User.findOne({ username: username }, (err, user) => {
      if (!user) {
        console.log('User not found !')
        res.status(404).send('User not found !')
        return err
      } else {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result === true) {
            console.log('Successfully authenticated !')
            req.session.isLoggedIn = true
            req.session.username = username
            res.status(200)
            res.redirect('profile')
          } else {
            console.log('Wrong password !')
            res.status(404).send('Wrong password !')
            return err
          }
        })
      }
    })
  } else { // missing fields
    console.log('All fields are required !')
    res.status(404).send('All fields are required !')
  }
})

router.get('/', (req, res) => {
  res.render('profile')
})

module.exports = router
