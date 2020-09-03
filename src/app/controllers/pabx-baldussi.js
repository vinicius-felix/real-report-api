require('dotenv').config();
const express = require('express');
const router = express.Router();
const requestIp = require('request-ip');
const puppeteer = require('puppeteer');

router.get('/', async(req, res) => {
	try{

		(async () => {

		  const urlBrow = 'http://187.60.48.201:8080/SipPulsePortal/pages/login/login.jsf';

		  const browser = await puppeteer.launch();

		  let page = await browser.newPage();

		  await page.goto(urlBrow);

		  await page.type('input[name="j_id27:login"]', process.env.PABX_BALDUSSI_USERNAME);
		  await page.type('input[name="j_id27:password"]', process.env.PABX_BALDUSSI_PASSWORD);

		  const selector = 'input[name="j_id27:j_id42"]';
		  await page.evaluate((selector) => document.querySelector(selector).click(), selector); 

		  await page.waitForNavigation();

		  await page.goto('http://187.60.48.201:8080/SipPulsePortal/pages/reports/usercall.jsf');

		  const selectorButton = 'input[name="frmCdr:j_id99"]';
		  await page.evaluate((selectorButton) => document.querySelector(selectorButton).click(), selectorButton); 

		  await page.waitForNavigation();

		  let content = await page.evaluate(() => {
		    let tables = [...document.querySelectorAll('td[class="rich-table-footercell "]')];
		    return tables.map((table) => table.textContent.trim());
		  });

		  let custo = Number.parseFloat(content[content.length-1]).toFixed(2);
		  
		  await browser.close();

		  res.status(200).send({ custo });
		  
		})();

  } catch(err) {
  	return res.status(400).send({ error: 'Erro: ' + err });
  }
});

module.exports = app => app.use('/pabx-baldussi', router);