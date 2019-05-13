const {expect} = require('chai');
const proxyquire = require('proxyquire');
const {stub} = require('sinon');

const apiKey = 'fake-api-key';
const listId = 'fake-list-id';
const mockId = '2619225074';
const validResponse = {
  body: `
<GoodreadsResponse>
  <reviews>
    <review>
      <id>${mockId}</id>
    </review>
  </reviews>
</GoodreadsResponse>`
};

describe('fetch-reviews', () => {
  let fetchReviews;
  const stubGot = stub();

  before(() => {
    fetchReviews = proxyquire('./fetch-reviews', {
      got: stubGot
    });
  });

  beforeEach(() => {
    stubGot.resetHistory();
    stubGot.resolves(validResponse);
  });

  it('calls the Google Books API with the expected params', async () => {
    await fetchReviews(apiKey, listId);
    expect(stubGot.args).to.deep.equal([[
      `https://www.goodreads.com/review/list/${listId}.xml?key=${apiKey}&v=2&shelf=read&sort=date_read`
    ]]);
  });

  it('parses and returns the JSON review data', async () => {
    const reviews = await fetchReviews(apiKey, listId);
    expect(reviews).to.deep.equal([{id: [mockId]}]);
  });
});
