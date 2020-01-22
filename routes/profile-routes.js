'use strict'

var keys = require('../configs/keys')
var express = require('express')
var router = express.Router()
var expressValidator = require('express-validator')
router.use(expressValidator())
var fs = require('fs')
var twit = require('twit')
const fileUpload = require('express-fileupload')

var T = new twit({
  consumer_key: keys.twitter.key,
  consumer_secret: keys.twitter.secretKey,
  access_token: keys.twitter.accessToken,
  access_token_secret: keys.twitter.secretAccessToken
})

router.use(fileUpload())
router.use(express.static(__dirname))

router.post('/', (req, res) => {
  var tweetLink = ''

  var errors = req.validationErrors()
  if (errors) {
    res.redirect('profile', { errors: errors })
  } else {
    // The name of the input field (i.e. "file") is used to retrieve the uploaded file
    let file = req.files.file
    let fileName = req.files.file.name
    let tweetText = req.body.tweetText

    // Use the mv() method to place the file somewhere on your server
    file.mv(__dirname + '/upload/' + fileName, function (err) {
      if (err) {
        return res.status(500).send(err)
      } else {
        // upload image
        var b64content = fs.readFileSync(__dirname + '/upload/' + fileName, { encoding: 'base64' })
        // post the media to Twitter
        T.post('media/upload', { media_data: b64content }, (err, data, res) => {
          if (!err) {
            var imgId = data.media_id_string
            var altText = 'some text'
            var meta_params = { media_id: imgId, alt_text: { text: altText } }
          } else {
            console.log('ERROR UPLOAD = ', err)
          }

          // reference the media and post it with the tweet
          T.post('media/metadata/create', meta_params, (err, data, res) => {
            if (!err) {
              var params = { status: tweetText, media_ids: [imgId] }
              T.post('statuses/update', params, (err, data, res) => {
                console.log('DATA = ', data)
                tweetLink = 'https://twitter.com/${data.user.screen_name}/status/${data.id_str}'
              })
            }
          })
        })
      }
    })
  }
  res.render('profile', { username: req.user, tweetLink })
})

function requiresLogin (req, res, next) {
  if (req.session && req.session.username) {
    return next()
  } else {
    res.status(403).send('403 Forbidden ! You must be logged in to access this page !')
  }
}

router.get('/', requiresLogin, (req, res) => {
  res.render('profile', { username: req.user, success: req.session.success, errors: req.session.errors })
  req.session.errors = null
})

module.exports = router
