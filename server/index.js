const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, '../client/public')));

const PORT = process.env.PORT || 2222;


app.get('/api/ping', (req, res) => {
  res.status(200).send("Success");
})


app.listen(PORT, () => {
  console.log(`Web server running on: http://localhost:${PORT}`);
});