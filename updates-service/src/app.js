const { json, urlencoded } = require('express');
const { client } = require('./db');
const updatesRouter = require('./routers/updates.router');
const express = require('express');
const path = require('path');

(async () => {
  await client.connect();
  console.log('Successfully connected to database');

  const app = express();
  app.set('view engine', 'pug');
  app.use(json());
  app.use(
    urlencoded({
      extended: true
    })
  );
  app.use('/public', express.static(path.resolve('public')));
  app.use('/updates', updatesRouter);

  app.listen(3001, () => console.log('Server started'));
})();
