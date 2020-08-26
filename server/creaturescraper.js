const helpers = require('./helpers');
const classes = require('./classes');
const fetch = require('node-fetch');
const cheerio = require('cheerio');


async function scrapeCreatures(){
    const creaturesFetch = await fetch(`${helpers.urlBegin}loadBranches.php`, {
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
    const $ = await cheerio.load(cratureListHtml);

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

    //fill creatire objects from creature pages
    await helpers.asyncForEach (creatureUrlSettings, async function(obj, index){
        let creatureObj = await scrapeCreature(obj, new classes.Creature());
        creatures.push(creatureObj);
    });
  
    console.log(creatures);
    return creatures;
}

async function scrapeCreature(urlParams, creature){
    const creatureHtml = await fetch(`${helpers.urlBegin}actionInfo3.php`, {
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
    
    //load html into cheerio
    let $ = await cheerio.load(await creatureHtml.text());

    //scrape name
    creature.Name = $('header.pt-2 > h2.pt-2').text();

    //scrape level
    creature.Level.Type = $('header.pt-2 > h2.pt-2 > div.pt-2').text();
    creature.Level.Level = $('header.pt-2 > h2.pt-2 > div.pt-2 ml-2').text();

    //scrape traits
    creature.Traits.Rarity = $('section.scrollable > section.traits > div.d-inline-flex > h3.rarity').text();
    creature.Traits.Alignment = $('section.scrollable > section.traits > div.d-inline-flex > h3.alignment').text();
    creature.Traits.Size = $('section.scrollable > section.traits > div.d-inline-flex > h3.size').text();
    let otherTraits = $('section.scrollable > section.traits > div.d-inline-flex > h3.size ~ h3:not(.rarity):not(.alignment):not(.size)');
    otherTraits.each((index, trait) =>{
        creature.Traits.OtherTraits.push($(trait).text())
    });

    //scrape perception
    let sensesString = $('section.scrollable > section.details > p > a.roll > input[value = "Perception"]').parent().parent().text();
    let sensesArray = sensesString.replace(';', ',').split(",");
    creature.Perception.Modifier = sensesArray[0].substring(sensesString.indexOf('+'), sensesString.length - 1);
    creature.Perception.SpecialSenses.push(...sensesArray.splice(1, sensesArray.length - 1));

    //scrape languages
    let languagesString = $('section.scrollable > section.details > p > strong:contains("Languages")').parent().text();
    languagesString = languagesString.replace(`Languages `, ``);
    creature.Languages.push(...languagesString.split(`,`));

    //scrape skills
    let skillsString = $('section.scrollable > section.details > p > strong:contains("Skills")').parent().text();
    skillsString = skillsString.replace(`Skills `, ``);
    skillsString.split(`,`).forEach((skill) => {
        creature.Skills.push({Name: skill.substring(0, skill.indexOf(`+`)), Modifier: skill.substring(skill.indexOf(`+`), skill.length)})
    });

    //scrape ability modifiers
    let abilityModsString = $('section.scrollable > section.details > p > a > input[value="Str"]').parent().parent().text();
    let abilityModsArray = abilityModsString.split(",");
    creature.AbilityModifiers.Str = abilityModsArray[0].substring(abilityModsArray[0].indexOf(`+`), abilityModsArray[0].length);
    creature.AbilityModifiers.Dex = abilityModsArray[1].substring(abilityModsArray[1].indexOf(`+`), abilityModsArray[1].length);
    creature.AbilityModifiers.Con = abilityModsArray[2].substring(abilityModsArray[2].indexOf(`+`), abilityModsArray[2].length);
    creature.AbilityModifiers.Int = abilityModsArray[3].substring(abilityModsArray[3].indexOf(`+`), abilityModsArray[3].length);
    creature.AbilityModifiers.Wis = abilityModsArray[4].substring(abilityModsArray[4].indexOf(`+`), abilityModsArray[4].length);
    creature.AbilityModifiers.Cha = abilityModsArray[5].substring(abilityModsArray[5].indexOf(`+`), abilityModsArray[5].length);

    //scrape items
    let itemsString = $('section.scrollable > section.details > p > strong:contains("Items")').parent().text();
    itemsString = itemsString.replace(`Items `, ``);
    creature.Items.push(...itemsString.split(`,`));

    //scrape ac and saves
    let acAndSaveString = $('section.scrollable > section.details > p > strong:contains("AC")').filter((i, el) => {return $(el).text() === `AC` }).parent().text();
    let acAndSaveArray = acAndSaveString.split(";");
    creature.AC = acAndSaveArray[0].replace(`AC`, ``);
    let mainSavesArray = acAndSaveArray[1].split(`,`);
    creature.SavingThrows.Fort = mainSavesArray[0].substring(mainSavesArray[0].indexOf(`+`), mainSavesArray[0].length);
    creature.SavingThrows.Ref = mainSavesArray[1].substring(mainSavesArray[1].indexOf(`+`), mainSavesArray[1].length);
    creature.SavingThrows.Will = mainSavesArray[2].substring(mainSavesArray[2].indexOf(`+`), mainSavesArray[2].length);
    acAndSaveArray.forEach((save, index) => {
        if(index > 1){
            creature.SavingThrows.Extra.push(save);
        }
    });
    
    //scrape hp, immunities, weaknessess, resistances
    let hpSectionString = $('section.scrollable > section.details > p > strong:contains("HP")').filter((i, el) => {return $(el).text() === `HP` }).parent().text();
    let hpSectionArray = hpSectionString.split(";");
    creature.HP = hpSectionArray[0].replace(`HP`, ``);
    hpSectionArray.forEach((el) => {
        let str = ``;
            if(el.includes(`Immunities`)) {
                str = el.replace(`Immunities `, ``);
                creature.Immunities.push(...str.split(','));
            }else if(el.includes(`Weaknesses`)){
                str = el.replace(`Weaknesses `, ``);
                creature.Weaknesses.push(...str.split(','));
            }else if(el.includes(`Resistances `)){
                str = el.replace(`Resistances`, ``);
                creature.Resistances.push(...str.split(','));
            }
    });

    //scrape source
    creature.Source = $('footer > div > div.source > a').text();

    //creature.lastScraped = new Date().toJson();
    return creature;
}

scrapeCreatures();