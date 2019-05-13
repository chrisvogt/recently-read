'use strict';

const convertToHttps = require('to-https');

module.exports = book => {
  const {
    book: {
      volumeInfo: {
        authors,
        categories = [],
        imageLinks: {
          smallThumbnail,
          thumbnail
        } = {},
        infoLink,
        pageCount,
        previewLink,
        subtitle,
        title
      } = {}
    } = {},
    rating
  } = book;

  return {
    authors,
    categories,
    infoLink: convertToHttps(infoLink),
    pageCount,
    previewLink,
    rating,
    smallThumbnail: convertToHttps(smallThumbnail),
    subtitle,
    thumbnail: convertToHttps(thumbnail),
    title
  };
};
