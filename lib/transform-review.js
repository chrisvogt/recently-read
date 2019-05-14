'use strict';

const isString = subject => typeof subject === 'string';

module.exports = (acc, book) => {
  const {read_at: [date]} = book;

  if (!isString(date) && date.length > 3) {
    return;
  }

  const {book: bookData, rating: [rating]} = book;
  const [{isbn: isbnArr = [], isbn13: isbn13Arr = []}] = bookData;
  const [isbn10] = isbnArr;
  const [isbn13] = isbn13Arr;

  const isbn = isString(isbn13) ? isbn13 : isString(isbn10) ? isbn10 : false;
  if (Array.isArray(acc) && isString(isbn)) {
    acc.push({
      isbn,
      rating
    });
  }

  return acc;
};
