//Authors: Manuel, Mobin
//// IMPORTS ////
// Getting an array of scraper functions.
const {
  turlockJournalScraper,
  riponNewsScraper,
  tracyPressScraper,
  modestoBeeScraper,
  riverbankNewsScraper,
  oakdaleLeaderScraper,
} = require("./scrapers/scrapeArticles");

//// GLOBAL VARIABLE ////
// Array of object articles for scraped data. Gets updated by updateData function.
let articleArray = [];

//// FUNCTIONS ////
// Updates global variable Object Model with what each function in scrapers array returns.
async function updateData() {
  // TODO: Write to JSON file instead of just console logging.

  /*
  const data = await Promise.all([
    turlockJournalScraper(),
    riponNewsScraper(),
    tracyPressScraper(),
    modestoBeeScraper(),
    riverbankNewsScraper(),
    oakdaleLeaderScraper(),
  ]).then((allData) => allData);

  for (let i = 0; i < data.length; i++) {
    articleArray = articleArray.concat(data[i]);
  }
  */
  //turlockJournalScraper()
  riponNewsScraper()
  //console.log(articleArray);
  console.timeEnd();
}

// Updates Scraped Data object and will write to JSON file.
console.time();
updateData();
