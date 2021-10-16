const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Arena = require('bull-arena');

const routes = require('./app/routes');
const errors = require('./app/middlewares/errors');
const { logRequests } = require('./app/middlewares/logger_requests');

const app = express();
app.use(cors());

// Client must send "Content-Type: application/json" header
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logRequests);

routes.init(app);

app.use(errors.handle);

const { url } = require('./config').redis;
const Bull = require('bull');

const arenaConfig = Arena(
  {
    Bull,
    queues: [
      {
        name: 'work',
        redis: {
          url,
        },
        hostId: 'bull',
      },
    ],
  },
  {
    basePath: '/arena',
    disableListen: false,
  },
);
app.use('/', arenaConfig);

module.exports = app;
