require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

router.get('/:ambiente/:horaInicial/:horaFinal', async(req, res) => {
	try{

		(async () => {

			const urlBrow = 'http://' + req.params.ambiente, horaInicial = req.params.horaInicial, horaFinal = req.params.horaFinal

			console.log('Acessando', req.params.ambiente);
		
			const browser = await puppeteer.launch({ headless: true });
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.setViewport({ width: 1366, height: 768});
		
			await page.type('#inputEmail', process.env.DISCADOR_AMBIENTE1_USERNAME);  
			await page.type('#password', process.env.DISCADOR_AMBIENTE1_PASSWORD);
		
			const selector = 'button[class="btn btn-lg btn-primary btn-block"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
			
			await page.waitForNavigation();
		
				await page.goto(urlBrow + '/billing_report/trunk_calls_report_form');
		
				await page.waitForSelector('#date_start_hour');
		
				await page.select('#date_start_hour', horaInicial < 10 ? ('0'+horaInicial) : horaInicial.toString());
				await page.select('#date_start_minute', '01');
		
				await page.select('#date_finish_hour', horaFinal < 10 ? ('0'+horaFinal) : (horaFinal).toString());
				await page.select('#date_finish_minute', '00');
		
				await page.select('#trunk_id', '');    
		
				await page.click('a[class="button_16 button_ok_16"]');
		
				await page.waitForSelector('th[class="border_bottom_radius_right', );
		
				let query = await page.evaluate(() => {
					return document.querySelector('th[class="border_bottom_radius_right').innerText;
				});
				
				await browser.close();
				let custo = query.split('R$').join('').trim();
				res.status(200).send({ custo });
		
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/discador-ambiente', router);