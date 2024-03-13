const cheerio = require("cheerio");
const axios = require("axios");

// @ Desc scrapes tracy press for article urls.
const getTracyURLS = async () => {
  // Creating arrays to populate and return
  const articleURLS = [];

  // Main URLS to scrape.
  const newsURL = "https://www.ttownmedia.com/tracy_press/news/";
  const sportsURL = "https://www.ttownmedia.com/tracy_press/sports/";

  // Getting DOM strings to create cheerio objects out of.
  const newsPromise = axios
    .get(newsURL, { timeout: 15000 })
    .then((res) => res.data);
  const sportsPromise = axios
    .get(sportsURL, { timeout: 15000 })
    .then((res) => res.data);
  const [newsDOM, sportsDOM] = await Promise.all([newsPromise, sportsPromise]);
  const articleDOMS = newsDOM.concat(sportsDOM);

  // Creating cheerio object out of DOM strings.
  const $ = cheerio.load(articleDOMS);

  // Getting URLS and thumbnails.
  $("div.card-container")
    .find("a.tnt-asset-link")
    .each((i, element) => {
      const $anchor = $(element);
      const url = "https://ttownmedia.com" + $anchor.attr("href");
      articleURLS.push(url);
    });
  // Returning array of unique URL articles.
  return [...new Set(articleURLS)];
};

// @ desc Scrapes Oakdale Leader
// @ returns updated Scraped data object with new scraped data.
const tracyPressScraper = async () => {
  const articles = [];

  // Getting an array of article DOM strings for cheerio.
  const urls = await getTracyURLS();
  const URLpromises = urls.map((url) => {
    return axios.get(url, { timeout: 15000 }).then((res) => res.data);
  });
  const articleDOMS = await Promise.all(URLpromises);

  // Iterating over urls, turning them to article objects, and pushing them to articles array.
  for (let i = 0; i < articleDOMS.length; i++) {
    // Creating article object to push to article array.
    const objectToPush = {};

    // Creating main cheerio object.
    const $ = cheerio.load(articleDOMS[i]);

    // Getting author.
    const author =
      $("div.asset-masthead")
        .find("ul.list-inline")
        .find("span.tnt-byline")
        .text()
        .trim() || "The Tracy Press";

    // Getting date.
    const date = $("div.meta")
      .find("span")
      .find("ul")
      .find("li.hidden-print")
      .find("time")
      .text()
      .trim();

    // Getting Image.
    const src = $("div.image").find("div").children().eq(2).attr("content");
    const alt = $("div.image").find("div").children().find("img").attr("alt");
    const image = { src, alt };

    // Getting paragraphs.
    const paragraphs = [];
    $("div.asset-content")
      .find("p")
      .each((i, element) => {
        const paragraph = $(element).text().trim();
        paragraphs.push(paragraph);
      });

    // Getting more data, single-liners.
    const source = urls[i];
    const publisher = "The Tracy Press";
    const heading = $("h1.headline").find("span").text().trim();

    // Saving data to an object I will push to the array of objects.
    objectToPush["source"] = source;
    objectToPush["publisher"] = publisher;
    objectToPush["heading"] = heading;
    objectToPush["subHeading"] = null;
    objectToPush["category"] = getCategories(urls[i]);
    objectToPush["subcategory"] = null;
    objectToPush["author"] = author;
    objectToPush["date"] = date;
    objectToPush["img"] = image.src ? image : null;
    objectToPush["thumbnail"] = image.src ? image : null;
    objectToPush["paragraphs"] = paragraphs;

    // Pushing object to articles array.
    articles.push(objectToPush);
  }
  return articles;
};

// @ Desc gets the article main category by checking url.
// @ Returns string of main category.
function getCategories(url) {
  let category = "";
  if (url.includes("https://ttownmedia.com/tracy_press/news/")) {
    category = "NEWS";
  } else {
    category = "SPORTS";
  }
  return category;
}

module.exports = { tracyPressScraper };
