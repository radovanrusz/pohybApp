const express = require('express');

require('./db/mongoose');
const router = require('./routers/router');

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE',
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Cache-Control, Pragma, Origin, '
    + 'Authorization, Content-type, X-Requested-With',
  );
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});


app.use(express.json());
app.use(router);

module.exports = app;
