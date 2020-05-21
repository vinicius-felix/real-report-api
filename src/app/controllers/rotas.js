const express = require('express');
const Rotas = require('../models/Rotas');
const router = express.Router();

router.get('/', async(req, res) => {
  res.send(console.log('Rotas', res.body));
});

router.post('/registrar', async(req, res) => {
  try {
    console.log(req.body)
    const rotas = await Rotas.create(req.body);
    return res.send({ rotas });
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao registrar nova rota!', err});
  }
});

module.exports = app => app.use('/rotas', router);