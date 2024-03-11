const cheerio = require("cheerio");

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
    });

    $sports("a.image-link-macro").each((i, element) => {
      const anchor = $sports(element);
      articleURLS.push(anchor.attr("href"));
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

  const source = "";
  const publisher = "";
  const heading = "";
  const subheading = "";
  const paragraphs = "";
  const filteredParagraphs = "";
  const author = "";
  const date = "";
  const image = {};

  return urls;
};

module.exports = { modestoBeeScraper };
