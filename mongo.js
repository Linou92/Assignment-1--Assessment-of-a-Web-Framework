var mongoose = require('mongoose')
var config = require('./configs/keys')

module.exports = () => {
  mongoose.connect(config.mongodb.dbURL)
  require('./models/user-model')
}
