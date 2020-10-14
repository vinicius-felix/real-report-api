require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:horaInicial/:horaFinal', async(req, res) => {
  try{

    (async () => {

      let horaInicial = req.params.horaInicial, horaFinal = req.params.horaFinal;

      console.log(`Acessando baldussi! ${horaInicial} - ${horaFinal}`);
    
      const urlBrow = 'https://discador.baldussi.com.br/discador/index.php';
    
      const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
    
      let page = await browser.newPage();

      await page.goto(urlBrow);
      
      await page.waitForSelector('input[name="login"]');

      await page.type('input[name="login"]', process.env.DISCADOR_BALDUSSI_USERNAME);
      await page.type('input[name="senha"]', process.env.DISCADOR_BALDUSSI_PASSWORD);
      
      await page.click('input[id="login"]');

      await new Promise(resolve => setTimeout(resolve, 1500));
      
      await page.goto('https://discador.baldussi.com.br/discador/chamadas.php');

      await page.waitForSelector('input[name="horaInicial"]', { timeout: 0 });
  
      await page.evaluate(() => ( document.querySelector('input[name="horaInicial"]').value = '' ));
      await page.type('input[name="horaInicial"]', (horaInicial + ':01'));
  
      await page.evaluate(() => ( document.querySelector('input[name="horaFinal"]').value = '' ));
      await page.type('input[name="horaFinal"]', (horaFinal + ':00'));
  
      const selector = 'input[class="valida_tipo_filtro btn-gradient"]';
      await page.evaluate((selector) => document.querySelector(selector).click(), selector);
  
      await page.waitForSelector('table[class="chamadas-admin"]', { timeout: 0 });
  
      let data = await page.evaluate(() => {
        return document.querySelector('table[class="chamadas-admin"]').innerText;
      });
  
      data = data.split('\n');
      data = data[data.length-1].split('\t').join('');

      let getCost = data.substring( data.lastIndexOf("R$"), data.length );
      getCost = getCost.includes('Nenhum') ? 'R$ 0,00' : getCost;

      res.status(200).send({ custo: getCost });
      
      await browser.close();
      
    })();

  } catch(err){
    return res.status(400).send({ error: err })
  }
});

module.exports = app => app.use('/discador-baldussi-2', router);