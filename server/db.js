const mongoose = require('mongoose');
const { MONGODB_URI: url } = require('./utils/config');


    mongoose.connect(url || 'mongodb://localhost:27017/mtg', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });


module.exports = mongoose.connection;
