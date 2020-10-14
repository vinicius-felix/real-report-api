require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

getCurrentDate = () => {
  let fullDate = new Date();
  let dd = String(fullDate.getDate()).padStart(2, '0');
  let mm = String(fullDate.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = fullDate.getFullYear();

  fullDate = dd + '/' + mm + '/' + yyyy;

  return fullDate;
}

router.get('/', async(req, res) => {
	try{

		(async () => {

			const urlBrow = 'http://192.168.220.10';
		
			const browser = await puppeteer.launch({ headless: true, args: ['--disable-dev-shm-usage'] });
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.setViewport({ width: 1366, height: 768});
		
			await page.type('#inputEmail', process.env.DISCADOR_AMBIENTE1_USERNAME);  
			await page.type('#password', process.env.DISCADOR_AMBIENTE1_PASSWORD);
		
			const selector = 'button[class="btn btn-lg btn-primary btn-block"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector); 

			await page.waitForNavigation();
			
			await page.goto(
				'http://192.168.220.10/quality_report/quality_report_info?' + 
				'call_queue%5Bid%5D=58&finish_at=2020-09-29+17%3A34%3A19+-0300&start_at=2020-09-29+17%3A34%3A19+-0300'
			);

			let tfoot = await page.evaluate(() => {
		    let tables = [...document.querySelectorAll('tfoot')];
		    return tables.map((table) => table.textContent.trim());
		  });

			tfoot = tfoot[1].innerText.split('\t').join('').split('\n')

			console.log(tfoot)

			let res// = tfoot[1].innerText.split('\n').join('').split('\n');

			let final = [];

			console.log('res', res[1]);

			res.status(200).send({ custo });
			await browser.close();
		
		})();
		
  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/callback-eavm', router);