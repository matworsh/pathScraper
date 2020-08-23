const {chromium} = require('playwright');
const helpers = require('./helpers');
const classes = require('./classes');
const fetch = require('node-fetch');
const zlib = require('zlib');
const cheerio = require('cheerio');
const request = require('request-promise');
//const urlBegin = 'https://pf2.d20pfsrd.com'
const urlBegin = 'https://pf2.easytool.es/tree/';

async function scrapeAll(){

}

/* async function scrapeAncestries(url){
  const ancestries = []
  const browser = await chromium.launch();
  const mainPage = await browser.newPage();
  await mainPage.goto(url, {
      waitUntil: 'load', 
      timeout: 0
  });

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
} */

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

/* async function scrapeCreatures(){
    //<span class='menu'>Zuipnyrn</span><span class='level mr-0' data-toggle='tooltip' data-placement='right' title='rare'>3</span><input type='hidden' class='id' value='5534' /></button></div>
    const creatures = []
    const browser = await chromium.launch();
    const mainPage = await browser.newPage();
    await mainPage.goto(urlBegin + '/monster', {
        waitUntil: 'load', 
        timeout: 0
    });
  
    const $ = await helpers.cheerioPage(mainPage);
  
    const creatureUrlList = [];
    //get all the creature urls on initial page
    $('#archive-data-table > tbody > tr').each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find('td');
        const creature = tds[0];
        const creatureUrl = creature.firstChild.attribs['href'];
        const publisher = $(tds[3]).text();
        //const source = $(tds[4]).text();
        if(publisher !== 'Paizo'){
            return;
        }
        creatureUrlList.push(creatureUrl);
    })

    //fill creatire objects from creature pages
    await helpers.asyncForEach (creatureUrlList, async function(url, index){
        let creatureObj = await scrapeCreature(url, browser, new classes.Creature());
        creatures.push(creatureObj);
    });
  
    browser.close();
  
    console.log(anccreaturesestries);
    return creatures;
} */

async function scrapeCreatures(){
    const creaturesFetch = await fetch("https://pf2.easytool.es/tree/loadBranches.php", {
        "headers": {
          "accept": "text/html, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "PHPSESSID=8klrol4p94kvbvoekqmfiofh40; _mode=dark"
        },
        "referrer": "https://pf2.easytool.es/tree/index.php",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "id_feature=64",
        "method": "POST",
        "mode": "cors"
      });
    
    const cratureListHtml = await creaturesFetch.text();
    const creatures = [];
    const creatureUrlSettings = [];
    const $ = await cheerio.load(cratureListHtml); // helpers.cheerioPage(mainPage);

    //get all the creature urls on initial page
    let allCreatureNames = $('span.menu').contents();
    let allCreatureIds =  $('span.level ~ input[type="hidden"].id');
    allCreatureIds.each((index, elem) => {
        creatureUrlSettings.push(
            {
                id: elem.attribs['value'], 
                name: allCreatureNames[index].data
            });
    })

 /*    $('#archive-data-table > tbody > tr').each((index, element) => {
        if (index === 0) return true;
        const tds = $(element).find('td');
        const creature = tds[0];
        const creatureUrl = creature.firstChild.attribs['href'];
        const publisher = $(tds[3]).text();
        //const source = $(tds[4]).text();
        if(publisher !== 'Paizo'){
            return;
        }
        creatureUrlList.push(creatureUrl);
    }) */

    //fill creatire objects from creature pages
    await helpers.asyncForEach (creatureUrlSettings, async function(obj, index){
        let creatureObj = await scrapeCreature(obj, new classes.Creature());
        creatures.push(creatureObj);
    });
  
    browser.close();
  
    console.log(creatures);
    return creatures;
}
async function scrapeCreature(urlParams, creature){
    const creatureHtml = await fetch(`https://pf2.easytool.es/tree/actionInfo3.php`, {
        "headers": {
          "accept": "text/html, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "x-requested-with": "XMLHttpRequest",
          "cookie": "PHPSESSID=8klrol4p94kvbvoekqmfiofh40; _mode=dark"
        },
        "referrer": `https://pf2.easytool.es/tree/index.php?id=${urlParams.id}&name=${urlParams.name.toLowerCase()}`,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `id_feature=${urlParams.id}&advancement=0&type=0&optional=opt0`,
        "method": "POST",
        "mode": "cors"
      });
    
    let $ = await cheerio.load(await creatureHtml.text());

    //scrape name
    creature.Name = $('header.pt-2 > h1.pt-2').text();

    //scrape level
    creature.Level.Type = $('div.article-content > h4.monster > span.monster-type').text();
    creature.Level.Level = $('div.article-content > h4.monster > span.monster-level').text();

    //scrape traits
    creature.Traits.Rarity = $('article.monster > div.page-center > div.article-content > p.traits > span[class*="frequency"]').text();
    creature.Traits.Alignment = $('article.monster > div.page-center > div.article-content > p.traits > span.alignment').text();
    creature.Traits.Size = $('article.monster > div.page-center > div.article-content > p.traits > span.size').text();
    let otherTraits = $('article.monster > div.page-center > div.article-content > p.traits > span.trait');
    otherTraits.each((index, trait) =>{
        creature.Traits.OtherTraits.push($(trait).text())
    });

    //scrape perception
    let senses = $('article.monster > div.page-center > div.article-content > p > b:contains("Senses")').parent();
    senses.find("*").addBack().contents().filter((i,s) => { return (s.type === "text" && $(s).text() !== "Senses")}).each((index, sense) =>{
        if(index === 0){
            creature.Perception.Modifier = $(sense).text();
            return;
        }
        creature.Perception.SpecialSenses.push($(sense).text());
    });
    //scrape languages
    let languages = $('article.monster > div.page-center > div.article-content > p > b:contains("Languages")').parent();
    languages.find("*").addBack().contents().filter((i,s) => { return (s.type === "text" && $(s).text() !== "Languages")}).each((index, language) =>{
        creature.Languages.push($(language).text());
    });
    //scrape skills
    let skills = $('article.monster > div.page-center > div.article-content > p > b:contains("Skills")').parent();

    let skillNames = skills.children("a");
    skillNames.each((i,s) => {
        creature.Skills.push({Name: $(s.firstChild).text(), Modifier: $(s.next).text()})
    })

    //scrape ability modifiers
    //need to fix below this
    let abilities = $('article.monster > div.page-center > div.article-content > p > b:contains("Str")');
    abilities.contents().filter((i,s) => { return (s.type === "text" && !s.parentNode)}).each((index, ability) =>{
       switch(index){
        case 0:
            creature.AbilityModifiers.Str = $(ability).text();
            return;
        case 1:
            creature.AbilityModifiers.Dex = $(ability).text();
            return;
        case 2:
            creature.AbilityModifiers.Con = $(ability).text();
            return;
        case 3:
            creature.AbilityModifiers.Int = $(ability).text();
            return;
        case 4:
            creature.AbilityModifiers.Wis = $(ability).text();
            return;
        case 5: 
            creature.AbilityModifiers.Cha = $(ability).text();
            return;
        default:
            return;
       }
    });
    //scrape source
    creature.Source = $('div.secion15 > div:nth-child(2) > a').text();

    //creature.lastScraped = new Date().toJson();
    return creature;
}

//scrapeAncestries(urlBegin + 'Ancestries.aspx');
//scrapeAncestries();
scrapeCreatures();
module.exports = {
    scrapeAll,
    scrapeAncestries,
    scrapeAncestry
} 