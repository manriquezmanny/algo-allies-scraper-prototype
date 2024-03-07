//// IMPORTS ////
const cheerio = require("cheerio");
const axios = require("axios");
const {
  getTurlockURLS,
  getRiponURLS,
  getTracyURLS,
  getModestoURLS,
  getRiverbankURLS,
  getOakdaleURLS,
} = require("./scrapeArticleURLS");

// @ desc Scrapes The Turlock Journal
// @ returns updated Scraped data object with new scraped data.
const turlockJournalScraper = async () => {
  // Creating array to push article objects to.
  const objectArray = [];
  // Getting turlock article urls to iterate over and scrape.
  const urls = await getTurlockURLS();

  // Iterating over each turlock article url to scrape data.
  urls.forEach(async (url, i) => {
    // const object to push
    const objectToPush = {};

    // Getting article DOM string.
    const articleDOM = await axios.get(url).then((res) => res.data);

    // Creating main cheerio object.
    const $ = cheerio.load(articleDOM);

    // Getting needed data.
    const source = url;
    objectToPush["source"] = source;
    const publisher = "Turlock Journal";
    objectToPush["publisher"] = publisher;
    const heading = $("div.anvil-article__title").text();
    objectToPush["heading"] = heading.trim();
    const subHeading = $("div.anvil-article__subtitle").text().trim() || "N/A";
    objectToPush["subHeading"] = subHeading;
    const image = {};
    $("div.anvil-images__image-container").each((i, element) => {
      const currentImage = $(element)
        .find("img.anvil-images__background--glass")
        .attr("src");
      const imageAlt = $(element)
        .find("img.anvil-images__background--glass")
        .attr("alt");
      image["url"] = currentImage;
      image["alt"] = imageAlt;
      objectToPush["img"] = image;
    });
    objectToPush["img"] = image;
    console.log(objectToPush);
    objectArray.push(objectToPush);
  });
};

turlockJournalScraper();
// @ desc Scrapes Ripon News
// @ returns updated Scraped data object with new scraped data.
const riponNewsScraper = () => {
  return ["article1", "article2"];
};

// @ desc Scrapes the Tracy Press
// @ returns updated scraped data object with new scraped data.
const tracyPressScraper = () => {
  return ["article1", "another article"];
};

// @ desc Scrapes The Modesto Bee
// @ returns updated scraped data object with new scraped data.
const modestoBeeScraper = () => {
  return ["article", "article2344"];
};

// @ desc Scrapes Riverbank News
// @ returns updated scraped data object with new scraped data.
const riverbankNewsScraper = () => {
  return ["articles", "article"];
};

// @ desc Scrapes Oakdale Leader
// @ returns updated scraped data object with new scraped data.
const oakdaleLeaderScraper = () => {
  return ["article", "myArticle"];
};

scrapers = [
  turlockJournalScraper,
  riponNewsScraper,
  tracyPressScraper,
  modestoBeeScraper,
  riverbankNewsScraper,
  oakdaleLeaderScraper,
];

// Exporting each webscraper.
module.exports = scrapers;
