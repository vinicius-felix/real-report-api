require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:hora', async(req, res) => {
	try{

		(async () => {

			console.log('\nAcessando URA');

			const hora = req.params.hora;
			let data, custo = [];

			const browser = await puppeteer.launch({ headless: true, args: [ '--ignore-certificate-errors', '--disable-dev-shm-usage' ] });

			let page = await browser.newPage();

			await page.goto('http://192.168.170.21:8080/rj/login.html', { timeout: 0 });
	
			await page.type('#username', process.env.JSI_URAS_USERNAME);
			await page.type('#password', process.env.JSI_URAS_PASSWORD);
		
			await page.click('#loginButton');
	
			await page.waitForNavigation();
			
			await page.goto('http://192.168.170.21:8080/rj/custos-ura.html');
			
			const selector_i = 'i[class="ft-plus"]';
			await page.evaluate((selector_i) => document.querySelector(selector_i).click(), selector_i); 

			await page.type('#horas', hora.toString());

			const selector = 'button[class="btn btn-primary"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector); 

			await page.waitForSelector('div[class="card-content"]');

			data = await page.evaluate(() => {
				return document.querySelector('div[class="col-md-4 col-sm-12"]').innerText
				.split('\n')[0]
				.split('R$')[1]
				.trim();
			});

			custo.push(data);

			await page.close();
			await browser.close();
			res.status(200).send({ custo });
		
		})();

  } catch(err) {
	await page.close();
	await browser.close();
  	return res.status(400).send({ error: 'Erro:' + err });
  }
});

module.exports = app => app.use('/uras-2', router);