const mongoose = require('mongoose');
const { MONGODB_URI: url } = require('./utils/config');


    mongoose.connect(url || 'mongodb://localhost/mtg', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });


module.exports = mongoose.connection;
