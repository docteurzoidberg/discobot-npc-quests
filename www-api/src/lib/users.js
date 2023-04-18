require('dotenv').config();

const fs = require('fs');

const databasePath = process.env.DATA_PATH || './data';

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

async function getUserIds() {
  //list files in datapathpath/users
  const userIds = [];
  const usersPath = `${databasePath}/users`;
  if (!fs.existsSync(usersPath)) {
    return userIds;
  }
  const files = await fs.promises.readdir(usersPath);
  for (const file of files) {
    const userId = file.split('.')[0];
    userIds.push(userId);
  }
  return userIds;
}

async function getUserSettings(userId) {
  _checkUserId(userId);
  const databaseFile = `${databasePath}/users/${userId}.json`;
  if (!fs.existsSync(databaseFile)) {
    await setUserSettings(userId, defaultUserSettings);
  }
  const json = await fs.promises.readFile(databaseFile, 'utf8');
  let settings = {};
  try {
    settings = JSON.parse(json);
  } catch (error) {
    throw new Error(`Error parsing database file: ${error}`);
  }
  return settings;
}

async function setUserSettings(userId, settings) {
  _checkUserId(userId);
  _checkSettings(settings);
  const databaseFile = `${databasePath}/users/${userId}.json`;
  const newSettings = {
    lastUpdated: new Date(),
    ...settings,
  };
  try {
    return await fs.promises.writeFile(
      databaseFile,
      JSON.stringify(newSettings, null, 2)
    );
  } catch (error) {
    throw new Error(`Error writing database file: ${error}`);
  }
}

module.exports = {
  getUserIds,
  getUserSettings,
  setUserSettings,
};
