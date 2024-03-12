const cheerio = require("cheerio");

// Global variable for thumbnails images.
let newsThumbnails = [];
let sportsThumbnails = [];

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

  try {
    const [newsDOM, sportsDOM] = await Promise.all([
      newsPromise,
      sportsPromise,
    ]);

    const $news = cheerio.load(newsDOM);
    const $sports = cheerio.load(sportsDOM);

    $news("a.image-link-macro").each((i, element) => {
      const anchor = $news(element);
      articleURLS.push(anchor.attr("href"));
      newsThumbnails.push(anchor.find("img").attr("src"));
    });

    $sports("a.image-link-macro").each((i, element) => {
      const anchor = $sports(element);
      articleURLS.push(anchor.attr("href"));
      sportsThumbnails.push(anchor.find("img").attr("src"));
    });

    return articleURLS;
  } catch (e) {
    console.log(`Failed to connect to modesto bee. Error: ${e.message}`);
    return;
  }
};

// @ desc Scrapes The Modesto Bee
// @ returns updated Scraped data object with new scraped data.
const modestoBeeScraper = async () => {
  // Getting article urls.
  const urls = await getModestoURLS();
  const thumbnails = newsThumbnails.concat(sportsThumbnails);

  // Turning the URLS into DOM strings
  const urlPromises = urls.map((url) => {
    return fetch(url).then((res) => res.text());
  });

  // Getting an array of article dom strings.
  const articleDOMS = await Promise.all(urlPromises);

  // Creating an array to push articles into and return.
  const articles = [];

  for (let i = 0; i < articleDOMS.length; i++) {
    // Creating a cheerio object out of current url.
    const $ = cheerio.load(articleDOMS[i]);

    const articleObject = {};

    // Getting necessary data.
    const source = urls[i];
    const publisher = "The Modesto Bee";
    const heading = $("h1.h1").text().trim();
    const category = $("a.kicker").eq(0).text().trim();
    const author =
      $("div.byline").find("a").text().trim() ||
      $("div.byline").text().trim().split("\n")[0].trim() ||
      null;
    const date =
      $("time.update-date").text() || $("time.publish-date").text() || null;
    const thumbnail = thumbnails[i];
    const image = {};
    image["src"] = $("img.responsive-image").eq(0).attr("srcset") || null;
    image["alt"] = $("img.responsive-image").eq(0).attr("alt") || null;
    const filteredParagraphs = [];
    $("article")
      .find("p")
      .each((i, element) => {
        const paragraph = $(element);
        filteredParagraphs.push(paragraph.text().trim());
      });

    // Saving necessary data to object.
    articleObject["source"] = source;
    articleObject["publisher"] = publisher;
    articleObject["heading"] = heading;
    articleObject["subheading"] = null;
    articleObject["category"] = category;
    articleObject["author"] = author;
    articleObject["date"] = date;
    articleObject["image"] = image;
    articleObject["thumbnail"] = thumbnail;
    articleObject["paragraphs"] = filteredParagraphs;

    // Pushing current article object to articles array.
    // NOTE: Some articles that are published seem to still be getting worked on and had no heading. I wont push those.

    if (articleObject.heading) {
      articles.push(articleObject);
    }
  }

  // Returning articles array.
  return articles;
};

module.exports = { modestoBeeScraper };
