const cheerio = require("cheerio");
const axios = require("axios");

// Global variables to store thumbnails.
let newsThumbnails = [];
let sportsThumbnails = [];

// @ desc Scrapes The Riverbank News.
// @ returns array of individual article URLS.
const getRiverbankURLS = async () => {
  // Array to push urls to and eventually return.
  const urls = [];
};
