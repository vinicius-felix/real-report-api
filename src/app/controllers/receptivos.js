const express = require('express');
const Receptivos = require('../models/Receptivos');
const router = express.Router();

// Exibir todos os registros
router.get('/', async(req, res) => {
  try{
    const receptivos = await Receptivos.find();
    return res.send({ receptivos })
  } catch(err){
    return res.status(400).send({ error: 'Erro ao listar receptivos: ' + err })
  }
});

// Exibir somente um registro
router.get('/exibir/:receptivoId', async (req, res) => {
  try {
    const receptivo = await Receptivos.findById(req.params.receptivoId);
    return res.send({ receptivo });
  } catch (err) {
    return res.status(400).send({ error: 'Erro ao exibir receptivo: ' + err })
  };
});

// Cadastrar novo receptivos
router.post('/registrar', async(req, res) => {
  try {    
    const receptivos = await Receptivos.create(req.body);
    return res.send({ receptivos });
  } catch(err) {
    return res.status(400).send({ error: 'Erro ao registrar novo receptivo! ' + err});
  }
});

// Atualizar registro existente
router.put('/atualiza/:receptivoId', async (req, res) => {
  try {
    const {description} = req.body;
    const receptivo = await Receptivos.findByIdAndUpdate(req.params.receptivoId, { description });
    return res.send({ receptivo });
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel atualizar o receptivo! ' + err });
  }
});

// Apagar registro existente
router.delete('/apagar/:receptivoId', async (req, res) => {
  try {
    const receptivo = await Receptivos.findByIdAndRemove(req.params.receptivoId);
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel apagar o receptivo! ' + err })
  }
});

module.exports = app => app.use('/receptivos', router);