require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
  try{
    (async () => {

      let custo = []
    
      const urlBrow = 'https://discador.baldussi.com.br/discador/index.php';
    
      const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
    
      let page = await browser.newPage();

      let logado = false;
   
      await page.goto(urlBrow);
      
      await page.waitForSelector('input[name="login"]');

      while(!logado){
        await page.type('input[name="login"]', process.env.DISCADOR_BALDUSSI_USERNAME, { delay: 50 });
        await page.type('input[name="senha"]', process.env.DISCADOR_BALDUSSI_PASSWORD, { delay: 50 });
        
        await page.click('#login');

        logado = await page.target()._isInitialized ? true : false;
      }
      
      await page.goto('https://discador.baldussi.com.br/discador/chamadas.php', { waitUntil: 'load' });
      
      for(let i = 7; i < 21; i++) {
        await page.waitForSelector('input[name="horaInicial"]', { timeout: 0 } );
    
        await page.evaluate(() => ( document.querySelector('input[name="horaInicial"]').value = '' ));
        await page.type('input[name="horaInicial"]', (i + ':01'));
    
        await page.evaluate(() => ( document.querySelector('input[name="horaFinal"]').value = '' ));
        await page.type('input[name="horaFinal"]', ((i+1) + ':00'));
    
        const selector = 'input[class="valida_tipo_filtro btn-gradient"]';
        await page.evaluate((selector) => document.querySelector(selector).click(), selector);
    
        //await page.waitForNavigation();
        await page.waitForSelector('table[class="chamadas-admin"]');
    
        let data = await page.evaluate(() => {
          return document.querySelector('table[class="chamadas-admin"]').innerText;
        });
    
        data = data.split('\n');
        data = data[data.length-1].split('\t').join('');
        
        let getCost = data.substring( data.lastIndexOf("R$"), data.length );
        getCost = getCost.includes('Nenhum') ? 'R$ 0,00' : getCost;

        //custo.push(Object.assign({ custo: getCost, hora: i + 'h até ' + (i+1) + 'h' }));
        custo.push(getCost);        
    
      }

      res.status(200).send({ custo });
      
      await browser.close();
      
    })();

  } catch(err){
    return res.status(400).send({ error: err })
  }
});


module.exports = app => app.use('/discador-baldussi', router);