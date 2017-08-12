const express = require('express');
const request = require('request');
const cors = require('cors');

const app = express();
app.use(cors());

app.options('*');
app.get('*', (req, res) => {
  req.pipe(request(`http:/${req.url}`)).pipe(res);
});

/* eslint-disable no-console */
app.listen(8080, () => console.log('Proxy started'));
