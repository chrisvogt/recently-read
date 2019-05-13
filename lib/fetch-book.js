'use strict';

const got = require('got');

module.exports = async (apiKey, book) => {
  const {isbn, rating} = book;

  const GOOGLE_API = `https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}&key=${apiKey}`;

  try {
    const {body} = await got(GOOGLE_API.replace('{isbn}', book.isbn));
    // const {body} = response;
    const {items: [bookData] = []} = JSON.parse(body);

    if (!bookData) {
      throw new Error(`Failed to fetch Google Books data for ${isbn}.`);
    }

    return {
      book: bookData,
      rating
    };
  } catch (error) {
    console.log(error);
  }
};
