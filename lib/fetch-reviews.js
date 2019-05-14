'use strict';

const got = require('got');
const {parseString} = require('xml2js');

module.exports = async (apiKey, listId) => {
  const {body} = await got(`https://www.goodreads.com/review/list/${listId}.xml?key=${apiKey}&v=2&shelf=read&sort=date_read`);

  const reviews = await new Promise((resolve, reject) => {
    parseString(body, (error, result) => {
      if (error) {
        reject(error);
      }

      const reviews = result.GoodreadsResponse.reviews[0].review;
      resolve(reviews);
    });
  });

  return reviews;
};
