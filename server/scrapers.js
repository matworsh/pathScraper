const puppeteer = require('puppeteer')
const helpers = require('./helpers');
const classes = require('./classes')
const urlBegin = 'https://2e.aonprd.com/'



async function scrapeAll(){

}

async function scrapeAncestries(url){
  const ancestries = []
  const browser = await puppeteer.launch();
  const mainPage = await browser.newPage();
  await mainPage.goto(url);

  const $ = await helpers.cheerioPage(mainPage);

  const ancestryUrlList = [];
  $('span#ctl00_MainContent_DetailedOutput>h2>a:nth-child(2)').each((idx, link) => {
    ancestryUrlList.push(link.attribs['href']);
  });

  //get all the ancestry urls on initial page
  await helpers.asyncForEach (ancestryUrlList, async function(url, index){
      let ancestryObj = await scrapeAncestry(url, browser, new classes.Ancestry());
      ancestries.push(ancestryObj);
  });

  browser.close();

  console.log(ancestries);
  return ancestries;
}

async function scrapeAncestry(url, browser, ancestry){
    let page = await browser.newPage();
    await page.goto(urlBegin + url);
    let $ = await helpers.cheerioPage(page);
    //scrape name
    ancestry.Name = $('span#ctl00_MainContent_DetailedOutput>h1:nth-child(1)>a:nth-child(2)').text();

    //scrape traits
    let traits = $('span#ctl00_MainContent_DetailedOutput>span.trait');
    traits.each((index, trait) =>{
        ancestry.Traits.push($(trait).text())
    });
    
    //scrape description
    let general = "";
    general.each((index, desc) =>{
        ancestry.General.push($(desc).text())
    });
    //ancestry.lastScraped = new Date().toJson();
    return ancestry;
}

scrapeAncestries(urlBegin + 'Ancestries.aspx');

module.exports = {
    scrapeAll,
    scrapeAncestries,
    scrapeAncestry
} 