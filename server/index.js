const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');
const apicache = require('apicache');
const { step1, getTags, sortPosts } = require('./controller/controller.js')

app.use(bodyParser.json());
app.use(morgan('dev'));

// Step 5 Sets up cache for requests
const cache = apicache.middleware;

app.use(express.static(path.join(__dirname, '../client/public')));


const PORT = process.env.PORT || 2222;

// Step 1 of challenge
// Second argument is for cache

app.get('/api/ping', cache('60 minutes'), step1)

// Step 2 of challenge
// Second argument is for cache
// I believe the solution branch is wrong or that they are not specific enough
// The prompt says to gather all blog posts that have at least one tag
// However the solution branch contains blog post that only have Tech and or History tags (At least one of each).
// Here I have gathered all of the posts with at least one tag and filtered out the repeated ones.

app.get('/api/posts', cache('60 minutes'), getTags);

// Step 3 of Challenge
// Second argument is for cache
// I'm going to make a third route /api/posts/SortBy, do to the confusion from the previous step
// I will repeat what is show in the solution branch for step 3
// Gather all posts with at least one tag from history and tech
// And then sort by likes with the most likes on top

app.get('/api/posts/sortBy', cache('60 minutes'), sortPosts);


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});