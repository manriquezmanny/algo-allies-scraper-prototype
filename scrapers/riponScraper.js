// Imports
const cheerio = require("cheerio");
const axios = require("axios");

// @ desc Scrapes Ripon Leader for article URLS.
// @ returns array of article URLS to scrape.
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
// @ desc Scrapes Ripon News
// @ returns updated Scraped data object with new scraped data.
const riponScraper = async () => {
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
    const $ = cheerio.load(articleDOMS[i]);
    const date = $("time.tnt-date").text().trim();

    if (date === date) {
      // const object to push
      const objectToPush = {};

      // Creating main cheerio object.

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
  }
  console.log(arr);
  return arr;
};

module.exports = { riponScraper };
