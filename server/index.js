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


app.get('/api/ping', (req, res) => {
  res.status(200).send({
    success: 'true',
  })
})

app.get('/api/posts', (req, res) => {
  axios.get('http://hatchways.io/api/assessment/blog/posts')
  .then(response => {
    res.send(response.data)
  })
  .catch(error => {
    console.log(error);
  });
})

app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});