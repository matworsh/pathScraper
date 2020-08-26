const express = require('express');
const scrapers = require('./ancestryscraper')
const app = express();
const port = 3000;

const bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/ancestries', async (req, res) => {
    //const ancestries = scrapers.scrapeAncestries('https://2e.aonprd.com/Ancestries.aspx');
// todo: GET from db
  //res.send(ancestries)
});

app.post('/ancestries', async (req, res) => {
  //const ancestries =scrapers.scrapeAncestries('https://2e.aonprd.com/Ancestries.aspx') ;
  console.log(req.body);
  // todo: scrape
  // todo: add to db
  res.send('success');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});