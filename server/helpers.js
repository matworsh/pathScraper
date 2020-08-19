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

/* function trimHTML(html, start, end){
    trimedHTML = html[html.index(start)+len(start) : html.index(end)]
    trimedHTML = trimedHTML.replace('<br/>','\n')
    trimedHTML = trimedHTML.replace('<i>','')
    trimedHTML = trimedHTML.replace('</i>','')
    trimedHTML = trimedHTML.replace(u'\u2014','--')
    trimedHTML = trimedHTML.replace(u'\u2019',"'")
    return tmp
}  */

module.exports = {
    cheerioPage,
    asyncForEach, 
//    trimHTML
}