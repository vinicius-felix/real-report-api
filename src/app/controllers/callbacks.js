const express = require('express');
const Callbacks = require('../models/Callbacks');
const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const callbacks = await Callbacks.find();
    return res.send({ callbacks })
  } catch(err){
    return res.status(400).send({ error: 'Erro ao listar callbacks: ' + err })
  }
});

router.post('/registrar', async(req, res) => {
  try {    
    const callbacks = await Callbacks.create(req.body);
    return res.send({ callbacks });
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao registrar novo callback!'});
  }
});

module.exports = app => app.use('/callbacks', router);