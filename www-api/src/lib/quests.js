require('dotenv').config();

const fs = require('fs');

const databasePath = process.env.DATABASE_PATH || './data';

const _checkQuest = (quest) => {
  if (!quest) throw new Error('No quest found');
  if (!quest.id) throw new Error('No quest.id found');
};

const _checkTag = (tag) => {
  //tag should be a string
  if (typeof tag !== 'string') {
    throw new Error(`tag is not a string: ${tag}`);
  }

  //tag length should be between 1 and 20 chars
  if (tag.length > 20) {
    throw new Error(`tag too long: ${tag}`);
  }
  if (tag.length < 1) {
    throw new Error(`tag too short: ${tag}`);
  }

  //check for invalid characters
  if (!tag.match(/^[a-zA-Z0-9]+$/)) {
    throw new Error(`tag contains invalid characters: ${tag}`);
  }
};

const _checkChannelDatabase = (db) => {
  if (!db) throw new Error('No database found');
  if (!db.quests) throw new Error('No database.quests found');
};

const _checkChannelId = (channelId) => {
  if (!channelId) throw new Error('No channelId provided');
  if (!channelId.match(/^[0-9]+$/))
    throw new Error('Invalid channelId provided');
};

const _checkQuestId = (questId) => {
  if (!questId) throw new Error('No questId provided');
  //quest id is a 2 or more char string
  if (!questId.match(/^[a-zA-Z0-9]{2,}$/))
    throw new Error('Invalid questId provided');
};

const _checkQuestObject = (questObject) => {
  if (!questObject) throw new Error('No questObject provided');
  if (!questObject.quest) throw new Error('No questObject.quest provided');
  _checkQuest(questObject.quest);
};

const _checkTagObject = (tagObject) => {
  if (!tagObject) throw new Error('No tagObject provided');
  if (!tagObject.tag) throw new Error('No tagObject.tag provided');
  _checkTag(tagObject.tag);
};

function _uuid() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 3; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function _generateID(index) {
  let numChars = 2; // number of characters in ID
  let charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'; // character set for ID
  let id = ''; // initialize ID string
  index += charset.length;
  while (index >= 0) {
    let digit = index % charset.length; // get current digit
    id = charset[digit] + id; // prepend current character to ID
    index = Math.floor(index / charset.length) - 1; // move to next digit
    numChars++; // increment number of characters in ID
    // check if ID needs to be extended
    if (digit === charset.length - 1) {
      numChars++;
    }
    charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.repeat(numChars); // update character set for longer IDs
  }
  return id;
}

async function _getNextUnusedGlobalQuestId() {
  //list channels
  const channels = await _getChannelsIds();
  const channelIds = channels.map((channel) => channel.id);

  //for each channel load the database
  const channelDatabases = await Promise.all(
    channelIds.map((channelId) => _loadChannelDatabase(channelId))
  );

  //for each channel database, get the quest ids
  const channelQuestIds = channelDatabases.map((db) => {
    return db.quests.map((quest) => quest.id);
  });

  //flatten the array
  const allQuestIds = channelQuestIds.flat();

  let index = 0;
  let newQuestId = _generateID(index);
  while (allQuestIds.includes(newQuestId)) {
    index++;
    newQuestId = _generateID(index);
  }
  return newQuestId;
}

async function _getChannelsIds() {
  const channelFiles = fs.readdirSync(`${databasePath}/quests`);
  return channelFiles.map((file) => {
    file.replace('.json', '');
  });
}

