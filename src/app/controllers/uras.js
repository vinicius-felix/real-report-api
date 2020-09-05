require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			const browser = await puppeteer.launch({ headless: true });
		
			let data, custo = [];
			
			for(let i = 7; i < 21; i++){

				let page = await browser.newPage();

				console.log('Logando')

				await page.goto('http://192.168.170.21:8080/rj/login.html', { timeout: 0 });
		
				await page.type('#username', process.env.JSI_URAS_USERNAME);
				await page.type('#password', process.env.JSI_URAS_PASSWORD);
			
				await page.click('#loginButton');
		
				await page.waitForNavigation();
				
				console.log('Logado')

				await page.goto('http://192.168.170.21:8080/rj/custos-ura.html');
		
				const selector_i = 'i[class="ft-plus"]';
				await page.evaluate((selector_i) => document.querySelector(selector_i).click(), selector_i); 
		
				await page.type('#horas', i.toString());
		
				const selector = 'button[class="btn btn-primary"]';
				await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
		
				//await page.waitForNavigation();
				await page.waitForSelector('div[class="card-content"]');
				
				console.log('buscando dados')

				data = await page.evaluate(() => {
					return document.querySelector('div[class="card-content"]').innerText;
				});
		
				data = data.split('\n');
		
				if(data.length >= 15){
					custo.push(data[12].split('R$').join('').trim());
				} else {
					custo.push('0,00');
				}//if-else

				console.log('finalizado')
				console.log('cust', custo)
				await page.close();
				
			}//for
		
			res.status(200).send({ custo });
			await browser.close();
		
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/uras', router);