require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			console.log('Acessando agente virtual Ypy');

		  const urlBrow = 'https://sip.ypytecnologia.com.br/accounts/login/';

		  const browser = await puppeteer.launch();

		  let page = await browser.newPage();

		  await page.goto(urlBrow);
		  await page.setViewport({ width: 1100, height: 700});

		  await page.type('#id_username', process.env.AV_YPY_USERNAME);
		  await page.type('#id_password', process.env.AV_YPY_PASSWORD);
		  const selector = 'button[class="btn btn-ypy btn-block"]';
		  await page.evaluate((selector) => document.querySelector(selector).click(), selector);

		  await page.waitForNavigation();

		  await page.goto('https://sip.ypytecnologia.com.br/reports/cdr/');

		  await page.type('#id_source', '1103');

		  await page.click('a[class="btn btn-success"]');

		  await page.waitForSelector('table[class="table table-striped table-responsive"]', { timeout: 0 } );

		  let content = await page.evaluate(() => {
		    let divs = [...document.querySelectorAll('div[class="row"]')];
		    return divs.map((div) => div.textContent.trim());
		  });
		  
		  let custo = content[content.length-1].split('\n');
		  custo = custo[custo.length-1].trim().split(':').join('').split('R$').join('');
		  
		  await browser.close();

		  res.status(200).send({ custo });
		  
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/av-ypy', router);