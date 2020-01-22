'use strict'

var router = require('express').Router()
var User = require('../models/user-model')

router.post('/', (req, res) => {
  var username = req.body.username
  var password = req.body.password

  // if all fields entered
  if (username && password) {
    User.findOne({ username: username, password: password }, function (err, data) {
      if (err) {
        console.log(err)
        res.status(500)
        return
      }
      // username exists
      if (data) {
        req.session.isLoggedIn = true
        req.session.username = username
        res.status(200)
        res.redirect('profile')
      } else { // wrong username or password
        res.status(400)
        res.redirect('/')
      }
    })
  } else { // if missing fields
    res.status(400)
    res.redirect('/')
  }
})

// login auth route
router.get('/login', (req, res) => {
  res.render('login', { user: req.user })
})

// logout auth route
router.get('/logout', (req, res) => {
  req.session.isLoggedIn = false
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
    } else {
      console.log('Successfully logged out !')
      res.status(200)
      res.redirect('/')
    }
  })
})

module.exports = router
