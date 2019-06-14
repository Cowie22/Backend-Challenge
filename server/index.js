const path = require('path');
const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const axios = require('axios');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, '../client/public')));


const PORT = process.env.PORT || 2222;


// Step 1 of challenge
app.get('/api/ping', (req, res) => {
  res.status(200).send({
    success: 'true',
  })
})

// Step 2 of challenge
app.get('/api/posts', (req, res) => {
  axios.all([
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=tech'),
    axios.get('http://hatchways.io/api/assessment/blog/posts?tag=history')
  ])
  .then(axios.spread((response1, response2) => {
    const data1 = response1.data.posts;
    const data2 = response2.data.posts;
    const posts = data1.concat(data2)
    const post = {
      posts
    }
    res.status(200).send(post);
  }))
  .catch(error => {
    res.status(400).send({
      error: 'Tags parameter is required'
    })
    console.log(error)
  });
})


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});