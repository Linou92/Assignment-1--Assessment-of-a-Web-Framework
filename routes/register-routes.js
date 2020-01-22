'use strict'

var router = require('express').Router()
var User = require('../models/user-model')

router.post('/', (req, res) => {
  var username = req.body.username
  var password = req.body.password
  var passwordConf = req.body.passwordConf

  // if same password twice
  if (password === passwordConf) {
    User.find({ username: username }, function (err, data) {
      if (err) {
        console.log(err)
        return
      }
      // user exists
      if (data.length === 1) {
        console.log('User already exists !')
        res.status(401).send('401 Not authorized ! User already exists !')
      } else { // create new user
        const user = new User({
          username: username,
          password: password,
          passwordConf: passwordConf
        })
        user.save(function (err, user) {
          if (err) return console.error(err)
          res.status(200)
          res.redirect('/')
        })
      }
    })
  } else { // if different password
    console.log('Not the same password !')
    res.status(400).send('400 Bad request ! Not the same password !')
  }
})

router.get('/', (req, res) => {
  res.render('register', { user: req.user })
})

module.exports = router
