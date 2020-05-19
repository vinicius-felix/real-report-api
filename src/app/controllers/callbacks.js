const express = require('express');
const Callbacks = require('../models/Callbacks');
const router = express.Router();

// Exibir todos os registros
router.get('/', async(req, res) => {
  try{
    const callbacks = await Callbacks.find();
    return res.send({ callbacks })
  } catch(err){
    return res.status(400).send({ error: 'Erro ao listar callbacks: ' + err })
  }
});

// Cadastrar novo callback
router.post('/registrar', async(req, res) => {
  try {    
    const callbacks = await Callbacks.create(req.body);
    return res.send({ callbacks });
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao registrar novo callback!'});
  }
});

// Atualizar registro existente
router.put('/atualiza/:callbackId', async (req, res) => {
  try {
    const {description} = req.body;
    const callback = await Callbacks.findByIdAndUpdate(req.params.callbackId, { description });
    return res.send({ callback });
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel atualizar o callback! ' + err });
  }
});

// Apagar registro existente
router.delete('/apagar/:callbackId', async (req, res) => {
  try {
    const callback = await Callbacks.findByIdAndRemove(req.params.callbackId);
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel apagar o callback! ' + err })
  }
});

module.exports = app => app.use('/callbacks', router);