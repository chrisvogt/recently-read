'use strict';

const isString = subject => typeof subject === 'string';

module.exports = (acc, book) => {
  const {read_at: readAt} = book;
  const [date] = readAt;

  if (!isString(date) && date.length > 3) {
    return;
  }

  const [{isbn: isbnArr = [], isbn13: isbn13Arr = []}] = book;
  const [isbn10] = isbnArr;
  const [isbn13] = isbn13Arr;

  const isbn = isString(isbn10) ? isbn10 : isString(isbn13) ? isbn13 : false;
  if (Array.isArray(acc) && isString(isbn)) {
    acc.push(isbn);
  }

  return acc;
};
