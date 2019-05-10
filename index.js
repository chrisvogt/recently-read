'use strict';

const controlAccess = require('control-access');
const etag = require('etag');
const got = require('got');

const fetchReviews = require('./lib/fetch-reviews');
const reviewToIsbn = require('./lib/review-to-isbn');
const transformBook = require('./lib/transform-book');

const cache = `max-age=${Number(process.env.CACHE_MAX_AGE) || 300}`;
const MAX_BOOKS = Number(process.env.MAX_BOOKS) || 10;
const {
  ACCESS_ALLOW_ORIGIN: origin,
  GOODREADS_API_KEY,
  GOODREADS_LIST_ID,
  GOOGLE_BOOKS_API_KEY
} = process.env;

const ONE_DAY = 1000 * 60 * 60 * 24;

if (!GOODREADS_API_KEY) {
  throw new Error('Please set your Goodreads token in the `GOODREADS_API_KEY` environment variable');
}

if (!GOODREADS_LIST_ID) {
  throw new Error('Please set the Goodreads list ID in the `GOODREADS_LIST_ID` environment variable');
}

if (!GOOGLE_BOOKS_API_KEY) {
  throw new Error('Please set your Google token in the `GOOGLE_BOOKS_API_KEY` environment variable');
}

if (!origin) {
  throw new Error('Please set the `access-control-allow-origin` you want in the `ACCESS_ALLOW_ORIGIN` environment variable');
}

let responseText = '[]';
let responseETag = '';

const GOOGLE_API = `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key=${GOOGLE_BOOKS_API_KEY}`;

async function getRecentlyReadBooks() {
  try {
    const reviews = await fetchReviews(GOODREADS_API_KEY, GOODREADS_LIST_ID);
    const isbns = reviews.reduce(reviewToIsbn);

    const bookPromises = isbns.map(isbn => got(GOOGLE_API.replace('{isbn}', isbn)));
    const bookResults = await Promise.all(bookPromises);
    const books = bookResults.map(transformBook).filter(book => Boolean(book)).slice(0, MAX_BOOKS);

    responseText = JSON.stringify(books);
    responseETag = etag(responseText);
  } catch (error) {
    console.log('Error fetching reviews data.', error);
  }
}

setInterval(getRecentlyReadBooks, ONE_DAY);
getRecentlyReadBooks();

module.exports = (request, response) => {
  controlAccess()(request, response);

  response.setHeader('cache-control', cache);
  response.setHeader('etag', responseETag);

  if (request.headers.etag === responseETag) {
    response.statusCode = 304;
    response.end();

    return;
  }

  response.end(responseText);
};
