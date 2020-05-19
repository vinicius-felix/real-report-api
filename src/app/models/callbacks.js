const mongoose = require('../../database')

const callbacksSchema = new mongoose.Schema({

  campanha: {
    type: String,
    require: true,
  },

  status: {
    type: String,
    require: true,
  },

  servidor: {
    type: Number,
    require: true,
  },

  receptivo: {
    type: String,
    require: true,
  },

  operadora: {
    type: String,
    require: true,
  },

  dac: {
    type: String,
    require: true,
  },

  cockpit: {
    type: String,
    require: true,
  },

  carteira: {
    type: String,
    require: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

});

const Callbacks = mongoose.model('Callbacks', callbacksSchema);

module.exports = Callbacks;