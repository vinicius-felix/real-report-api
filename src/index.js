const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.get('/', (req, res) => {
  res.send(
  	'Status: <span style="color: green;"><b>ONLINE</b></span>.'
  	+ '<br><br><b>Funções</b>'  	
  	+ '<ul>/discador-ambiente/ip_ambiente/hora_inicial/hora_final</ul>'
  	+ '<ul><ul>Exemplo:'
  	+ '<ul>192.168.9.162/discador-ambiente/192.168.220.10/7/8</ul></ul></ul>'
  	+ '<ul><br>/discador-olos</ul>'
  	+ '<ul><br>/uras-2/hora_inicial</ul>'
  	+ '<ul><br>/av-tentec</ul>'
  	+ '<ul><br>/av-ypy</ul>'
  	);
});

require('./app/controllers/index')(app);

app.listen(port);