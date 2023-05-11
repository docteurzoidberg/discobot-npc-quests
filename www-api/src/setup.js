require('dotenv').config({
  path: '../.env' + (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});

const fs = require('fs');

const datapath = process.env.DATA_PATH || '/data';

if (!fs.existsSync(datapath)) {
  fs.mkdirSync(datapath);
}
