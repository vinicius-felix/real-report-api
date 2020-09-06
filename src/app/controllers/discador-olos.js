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

			console.clear();
		
			const urlBrow = 'http://192.168.200.250/Olos/Login.aspx';
		
			const browser = await puppeteer.launch();
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.type('input[id="User"]',process.env.DISCADOR_OLOS_USERNAME);
			await page.type('#Password', process.env.DISCADOR_OLOS_PASSWORD);
		
			const selector = 'input[id="Button1"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector); 
		
			await page.waitForNavigation();
		
			const selectorBill = 'a[id="ctl00_TopMenu_Billing"]';
			await page.evaluate((selectorBillas) => document.querySelector(selectorBillas).click(), selectorBill);
		
			await page.waitForNavigation();
		
			await page.goto(
				'http://192.168.200.250/billing/reports/hour_report.aspx' + 
				'?nivel=1&StartDate=' + getCurrentDate().toString() + '&EndDate=' + getCurrentDate().toString() + '&RatePlanId=&RatePlan=' + 
				'&CampaignId=&AgentId=&Agent=&greater_4seconds=Y&companyId=&company=&mailing=' + 
				'&city=&cnl=&state=&DispositionId=&Disposition=&dispositionType=&addCampaignId=-1'
			);
			
			let query = await page.evaluate(() => {
				return document.querySelector('div[id="PageContent_tabela1_resultado"]').innerText;
			});
		
			query = query.split('\n');
		
			let hora = [], custo = []
		
			for(let i=0; i<query.length; i++){ 
				hora.push(query[i].split('\t'))
			}
		
			for(let i = 2; i < hora.length-1; i++){
				custo.push( hora[i][hora[i].length-1] );    
			}
			
			while(custo.length < 14){
				custo.push('0,00');
			}

			res.status(200).send({ custo });
			await browser.close();
		
		})();
		
  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/discador-olos', router);