async function _loadChannelDatabase(channelId) {
  _checkChannelId(channelId);
  const databaseFile = `${databasePath}/quests/${channelId}.json`;
  if (!fs.existsSync(databaseFile)) {
    await _saveChannelDatabase(channelId, { quests: [] });
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

async function _saveChannelDatabase(channelId, db) {
  const databaseFile = `${databasePath}/quests/${channelId}.json`;
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
  _checkChannelId(channelId);
  _checkQuestId(questId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  return db.quests.find((a) => a.id.toLowerCase() === questId.toLowerCase());
}

async function getChannelQuests(channelId) {
  _checkChannelId(channelId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  return db.quests;
}

async function getChannelPublicQuests(channelId) {
  _checkChannelId(channelId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  //remove private quests
  db.quests = db.quests.filter((a) => a.private !== true);
  return db.quests;
}

async function addChannelQuest(channelId, quest) {
  _checkChannelId(channelId);
  _checkQuestObject(quest);

  const newId = await _getNextUnusedGlobalQuestId();

  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);

  db.quests.forEach((element) => {
    if (element.id.toLowerCase() === newId.toLowerCase()) {
      throw new Error(`Error adding quests: ${newId} already exists`);
    }
  });

  const questBase = {
    id: newId,
    dateCreated: new Date(),
  };

  const newQuest = { ...questBase, ...quest };

  db.quests.push(newQuest);
  await _saveChannelDatabase(channelId, db);
}

async function updateChannelQuest(channelId, quest) {
  _checkChannelId(channelId);
  _checkQuestObject(quest);
  const db = await _loadChannelDatabase(channelId);

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
  await _saveChannelDatabase(channelId, db);
}

async function completeChannelQuest(channelId, questId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
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
  await _saveChannelDatabase(channelId, db);
}

async function deleteChannelQuest(channelId, questId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
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
  await _saveChannelDatabase(channelId, db);
}

async function addTagToChannelQuest(channelId, questId, tagObject) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkTagObject(tagObject);

  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);

  //load achievement
  const quest = await getChannelQuestById(channelId, questId);
  _checkQuest(quest);

  if (!quest.tags) {
    quest.tags = [];
  }

  const newTag = tagObject.tag.toLowerCase();
  _checkTag(newTag);

  //check tag not already added
  if (quest.tags.find((t) => t.toLowerCase() === newTag)) {
    throw new Error(`quest ${questId} already has tag: ${newTag}`);
  }

  //update stuff
  quest.tags.push(newTag);
  quest.dateUpdated = new Date();

  //update database quest
  for (let i = 0; i < db.quests.length; i++) {
    if (db.quests[i].id.toLowerCase() === quest.id.toLowerCase()) {
      db.quests[i] = quest;
      break;
    }
  }

  await _saveChannelDatabase(channelId, db);
  return quest;
}

async function removeTagFromChannelQuest(channelId, questId, tagObject) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkTagObject(tagObject);

  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);

  const quest = await getChannelQuestById(channelId, questId);
  _checkQuest(quest);

  if (!quest.tags) {
    quest.tags = [];
  }

  const tag = tagObject.tag.toLowerCase();

  //check tag exists
  if (!quest.tags.find((t) => t.toLowerCase() === tag.toLowerCase())) {
    throw new Error(`quest ${questId} has no '${tag}' tag`);
  }

  //update stuff
  quest.tags = achievement.tags.filter(
    (t) => t.toLowerCase() !== tag.toLowerCase()
  );
  quest.dateUpdated = new Date();

  //update database achievement
  for (let i = 0; i < db.quests.length; i++) {
    if (db.quests[i].id.toLowerCase() === quest.id.toLowerCase()) {
      db.quests[i] = quest;
      break;
    }
  }

  await _saveChannelDatabase(channelId, db);
  return quest;
}

async function undeleteChannelQuest(channelId, questId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = index;
    }
  });
  const quest = db.quests[found];
  _checkQuest(quest);
  quest.dateDeleted = null;
  db.quests[found] = quest;
  await _saveChannelDatabase(channelId, db);
  return quest;
}

async function uncompleteChannelQuest(channelId, questId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = index;
    }
  });
  const quest = db.quests[found];
  _checkQuest(quest);
  quest.dateCompleted = null;
  db.quests[found] = quest;
  await _saveChannelDatabase(channelId, db);
  return quest;
}

module.exports = {
  getChannelQuestById,
  getChannelQuests,
  getChannelPublicQuests,
  addChannelQuest,
  updateChannelQuest,
  completeChannelQuest,
  uncompleteChannelQuest,
  deleteChannelQuest,
  undeleteChannelQuest,
  addTagToChannelQuest,
  removeTagFromChannelQuest,
};
