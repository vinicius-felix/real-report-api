require('dotenv').config();
const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

verificarBinagem = (el) => {
	if(el.innerText.toLowerCase().includes('ebs')){
		return "BINADA";
	}
	return "NÃO BINADA";
}

verificarReconhecimento = (el) => {
	if(!el.innerText.toLowerCase().includes('ebs')){
		if(el.innerText.toLowerCase().includes('kmg')){
			return "KMG";
		}
		return "AMD";
	}
}

router.get('/:ambiente', async(req, res) => {
	try{

		(async () => {	
			console.clear();
			const urlBrow = 'http://' + req.params.ambiente;

			console.log('Campanhas - Acessando', req.params.ambiente);
		
			const browser = await puppeteer.launch({ headless: true });
		
			let page = await browser.newPage();
		
			await page.goto(urlBrow);
		
			await page.setViewport({ width: 1366, height: 768});
		
			await page.type('#inputEmail', process.env.DISCADOR_AMBIENTE1_USERNAME);  
			await page.type('#password', process.env.DISCADOR_AMBIENTE1_PASSWORD);
		
			const selector = 'button[class="btn btn-lg btn-primary btn-block"]';
			await page.evaluate((selector) => document.querySelector(selector).click(), selector);

			await page.waitForNavigation();

			await page.goto(urlBrow + '/campaign/list');

			await page.waitForSelector('table[id="table_campanha"]');

			let queryAllCampaigns = await page.evaluate(() => {
				return document.querySelectorAll('[class="campaign-name-modal sorting_1"]');
			});

			// let queryAllCampaigns = await page.evaluate(() => {
			// 	let divs = [...document.querySelectorAll('[class="campaign-name-modal sorting_1"]')];
		    //    return divs.map((div) => div.textContent.length);
			// });

			//Ir para pagina de campanhas
			//Analisar campanhas ativas
			//Ir para estrategia da campanha
	
			// await page.waitForSelector('label[class="route_label personalized_checkbox checked ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"]');
	
			// let query = await page.evaluate(() => {
			// 	let divs = [...document.querySelectorAll('label[class="route_label personalized_checkbox checked ui-button ui-widget ui-state-default ui-corner-all ui-button-text-only"]')];
		    // return divs.map((div) => div.textContent.trim());
			// });
			
			// let campanha = verificarBinagem(query) + ' / ' + verificarReconhecimento(query);

			await browser.close();
			res.status(200).send(camps);
	
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/campanhas', router);