const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.options('*');
app.get('*', (req, res) => {
  if (req.url.startsWith('/https://')) {
    req.pipe(request(`${req.url}`)).pipe(res);
  }
});

/* eslint-disable no-console */
app.listen(8080, () => console.log('Proxy started'));
