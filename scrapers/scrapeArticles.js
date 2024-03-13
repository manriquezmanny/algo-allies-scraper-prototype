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
  // Getting turlock article urls to iterate over and scrape.
  const urls = await getTurlockURLS();

  // Getting an array of promises to pass to Promise.all(). Resolved when each url is turned into DOM string.
  const URLpromises = urls.map((url) => {
    return axios.get(url).then((res) => res.data);
  });
  // Awaiting all promises to be fulfilled before continuing to next part of code.
  const articleDOMS = await Promise.all(URLpromises);

  // Creating array to push objects to.
  const arr = new Array();

  // Iterating over each turlock article DOM to scrape data.
  for (let i = 0; i < articleDOMS.length; i++) {
    // const object to push
    const objectToPush = {};

    // Creating main cheerio object.
    const $ = cheerio.load(articleDOMS[i]);

    // Getting needed data I could get that wasn't filled with props.
    const source = urls[i];
    const publisher = "Turlock Journal";
    const heading = $("div.anvil-article__title").text();
    const subHeading = $("div.anvil-article__subtitle").text().trim() || null;
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
    const author = jsonData.page_meta.author || paragraphs[0];
    const date = jsonData.page_meta.page_created_at_pretty;

    // Saving data to an object I will push to the array of objects.
    objectToPush["source"] = source;
    objectToPush["publisher"] = publisher;
    objectToPush["heading"] = heading.trim();
    objectToPush["subHeading"] = subHeading;
    objectToPush["author"] = author;
    objectToPush["date"] = date;

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
    objectToPush["paragraphs"] = filteredParagraphs;

    arr.push(objectToPush);
  }
  console.log(arr);
  return arr;
};

// @ desc Scrapes Ripon News
// @ returns updated Scraped data object with new scraped data.
const riponNewsScraper = async () => {
  // Getting Ripon article urls to iterate over and scrape.
  const urls = await getRiponURLS();

  // Getting an array of promises to pass to Promise.all(). Resolved when each url is turned into DOM string.
  const URLpromises = urls.map(async (url) => {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${url}: ${error.message}`);
      return null; // Skip this article
    }
  });

  // Awaiting all promises to be fulfilled before continuing to the next part of the code.
  const articleDOMS = (await Promise.all(URLpromises)).filter(Boolean);

  // Creating array to push objects to.
  const arr = new Array();
  // Iterating over each Ripon article DOM to scrape data.
  for (let i = 0; i < articleDOMS.length; i++) {
    // const object to push
    const objectToPush = {};

    // Creating main cheerio object.
    const $ = cheerio.load(articleDOMS[i]);

    const date = $("time.tnt-date").text().trim();
    const author = $("a.tnt-user-name:eq(1)").text().trim();

    // Getting needed data I could get that wasn't filled with props.
    const source = urls[i];
    const publisher = "Ripon Journal";
    const heading = $("h1.headline").text();
    const subHeading = $("h2.subhead").text().trim() || null;
    const paragraphs = [];
    $("div.asset-content")
      .children()
      .each((i, element) => {
        const p = $(element).text().trim();
        if (p !== "") {
          paragraphs.push(p);
        }
      });

    //console.log(source);

    //console.log(publisher);
    //console.log(heading);
    //console.log(subHeading);
    //console.log(paragraphs);

    // Saving data to an object I will push to the array of objects.
    objectToPush["source"] = source;
    objectToPush["publisher"] = publisher;
    objectToPush["heading"] = heading.trim();
    objectToPush["subHeading"] = subHeading;
    objectToPush["author"] = author;
    objectToPush["date"] = date;

    // Getting the image data and saving that to objectToPush

    const image = {};
    const currentImage = $('meta[property="og:image"]').attr("content");
    const imageAlt = $('meta[name="twitter:image:alt"]').attr("content");

    image["url"] = currentImage;
    image["alt"] = imageAlt;

    objectToPush["img"] = image;

    arr.push(objectToPush);
  }
  console.log(arr);
  return arr;
};

// @ desc Scrapes the Tracy Press
// @ returns updated scraped data object with new scraped data.
const tracyPressScraper = () => {
  return [{ tracy: "articles" }];
};

// @ desc Scrapes The Modesto Bee
// @ returns updated scraped data object with new scraped data.
const modestoBeeScraper = () => {
  return [{ modesto: "articles" }];
};

// @ desc Scrapes Riverbank News
// @ returns updated scraped data object with new scraped data.
const riverbankNewsScraper = () => {
  return [{ riverbank: "articles" }];
};

// @ desc Scrapes Oakdale Leader
// @ returns updated scraped data object with new scraped data.
const oakdaleLeaderScraper = () => {
  return [{ oakdale: "myArticle" }];
};

// Exporting each webscraper.
module.exports = {
  turlockJournalScraper,
  riponNewsScraper,
  tracyPressScraper,
  modestoBeeScraper,
  riverbankNewsScraper,
  oakdaleLeaderScraper,
};
