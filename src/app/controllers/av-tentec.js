require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			console.log('Acessando agente virtual Tentec');

		  const urlBrow = 'https://sip.tentec.com.br/painel/call_history.php';

		  const browser = await puppeteer.launch({ args: [ '--ignore-certificate-errors' ] });

		  let page = await browser.newPage();

		  await page.goto(urlBrow);
		  await page.setViewport({ width: 1100, height: 700});

		  await page.type('#login', process.env.AV_TENTEC_USERNAME);  
		  await page.type('#senha', process.env.AV_TENTEC_PASSWORD);
		  const selector = 'input[class="entrar"]';
		  await page.evaluate((selector) => document.querySelector(selector).click(), selector);

		  await page.waitForNavigation();

		  await page.goto('https://sip.tentec.com.br/painel/call_history.php');

		  await page.select('#servico', '47011172@sip.tentec.com.br');

		  await page.click('input[name="exibir_totais"]');

		  const selectorButton = 'input[name="action"]';
		  await page.evaluate((selectorButton) => document.querySelector(selectorButton).click(), selectorButton);

		  await page.waitForNavigation();

		  await page.waitForSelector('table');

		  let content = await page.evaluate(() => {
		    let tables = [...document.querySelectorAll('table')];
		    return tables.map((table) => table.textContent.trim());
		  });
		  
		  let custo = content[2].split('\n');
		  custo = Number.parseFloat(custo[custo.length-1].trim().split('R$').join('')).toFixed(2);

		  await browser.close();

		  res.status(200).send({ custo });

		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/av-tentec', router);