require('dotenv').config();

const fs = require('fs');

const databasePath = process.env.DATABASE_PATH || './data';

function uuid() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function loadChannelDatabase(channelId) {
  const databaseFile = `${databasePath}/${channelId}.json`;
  if (!fs.existsSync(databaseFile)) {
    await saveChannelDatabase(channelId, { quests: [] });
  }

  const json = await fs.promises.readFile(databaseFile, 'utf8');
  let db = {};
  try {
    db = JSON.parse(json);
  } catch (error) {
    throw new Error(`Error parsing database file: ${error}`);
  }
  return db;
}

async function saveChannelDatabase(channelId, db) {
  const databaseFile = `${databasePath}/${channelId}.json`;
  const newdb = {
    version: 1,
    lastUpdated: new Date(),
    quests: [...db.quests],
  };
  try {
    return await fs.promises.writeFile(
      databaseFile,
      JSON.stringify(newdb, null, 2)
    );
  } catch (error) {
    throw new Error(`Error writing database file: ${error}`);
  }
}

async function getChannelQuestById(channelId, questId) {
  const db = await loadChannelDatabase(channelId);
  return db.quests.find((a) => a.id.toLowerCase() === questId.toLowerCase());
}

async function getChannelQuests(channelId) {
  const db = await loadChannelDatabase(channelId);
  return db.quests;
}

async function addChannelQuest(channelId, quest) {
  //TODO: check quest data

  const db = await loadChannelDatabase(channelId);

  //check for duplicate id
  let newId = uuid();
  let needId = true;
  while (needId) {
    let found = -1;
    db.quests.forEach((element, index) => {
      if (element.id.toLowerCase() === newId.toLowerCase()) {
        found = index;
      }
    });
    if (found !== -1) {
      newId = uuid();
    } else {
      needId = false;
    }
  }

  const questBase = {
    id: newId,
    dateCreated: new Date(),
  };

  const newQuest = { ...questBase, ...quest };

  db.quests.push(newQuest);
  await saveChannelDatabase(channelId, db);
}

async function updateChannelQuest(channelId, quest) {
  const db = await loadChannelDatabase(channelId);

  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === quest.id.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating quests: ${quest.id} not found`);
  }

  const questOveride = {
    dateUpdated: new Date(),
  };

  const questUpdate = { ...quest, ...questOveride };

  //update database quest
  db.quests[found] = questUpdate;
  await saveChannelDatabase(channelId, db);
}

async function completeChannelQuest(channelId, questId) {
  const db = await loadChannelDatabase(channelId);
  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error completing quest: ${questId} not found`);
  }

  let quest = db.quests[found];
  quest.dateCompleted = new Date();

  //update database quest
  db.quests[found] = quest;
  await saveChannelDatabase(channelId, db);
}

async function deleteChannelQuest(channelId, questId) {
  const db = await loadChannelDatabase(channelId);
  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error deleting quest: ${questId} not found`);
  }

  let quest = db.quests[found];
  quest.dateDeleted = new Date();

  //update database quest
  db.quests[found] = quest;
  await saveChannelDatabase(channelId, db);
}

module.exports = {
  getChannelQuestById,
  getChannelQuests,
  addChannelQuest,
  updateChannelQuest,
  completeChannelQuest,
  deleteChannelQuest,
};
