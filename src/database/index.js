const mongoose = require('mongoose');
const config = require('./db');

mongoose.connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => { 
    console.log('Database is connected.', config.DB) 
  }, err => { 
    console.log('Can not connect to the database! ' + err)
  });

module.exports = mongoose;