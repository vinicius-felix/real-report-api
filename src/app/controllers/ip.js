const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');

router.get('/', async(req, res, next) => {
	try{
	const clientIp = requestIp.getClientIp(req);
	let auth = clientIp.includes('192.168.9.162') || clientIp.includes('192.168.0.101');
	next();
  	return res.status(200).send({ clientIp, auth });
  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/ip', router);