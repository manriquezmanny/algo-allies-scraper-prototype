//// IMPORTS ////
const cheerio = require("cheerio");
const axios = require("axios");

// @ desc Scrapes The Turlock Journal
// @ returns updated Scraped data object with new scraped data.
const turlockJournalScraper = (object) => {
  object.turlock.test = true;
  return object;
};

// @ desc Scrapes Ripon News
// @ returns updated Scraped data object with new scraped data.
const riponNewsScraper = (object) => {
  object.turlock.test = true;
  object.turlock.crime = { burglary: "Cat burglar" };
  return object;
};

// @ desc Scrapes the Tracy Press
// @ returns updated scraped data object with new scraped data.
const tracyPressScraper = (object) => {
  object.tracy.test = true;
  return object;
};

// @ desc Scrapes The Modesto Bee
// @ returns updated scraped data object with new scraped data.
const modestoBeeScraper = (object) => {
  object.modesto.test = true;
  return object;
};

// @ desc Scrapes Riverbank News
// @ returns updated scraped data object with new scraped data.
const riverbankNewsScraper = (object) => {
  object.riverbank.test = true;
  return object;
};

// @ desc Scrapes Oakdale Leader
// @ returns updated scraped data object with new scraped data.
const oakdaleLeaderScraper = (object) => {
  object.oakdale.test = true;
  return object;
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
