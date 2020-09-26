require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			console.log('Acessando URAs');
		
			let data, custo = [];

			const browser = await puppeteer.launch({ args: [ '--ignore-certificate-errors', '--disable-dev-shm-usage' ] });

				let page = await browser.newPage();

				await page.goto('http://192.168.170.21:8080/rj/login.html', { timeout: 0 });
		
				await page.type('#username', process.env.JSI_URAS_USERNAME);
				await page.type('#password', process.env.JSI_URAS_PASSWORD);
			
				await page.click('#loginButton');
		
				await page.waitForNavigation();
				
				await page.goto('http://192.168.170.21:8080/rj/custos-ura.html');
			
			for(let i = 7; i < 21; i++){
				
				const selector_i = 'i[class="ft-plus"]';
				await page.evaluate((selector_i) => document.querySelector(selector_i).click(), selector_i); 
		
				await page.type('#horas', i.toString());
		
				const selector = 'button[class="btn btn-primary"]';
				await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
		
				await page.waitForSelector('div[class="card-content"]');
				
				data = await page.evaluate(() => {
					return document.querySelector('div[class="card-content"]').innerText;
				});
		
				data = data.split('\n');
		
				if(data.length >= 15){
					custo.push(data[12].split('R$').join('').trim());
				} else {
					custo.push('0,00');
				}//if-else

				await page.evaluate(() => ( document.querySelector('input[name="horas"]').value = '' ));
				
			}//for

			await page.close();
			await browser.close();
			res.status(200).send({ custo });
		
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/uras', router);