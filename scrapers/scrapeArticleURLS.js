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
const getRiponURLS = async () => {
  // set to return (used set to remove duplicate URLS)
  const articleURLS = new Set();

  // Main URLS to scrape.
  const newsURL = "https://www.riponpress.com/news/";
  const sportsURL = "https://www.riponpress.com/sports/";

  // Getting DOM strings to create cheerio objects out of.
  const newsPromise = axios.get(newsURL).then((res) => res.data);
  const sportsPromise = axios.get(sportsURL).then((res) => res.data);

  const [newsDOM, sportsDOM] = await Promise.all([newsPromise, sportsPromise]);

  // Creating cheerio objects.
  const $news = cheerio.load(newsDOM);
  const $sports = cheerio.load(sportsDOM);

  $news("a.tnt-asset-link").each((i, element) => {
    const anchor = $news(element);
    articleURLS.add("https://www.riponpress.com" + anchor.attr("href"));
  });

  $sports("a.tnt-asset-link").each((i, element) => {
    const anchor = $sports(element);
    articleURLS.add("https://www.riponpress.com" + anchor.attr("href"));
  });
  //console.log(articleURLS);

  //turn set into an array
  return Array.from(articleURLS);
};

// @ desc Scrapes the Tracy Press
// @ returns updated scraped data object with new scraped data.
const getTracyURLS = () => {
  return ["article1", "another article"];
};

// @ desc Scrapes The Modesto Bee
// @ returns updated scraped data object with new scraped data.
const getModestoURLS = () => {
  // Array to populate with article URLS
  const articleURLS = [];

  // URLS to scrape for article URLS
  const newsURL = "https://www.modbee.com/news/";
  const sportsURL = "https://www.modbee.com/sports/";

  // Getting DOM strings for each page.
  //const newsDOM = await axios.get(newsURL).then((res) => res.data);
  //const sportsDOM = await axios.get(sportsURL).then((res) => res.data);
};

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
