'use strict';

const controlAccess = require('control-access');
const etag = require('etag');
const got = require('got');
const {parseString} = require('xml2js');

const transformBook = require('./transform-book');

const cache = `max-age=${Number(process.env.CACHE_MAX_AGE) || 300}`;
const MAX_BOOKS = Number(process.env.MAX_REPOS) || 10;
const {
  ACCESS_ALLOW_ORIGIN: origin,
  GOODREADS_API_KEY,
  GOODREADS_LIST_ID,
  GOOGLE_BOOKS_API_KEY
} = process.env;

const isString = subject => typeof subject === 'string';
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

async function fetchLatest() {
  try {
    const {body} = await got(`https://www.goodreads.com/review/list/${GOODREADS_LIST_ID}.xml?key=${GOODREADS_API_KEY}&v=2`);

    const reviews = await new Promise((resolve, reject) => {
      parseString(body, (error, result) => {
        if (error) {
          reject(error);
        }

        const reviews = result.GoodreadsResponse.reviews[0].review;
        resolve(reviews);
      });
    });

    const isbns = reviews
      .filter(({read_at: readAt}) => {
        const [date] = readAt;
        return isString(date) && date.length > 3;
      })
      .map(({book}) => {
        const [{isbn: isbnArr = [], isbn13: isbn13Arr = []}] = book;
        const [isbn] = isbnArr;
        const [isbn13] = isbn13Arr;
        return isString(isbn) ? isbn : isString(isbn13) ? isbn13 : false;
      })
      .filter(isbn => isString(isbn));

    const bookPromises = isbns.map(isbn => got(GOOGLE_API.replace('{isbn}', isbn)));
    const bookResults = await Promise.all(bookPromises);
    const books = bookResults.map(transformBook).filter(book => Boolean(book)).slice(0, MAX_BOOKS);

    responseText = JSON.stringify(books);
    responseETag = etag(responseText);
  } catch (error) {
    console.log('Error fetching reviews data.', error);
  }
}

setInterval(fetchLatest, ONE_DAY);
fetchLatest();

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
