require('dotenv').config();

const fs = require('fs');

const DATA_PATH = process.env.DATA_PATH || './data';

const DB_PATH = `${DATA_PATH}/users`;
const DB_VERSION = 1;

const _checkUserId = (userId) => {
  if (!userId) {
    throw new Error('userId is required');
  }
  //should be numeric
  if (isNaN(userId)) {
    throw new Error('userId must be numeric');
  }
};

const _checkSettings = (settings) => {
  if (!settings) {
    throw new Error('settings is required');
  }
  //should be an object
  if (typeof settings !== 'object') {
    throw new Error('settings must be an object');
  }
};

const _checkUserDb = (db) => {
  if (!db) {
    throw new Error('db is required');
  }
  //should be an object
  if (typeof db !== 'object') {
    throw new Error('db must be an object');
  }
  //should have a version
  if (!db.version) {
    throw new Error('db must have a version');
  }
  //should have a dateCreated
  if (!db.dateCreated) {
    throw new Error('db must have a dateCreated');
  }
  //should have settings
  if (!db.settings) {
    throw new Error('db must have settings');
  }
};

const defaultUserSettings = {
  ANNOUNCE_CREATE: true,
  ANNOUNCE_COMPLETE: true,
  ANNOUNCE_DELETE: false,
  ANNOUNCE_UNCOMPLETE: false,
  ANNOUNCE_UNDELETE: false,
  ANNOUNCE_UPDATE: false,
  ANNOUNCE_ADD_TAG: false,
  ANNOUNCE_REMOVE_TAG: false,
  PUBLIC_NAME: 'Not set',
  PUBLIC_AVATAR: '',
  PUBLIC_MEMBER: '<Not set>',
};

async function _loadUserDatabase(userId) {
  //one user per file
  const databaseFile = `${DB_PATH}/${userId}.json`;

  //create file if not exists
  if (!fs.existsSync(databaseFile)) {
    await _saveUserDatabase(userId, {
      version: DB_VERSION,
      dateCreated: new Date(),
      dateUpdated: null,
      settings: defaultUserSettings,
    });
  }

  //read from file
  const json = await fs.promises.readFile(databaseFile, 'utf8');
  let db = {};
  try {
    //parse json
    db = JSON.parse(json);
  } catch (error) {
    throw new Error(`Error parsing database file: ${error}`);
  }
  return db;
}

async function _saveUserDatabase(userId, db) {
  //one user per file
  const databaseFile = `${DB_PATH}/${userId}.json`;

  //TODO: check db version changes
  db.version = DB_VERSION;
  db.dateUpdated = new Date();
  if (!db.settings) {
    db.settings = defaultUserSettings;
  }

  try {
    return await fs.promises.writeFile(
      databaseFile,
      JSON.stringify(db, null, 2)
    );
  } catch (error) {
    throw new Error(`Error writing database file: ${error}`);
  }
}

async function getUserIds() {
  //list files in datapathpath/users
  const userIds = [];
  if (!fs.existsSync(DB_PATH)) {
    return userIds;
  }
  const files = await fs.promises.readdir(DB_PATH);
  for (const file of files) {
    const userId = file.split('.')[0];
    const ext = file.split('.')[1];
    if (ext === 'json') userIds.push(userId);
  }
  return userIds;
}

async function getUsers() {
  const userIds = await getUserIds();

  //for each user load the database and get the user settings
  const users = [];
  for (let i = 0; i < userIds.length; i++) {
    const db = await _loadUserDatabase(userIds[i]);
    _checkUserDb(db);
    users.push({
      id: userIds[i],
      dateCreated: db.dateCreated,
      name: db.settings.PUBLIC_NAME || 'John Doe',
      avatar: db.settings.PUBLIC_AVATAR || 'https://i.imgur.com/0y0y0y0.png',
      member: db.settings.PUBLIC_MEMBER || '<Member not set>',
    });
  }
  return users;
}

async function getUserSettings(userId) {
  _checkUserId(userId);
  const user = await _loadUserDatabase(userId);
  if (!user.settings) {
    user.settings = defaultUserSettings;
    await _saveUserDatabase(userId, user);
  }
  return user.settings;
}

async function setUserSettings(userId, settings) {
  _checkUserId(userId);
  _checkSettings(settings);
  const user = await _loadUserDatabase(userId);
  user.lastUpdated = new Date();
  user.settings = { ...user.settings, ...settings };
  return await _saveUserDatabase(userId, user);
}

module.exports = {
  getUsers,
  getUserIds,
  getUserSettings,
  setUserSettings,
};
