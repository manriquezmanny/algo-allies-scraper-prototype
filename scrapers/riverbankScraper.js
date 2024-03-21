const cheerio = require("cheerio");

// GLOBAL VARIABLE //
const subcategoriesObj = {};

// @ desc Scrapes The Riverbank News for Article URLS.
// @ returns array of article URLS to scrape.
const getRiverbankURLS = async () => {
  console.log("Scraping The Riverbank News");
  // Arrays to return.
  const thumbnailArr = [];

  // Creating sets to populate with unique URLS.
  const crimeArticleURLS = new Set();
  const govArticleURLS = new Set();
  const edArticleURLS = new Set();
  const localNewsArticleURLS = new Set();
  const localSportsArticleURLS = new Set();
  const highSchoolArticleURLS = new Set();

  // Pages to scrape for articles.
  const crimeURL = "https://www.theriverbanknews.com/news/crime/";
  const govURL = "https://www.theriverbanknews.com/news/government/";
  const edURL = "https://www.theriverbanknews.com/news/education/";
  const localNewsURL = "https://www.theriverbanknews.com/news/local-news/";
  const localSportsURL =
    "https://www.theriverbanknews.com/sports/local-sports/";
  const highSchoolURL =
    "https://www.theriverbanknews.com/sports/high-school-sports/";

  // Getting DOM strings to create cheerio objects out of.
  const crimePromise = fetch(crimeURL).then((res) => res.text());
  const govPromise = fetch(govURL).then((res) => res.text());
  const edPromise = fetch(edURL).then((res) => res.text());
  const localNewsPromise = fetch(localNewsURL).then((res) => res.text());
  const localSportsPromise = fetch(localSportsURL).then((res) => res.text());
  const highSchoolPromise = fetch(highSchoolURL).then((res) => res.text());
  console.log("Created HTTP GET req Promise Objects");

  // Waiting for all promises to resolve.
  const [crimeDOM, govDOM, edDOM, localNewsDOM, localSportsDOM, highSchoolDOM] =
    await Promise.all([
      crimePromise,
      govPromise,
      edPromise,
      localNewsPromise,
      localSportsPromise,
      highSchoolPromise,
    ]);
  console.log("Resolved all HTTP GET req Promise Objects");

  // Creating cheerio objects out of DOM strings.
  const $crime = cheerio.load(crimeDOM);
  const $gov = cheerio.load(govDOM);
  const $ed = cheerio.load(edDOM);
  const $localNews = cheerio.load(localNewsDOM);
  const $localSports = cheerio.load(localSportsDOM);
  const $highSchool = cheerio.load(highSchoolDOM);

  // Populating Sets with article URLS and thumbnailArr with thumbnail objects.
  getURLS($crime, thumbnailArr, crimeArticleURLS);
  getURLS($gov, thumbnailArr, govArticleURLS);
  getURLS($ed, thumbnailArr, edArticleURLS);
  getURLS($localNews, thumbnailArr, localNewsArticleURLS);
  getURLS($localSports, thumbnailArr, localSportsArticleURLS);
  getURLS($highSchool, thumbnailArr, highSchoolArticleURLS);

  // Populating GLOBAL object of subcategorized URLS.
  subcategoriesObj["CRIME"] = Array.from(crimeArticleURLS);
  subcategoriesObj["GOVERNMENT"] = Array.from(govArticleURLS);
  subcategoriesObj["EDUCATION"] = Array.from(edArticleURLS);
  subcategoriesObj["LOCAL NEWS"] = Array.from(localNewsArticleURLS);
  subcategoriesObj["LOCAL SPORTS"] = Array.from(localSportsArticleURLS);
  subcategoriesObj["HIGH SCHOOL SPORTS"] = Array.from(highSchoolArticleURLS);

  let articleURLS = [
    ...crimeArticleURLS,
    ...govArticleURLS,
    ...edArticleURLS,
    ...localNewsArticleURLS,
    ...localSportsArticleURLS,
    ...highSchoolArticleURLS,
  ];

  return [articleURLS, thumbnailArr];
};

