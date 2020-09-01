const mongoose = require('../../database')

const rotasSchema = new mongoose.Schema({
  
  data: {
    type: Date,
    default: Date.now,
  },

  ambiente: {
    type: String,
    required: true,
  },

  nome: {
    type: String,
    require: true,
  },

  answered: {
    type: Number,
    required: true,
  },

  failed: {
    type: Number,
    required: true,
  },

  busy: {
    type: Number,
    required: true,
  },

  no_answered: {
    type: Number,
    required: true,
  },

  answered_perc: {
    type: String,
    required: true,
  },

  failed_perc: {
    type: String,
    required: true,
  },

  busy_perc: {
    type: String,
    required: true,
  },

  no_answered_perc: {
    type: String,
    required: true,
  },

  total: {
    type: Number,
    required: true,
  },

});

const Rotas = mongoose.model('Rotas', rotasSchema);

module.exports = Rotas;