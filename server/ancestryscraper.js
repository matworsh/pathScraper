const {chromium} = require('playwright');
const helpers = require('./helpers');
const classes = require('./classes');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function scrapeAncestries(){
    const ancestries = []
    const browser = await chromium.launch();
    const mainPage = await browser.newPage();
    await mainPage.goto(urlBegin + '/ancestry', {
        waitUntil: 'load', 
        timeout: 0
    });
  
    const $ = await helpers.cheerioPage(mainPage);
  
    const ancestryUrlList = [];
    //get all the ancestry urls on initial page
    $('#archive-data-table > tbody > tr').each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find('td');
        const ancestry = tds[0];
        const ancestryUrl = ancestry.firstChild.attribs['href'];
        const publisher = $(tds[1]).text();
        const source = $(tds[2]).text();
        if(publisher !== 'Paizo'){
            return;
        }
        ancestryUrlList.push({url: ancestryUrl, source:source});
    })

    //fill ancestry objects from ancestry pages
    await helpers.asyncForEach (ancestryUrlList, async function(obj, index){
        let ancestryObj = await scrapeAncestry(obj.url, obj.source, browser, new classes.Ancestry());
        ancestries.push(ancestryObj);
    });
  
    browser.close();
  
    console.log(ancestries);
    return ancestries;
}

async function scrapeAncestry(url, source,  browser, ancestry){
    let page = await browser.newPage();
    await page.goto(url, {
        waitUntil: 'load', 
        timeout: 0
    });
    let $ = await helpers.cheerioPage(page);
    //scrape name
    ancestry.Name = $('article.ancestry > h1').text();

    //scrape traits
    let traits = $('article.ancestry > div.page-center > div.article-content > div.instructions > div.instructions-text');
    traits.each((index, trait) =>{
        ancestry.Traits.push($(trait).text())
    });

    let mechanicsInfo = $('article.ancestry > div.page-center > div > div.instructions > div.instructions-text');
    //scrape description
    //let generalRange = await page.$$('xpath=//*[@id="ctl00_MainContent_DetailedOutput"] >> text="You Might..." >>');
    //generalRange.filter(helpers.isText);
    //*[@id="ctl00_MainContent_DetailedOutput"]/i/text()
    //*[@id="ctl00_MainContent_DetailedOutput"]/text()[1]
    let general = $('span[id="ctl00_MainContent_DetailedOutput"]').nextUntil('h2').filter(helpers.isText);
    general.each((index, desc) =>{
        ancestry.General.push($(desc).text())
    });
    //ancestry.lastScraped = new Date().toJson();
    return ancestry;
}

//scrapeAncestries();
module.exports = {
    scrapeAncestries
} 