// @ desc Scrapes The Turlock Journal
// @ returns updated Scraped data object with new scraped data.
const riverbankNewsScraper = async () => {
  const articles = [];

  // Getting turlock article urls, thumbnails, then turning urls into DOM strings.
  const [urls, thumbnails] = await getRiverbankURLS();
  const URLpromises = urls.map((url) => {
    return fetch(url).then((res) => res.text());
  });
  const articleDOMS = await Promise.all(URLpromises);
  console.log("Got article URL DOMS, Scraping Data...");

  // Iterating over DOM strings, turning them into objects, and pushing them to articles array.
  for (let i = 0; i < articleDOMS.length; i++) {
    const objectToPush = {};

    // Making a main cheerio object.
    const $ = cheerio.load(articleDOMS[i]);

    // Getting JSON data to get author and date.
    const jsonData = JSON.parse(
      $("div.anvil-padding-bottom")
        .find("span")
        .attr("data-page-tracker-analytics-payload")
    );

    // Getting image cheerio object for getting image data.
    const $image = $("div.anvil-images__image-container")
      .find("picture.anvil-images__image--main-article")
      .next();

    // Getting paragraphs.
    const paragraphs = [];
    $("div.rich-text")
      .find("div.rich-text")
      .children()
      .each((i, element) => {
        const p = $(element);
        if (p.text().trim() !== "") {
          paragraphs.push(p.text().trim());
        }
      });

    // Getting more data in one-liners.
    const source = urls[i];
    const publisher = "The Riverbank News";
    const [category, subcategory] = getCategories(source);
    const heading = $("div.anvil-article__title").text();
    const subHeading = $("div.anvil-article__subtitle").text().trim() || null;
    const author = jsonData.page_meta.author || paragraphs[0];
    const date = jsonData.page_meta.page_created_at_pretty;
    const image = { src: $image.attr("src"), alt: $image.attr("alt") };

    // Saving data to an object I will push to the array of objects.
    objectToPush["source"] = source;
    objectToPush["publisher"] = publisher;
    objectToPush["heading"] = heading.trim();
    objectToPush["subHeading"] = subHeading;
    objectToPush["category"] = category;
    objectToPush["subcategory"] = subcategory;
    objectToPush["author"] = author;
    objectToPush["date"] = date;
    objectToPush["img"] = image;
    objectToPush["thumbnail"] = thumbnails[i];
    objectToPush["paragraphs"] = paragraphs;

    articles.push(objectToPush);
  }
  return articles;
};

// Populates URL Sets and thumbnails array according to cheerio obj passed in.
function getURLS($, thumbnailArr, toAdd) {
  // Gets URLS and thumbnails for articles.
  $("a.anvil-images__image-container").each((i, element) => {
    const anchor = $(element);
    toAdd.add(anchor.attr("href"));
    const $thumbnail = anchor.find("img.anvil-images__image--main-article");
    const { src, alt } = $thumbnail.attr();
    const thumbnail = { src, alt };
    thumbnailArr.push(thumbnail);
  });
}

// @ Desc gets categories from url.
// @ Returns category string.
function getCategories(source) {
  // Getting Categories.
  let category = "";
  let subcategory = "";
  if (subcategoriesObj["CRIME"].includes(source)) {
    category = "NEWS";
    subcategory = "CRIME";
  } else if (subcategoriesObj["GOVERNMENT"].includes(source)) {
    category = "NEWS";
    subcategory = "GOVERNMENT";
  } else if (subcategoriesObj["EDUCATION"].includes(source)) {
    category = "NEWS";
    subcategory = "EDUCATION";
  } else if (subcategoriesObj["LOCAL NEWS"].includes(source)) {
    category = "NEWS";
    subcategory = "LOCAL NEWS";
  } else if (subcategoriesObj["LOCAL SPORTS"].includes(source)) {
    category = "SPORTS";
    subcategory = "LOCAL SPORTS";
  } else {
    category = "SPORTS";
    subcategory = "HIGH SCHOOL SPORTS";
  }
  return [category, subcategory];
}

module.exports = { riverbankNewsScraper };
