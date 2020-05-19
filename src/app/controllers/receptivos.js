const express = require('express');
const Receptivos = require('../models/Receptivos');
const router = express.Router();

router.get('/', async(req, res) => {
  try{
    const receptivos = await Receptivos.find();
    return res.send({ receptivos })
  } catch(err){
    return res.status(400).send({ error: 'Erro ao listar receptivos: ' + err })
  }
});

router.post('/registrar', async(req, res) => {
  try {    
    const receptivos = await Receptivos.create(req.body);
    return res.send({ receptivos });
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao registrar novo telefone!'});
  }
});

module.exports = app => app.use('/receptivos', router);