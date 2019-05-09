# Recently Read Books Microservice

> A Google Books and Goodreads-powered recently-read book microservice


## Install

1. Clone this repository

```
$ git clone https://github.com/chrisvogt/recently-read
```

2. Install Node.js dependencies

```
$ npm install
```

## Usage

Run the service. You can alternatively use the `dev` command while in development.

```
$ ACCESS_ALLOW_ORIGIN=* GOODREADS_API_KEY=0000000000000000000000 GOODREADS_LIST_ID=00000000 GOOGLE_BOOKS_API_KEY=000000000000000000000000000000000000000 MAX_BOOKS=12 npm run start
```

## Configure

### Environmental Variables

#### CACHE_MAX_AGE

Default: `300`

(Optional) Max seconds to cache the results for.

#### MAX_BOOKS

Default: `10`

(Optional) Max number of books to respond with.

#### GOODREADS_API_KEY

Your Goodreads developer key, available [here](https://www.goodreads.com/api/keys).

#### GOODREADS_LIST_ID

The Goodreads list ID to query.

#### GOOGLE_BOOKS_API_KEY

Your [GCP API key](https://cloud.google.com/docs/authentication/api-keys) with access to the Google Books API.

#### ACCESS_ALLOW_ORIGIN

The Access-Control-Allow-Origin header value. Use `*` to allow all domains.

## License

MIT © [Chris Vogt](https://www.chrisvogt.me)
