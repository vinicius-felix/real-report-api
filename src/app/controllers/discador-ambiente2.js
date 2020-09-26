require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

			console.log('Acessando amb 2');

			const urlBrow = 'http://192.168.200.83';
		
			const browser = await puppeteer.launch({ headless: true });
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.setViewport({ width: 1366, height: 768});
		
			await page.type('#inputEmail', process.env.DISCADOR_AMBIENTE2_USERNAME);  
			await page.type('#password', process.env.DISCADOR_AMBIENTE2_PASSWORD);
		
			const selector = 'button[class="btn btn-lg btn-primary btn-block"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
			
			await page.waitForNavigation();
		
			let custo = []
		
			for(let i = 7; i < 21; i++){
				await page.goto(urlBrow + '/billing_report/trunk_calls_report_form');
		
				await page.waitForSelector('#date_start_hour');
		
				await page.select('#date_start_hour', i < 10 ? ('0'+i) : i.toString());
				await page.select('#date_start_minute', '01');
		
				await page.select('#date_finish_hour', (i+1) < 10 ? ('0'+(i+1)) : (i+1).toString());
				await page.select('#date_finish_minute', '00');
		
				await page.select('#trunk_id', '');    
		
				await page.click('a[class="button_16 button_ok_16"]');
		
				await page.waitForSelector('th[class="border_bottom_radius_right');
		
				let query = await page.evaluate(() => {
					return document.querySelector('th[class="border_bottom_radius_right').innerText;
				});
		
				custo.push(query.split('R$').join('').trim());
				
			}
			
			res.status(200).send({ custo });
			await browser.close();
		
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/discador-ambiente2', router);