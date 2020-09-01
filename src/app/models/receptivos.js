const mongoose = require('../../database')

const receptivosSchema = new mongoose.Schema({

  campanha: {
    type: String,
    require: true,
  },

  status: {
    type: String,
    require: true,
  },

  servidor: {
    type: String,
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
    require: false,
  },

  cockpit: {
    type: String,
    require: false,
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

const Receptivos = mongoose.model('Receptivos', receptivosSchema);

module.exports = Receptivos;