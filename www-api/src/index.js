require('dotenv').config({
  path: '../.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});

const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan')('dev');
const signale = require('signale');

const logger = signale.scope('api');

const middlewares = require('./middlewares/common');
const quests = require('./routes/quests');
const channels = require('./routes/channels');
const users = require('./routes/users');

const port = process.env.API_PORT || 5000;
const hostname = process.env.HOSTNAME || 'localhost';
const datapath = process.env.DATA_PATH || './data';

if (!fs.existsSync(datapath + '/quests')) fs.mkdirSync(datapath + '/quests');

const app = express();

app.use(morgan);

//allow all origin for other docker containers
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.logger = logger;
  next();
});

app.get('/', middlewares.noIndexHandler);
app.use('/quests', quests);
app.use('/channels', channels);
app.use('/users', users);
app.use(middlewares.errorHandler);

app.listen(port, () =>
  logger.info(
    `npc-quests-internal-api listening on port http://${hostname}:${port}/ !`
  )
);
