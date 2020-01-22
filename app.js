const PORT = process.env.PORT || 3000
var express = require('express')
var expressValidator = require('express-validator')
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
const session = require('express-session')
var cookieParser = require('cookie-parser')
const https = require('https')
var fs = require('fs')

// importing routes
var keys = require('./configs/keys')
var authRoutes = require('./routes/auth-routes')
var registerRoutes = require('./routes/register-routes')
var profileRoutes = require('./routes/profile-routes')
var loginRoutes = require('./routes/login-routes')

var app = express()

// connect to mongodb
mongoose.connect(keys.mongodb.dbURL, () => {
  console.log('Connected to mongoose')
})
mongoose.Promise = global.Promise

// set up view engine
app.set('view engine', 'ejs')

app.use(express.static('views'))
app.use(cookieParser())

app.use(expressValidator())

// parse application/json
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// set up session cookies
app.use(session({
  secret: 'abc',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 60000 }
}))

// set up https
app.use(function (req, res, next) {
  if (req.secure) {
    next()
  } else {
    res.redirect('https://' + req.headers.host + req.url)
  }
})

app.use('/auth', authRoutes)
app.use('/register', registerRoutes)
app.use('/profile', profileRoutes)
app.use('/login', loginRoutes)

// route for the homepage
app.get('/', (req, res) => {
  res.render('home', { user: req.user })
})

// listen to port nb
/* app.listen(PORT);
console.log("App server running on port %s", PORT); */

https.createServer({
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
}, app).listen(PORT, () => {
  console.log('App server running on port %s', PORT)
})
https.createServer(app).listen(8080)

module.exports = app
