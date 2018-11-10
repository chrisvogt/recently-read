module.exports = result => {
  const {body} = result;
  const {items = []} = JSON.parse(body);

  if (!items.length > 0) {
    return;
  }

  const {
    volumeInfo: {
      authors,
      imageLinks: {
        smallThumbnail,
        thumbnail
      } = {},
      infoLink,
      pageCount,
      title
    } = {}
  } = items.length && items[0];

  return {
    authors,
    infoLink,
    pageCount,
    smallThumbnail,
    thumbnail,
    title
  };
};
