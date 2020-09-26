require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			console.clear();
		
			const urlBrow = 'https://portal.totalip.com.br/login/index';
		
			const browser = await puppeteer.launch({ headless: true });
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.type('input[id="email"]',process.env.TICKETS_USERNAME);
			await page.type('input[id="password"]', process.env.TICKETS_PASSWORD);
		
			const selector = 'button';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector);

			await page.waitForNavigation()

			let arr = await page.evaluate(() => {
				let ret = [];
				let rows = document.querySelectorAll('tr[role="row"]');
				rows.forEach((r) => ( ret.push(r.innerText) ));
				return ret;
			});
			
			let obj = {}, finalRes = [], cabecalho, texto;

			cabecalho = arr[0].toLowerCase().split('\t');
			texto = arr.slice(1, arr.length);

			texto.map((text, i) => {
				text.split('\t').map((t, j) => {
					obj[cabecalho[j]] = t;
					finalRes[i] = obj;
				}, obj = {})
			});
		
			res.status(200).send({ finalRes });
			await browser.close();
		
		})();
		
  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/tickets', router);