//// IMPORTS ////
const cheerio = require("cheerio");
const axios = require("axios");

// @ desc Scrapes The Turlock Journal
// @ returns array of individual article URLS.
const getTurlockURLS = async () => {
  // Array to return.
  const articleURLS = [];

  // Main URLS to scrape.
  const newsURL = "https://www.turlockjournal.com/news/";
  const sportsURL = "https://www.turlockjournal.com/sports/";

  // Getting DOM strings to create cheerio objects out of.
  const newsPromise = axios.get(newsURL).then((res) => res.data);
  const sportsPromise = axios.get(sportsURL).then((res) => res.data);

  const [newsDOM, sportsDOM] = await Promise.all([newsPromise, sportsPromise]);

  // Creating cheerio objects.
  const $news = cheerio.load(newsDOM);
  const $sports = cheerio.load(sportsDOM);

  $news("a.anvil-images__image-container").each((i, element) => {
    const anchor = $news(element);
    articleURLS.push(anchor.attr("href"));
  });

  $sports("a.anvil-images__image-container").each((i, element) => {
    const anchor = $sports(element);
    articleURLS.push(anchor.attr("href"));
  });
  return articleURLS;
};

// @ desc Scrapes Ripon News
// @ returns array of individual article URLS.
const getRiponURLS = () => {
  return ["article1", "article2"];
};

// @ desc Scrapes the Tracy Press
// @ returns updated scraped data object with new scraped data.
const getTracyURLS = () => {
  return ["article1", "another article"];
};

// @ desc Scrapes The Modesto Bee
// @ returns updated scraped data object with new scraped data.
const getModestoURLS = async () => {
  // Array to populate with article URLS
  const articleURLS = [];

  // URLS to scrape for article URLS
  const newsURL = "https://www.modbee.com/news/";
  const sportsURL = "https://www.modbee.com/sports/";

  // Getting DOM strings for each page.
  const newsPromise = fetch(newsURL).then((res) => res.text());
  const sportsPromise = fetch(sportsURL).then((res) => res.text());
  console.log("made promises");

  try {
    const [newsDOM, sportsDOM] = await Promise.all([
      newsPromise,
      sportsPromise,
    ]);
    console.log("got doms");
  } catch (e) {
    console.log(`Failed to connect to modesto bee. Error: ${e.message}`);
    return;
  }

  const $news = cheerio.load(newsDOM);
  const $sports = cheerio.load(sportsDOM);

  $news("a.image-link-macro").each((i, element) => {
    const anchor = $news(element);
    articleURLS.push(anchor.attr("href"));
  });

  $sports("a.image-link-macro").each((i, element) => {
    const anchor = $sports(element);
    articleURLS.push(anchor.attr("href"));
  });
  console.log(articleURLS);
  return articleURLS;
};
getModestoURLS();

// @ desc Scrapes Riverbank News
// @ returns updated scraped data object with new scraped data.
const getRiverbankURLS = () => {
  return ["articles", "article"];
};

// @ desc Scrapes Oakdale Leader
// @ returns updated scraped data object with new scraped data.
const getOakdaleURLS = () => {
  return ["article", "myArticle"];
};

module.exports = {
  getTurlockURLS,
  getRiponURLS,
  getTracyURLS,
  getModestoURLS,
  getRiverbankURLS,
  getOakdaleURLS,
};
