const express = require('express');
const router = express.Router();
//const baldussi = require('../utils/baldussi');

router.get('/', async(req, res) => {
  try{
    //let r = getCostBaldussi();
    return res.send("YESSS", r);
  } catch(err){
    return res.status(400).send({ error: err })
  }
});



// const app = express();

// app.get('/baldussi', (req, res) => {
//   const bald = new Promise((resolve, reject) => {
//     baldussi.getCostBaldussi()
//       .then(data => resolve(data))
//       .catch(err => reject('Erro ao buscar na baldussi'))
//   })

//   Promise.all([bald])
//     .then(data => {
//       console.log('data', data)
//       res.status(200).send(data)
//       //res.render('index', data)
//     })
//     .catch(err => res.status(500).send(err))
// })

module.exports = app => app.use('/baldussi', router);