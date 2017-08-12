const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.options('*');
app.get('*', (req, res) => {
  req.pipe(request(`https:/${req.url}`)).pipe(res);
});

app.listen(8080);
