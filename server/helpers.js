const cheerio = require('cheerio')

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
    asyncForEach
}