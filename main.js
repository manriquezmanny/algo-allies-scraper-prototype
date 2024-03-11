//Authors: Manuel, Mobin
//// IMPORTS ////
// Getting Scraper functions.
const { modestoBeeScraper } = require("./scrapers/modestoScraper");
const { turlockJournalScraper } = require("./scrapers/turlockScraper");

//// GLOBAL VARIABLE ////
// Array of object articles for scraped data. Gets updated by updateData function.
let articleArray = [];

//// FUNCTIONS ////
// @ desc Scrapes necessary data from all news sites.
// @ returns an array of objects where each object represents an article with the data we need as properties.
async function updateData() {
  const data = await Promise.all([
    turlockJournalScraper(),
    modestoBeeScraper(),
  ]).then((allData) => allData);

  for (let i = 0; i < data.length; i++) {
    articleArray = articleArray.concat(data[i]);
  }
  console.log(articleArray);
  console.timeEnd();
}

// Updates Scraped Data object and will write to JSON file.
console.time();
updateData();
