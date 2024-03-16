//Authors: Manuel, Mobin
//// IMPORTS ////
const { writeFile } = require("fs/promises");
const path = require("path");
// Getting Scraper functions.
const { modestoBeeScraper } = require("./scrapers/modestoScraper");
const { turlockJournalScraper } = require("./scrapers/turlockScraper");
const { oakdaleLeaderScraper } = require("./scrapers/oakdaleScraper");
const { riverbankNewsScraper } = require("./scrapers/riverbankScraper");
const { tracyPressScraper } = require("./scrapers/tracyScraper");
const { riponScraper } = require("./scrapers/riponScraper");

//// GLOBAL VARIABLE ////
// Array of object articles for scraped data. Gets updated by updateData function.
let articleArray = [];

//// FUNCTIONS ////
// @ desc Scrapes city data or all cities if all is passed as arg.
// @ returns an array of objects where each object represents an article with the data we need as properties.
async function scrapeData(city) {
  let articles;
  console.time();
  switch (city) {
    case "turlock":
      articles = await turlockJournalScraper();
      console.log(`Scraped ${articles.length} from Tracy Press`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "modesto":
      articles = await modestoBeeScraper();
      console.log(`Scraped ${articles.length} from Tracy Press`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "oakdale":
      articles = await oakdaleLeaderScraper();
      console.log(`Scraped ${articles.length} from Oakdale Leader`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "riverbank":
      articles = await riverbankNewsScraper();
      console.log(`Scraped ${articles.length} from Riverbank News`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "tracy":
      articles = await tracyPressScraper();
      console.log(`Scraped ${articles.length} from Tracy Press`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "ripon":
      articles = await riponScraper();
      console.log(`Scraped ${articles.length} from Ripon Press`);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articles)
      );
      break;
    case "all":
      const data = await Promise.all([
        tracyPressScraper(),
        turlockJournalScraper(),
        modestoBeeScraper(),
        oakdaleLeaderScraper(),
        riverbankNewsScraper(),
        riponScraper(),
      ]).then((allData) => allData);
      for (let i = 0; i < data.length; i++) {
        articleArray = articleArray.concat(data[i]);
      }
      console.log(articleArray.length);
      await writeFile(
        path.join(process.cwd(), "articles.json"),
        JSON.stringify(articleArray)
      );
      break;
  }
  console.timeEnd();
}

// Updates Scraped Data object and will write to JSON file.
scrapeData("oakdale");

module.exports = { scrapeData };
