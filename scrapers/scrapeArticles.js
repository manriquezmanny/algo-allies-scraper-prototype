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

    // Getting needed data I could get that wasn't filled with props.
    const source = url;
    const publisher = "Turlock Journal";
    const heading = $("div.anvil-article__title").text();
    const subHeading = $("div.anvil-article__subtitle").text().trim() || "N/A";
    const paragraphs = [];
    $("div.rich-text")
      .find("div.rich-text")
      .children()
      .each((i, element) => {
        const p = $(element);
        paragraphs.push(p.text().trim());
      });
    const filteredParagraphs = paragraphs.filter((p) => p !== "");

    // Getting data that was filled with props, but luckily was in JSON in a span tag.
    const jsonData = JSON.parse(
      $("div.anvil-padding-bottom")
        .find("span")
        .attr("data-page-tracker-analytics-payload")
    );
    const author = jsonData.page_meta.author;
    const date = jsonData.page_meta.page_created_at_pretty;

    // Saving data to an object I will push to the array of objects.
    objectToPush["source"] = source;
    objectToPush["publisher"] = publisher;
    objectToPush["heading"] = heading.trim();
    objectToPush["subHeading"] = subHeading;
    objectToPush["author"] = author;
    objectToPush["date"] = date;
    objectToPush["paragraphs"] = filteredParagraphs;

    // Getting the image data and saving that to objectToPush
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
