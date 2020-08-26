const cheerio = require('cheerio')
const urlBegin = 'https://pf2.easytool.es/tree/';

async function cheerioPage(page){
    let content = await page.content();
    return cheerio.load(content);
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
}

module.exports = {
    cheerioPage,
    asyncForEach, 
    urlBegin
}