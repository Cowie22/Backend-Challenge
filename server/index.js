const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const apicache = require('apicache');
const { step1, getTags } = require('./controller/controller.js')

app.use(bodyParser.json());
app.use(morgan('dev'));

// Step 5 Sets up cache for requests
const cache = apicache.middleware;

app.use(express.static(path.join(__dirname, '../client/public')));


const PORT = process.env.PORT || 2222;

// Step 1 of challenge
// Second argument is for cache
// Cache was benchmarked seeing the request times in the terminal, with and without the cache.
// The response times reduce with subsequent calls while using the cache and they do not reduce
// Without the cache as expected.

// Both routes were benchmarked and visualized against the sample data using Postman

app.get('/api/ping', cache('60 minutes'), step1)

// Step 2 of challenge
// Second argument is for cache
// Tags are a required parameter, while sortBy and direction are optional.
// SortBy and direction default to id and asc, respectively

app.get('/api/posts/:tags/:sortBy?/:direction?', cache('60 minutes'), getTags);


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});