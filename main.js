//// IMPORTS ////
// Getting an array of scraper functions.
const scrapers = require("./scrapers/scrapers");

//// GLOBAL VARIABLE ////
// Object Model for scraped data. Gets updated by updateData function.
let scrapedData = {
  turlock: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
  ripon: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
  tracy: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
  modesto: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
  riverbank: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
  oakdale: {
    news: {
      breakingNews: {},
      localNews: {},
      crime: {},
      government: {},
      education: {},
    },
    sports: {
      highSchoolSports: {},
      localSports: {},
    },
    test: false,
  },
};

//// FUNCTIONS ////
// Updates global variable Object Model with what each function in scrapers array returns.
function updateData(scrapers) {
  scrapers.forEach((scraper) => {
    try {
      scrapedData = scraper(scrapedData);
    } catch (e) {
      console.log(e.message);
    }
  });
  // TODO: Write to JSON file instead of just console logging.
  console.log(scrapedData);
}

// Updates Scraped Data object and will write to JSON file.
updateData(scrapers);
