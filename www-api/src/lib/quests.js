require("dotenv").config({
  path: "../../.env" + (process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""),
});

const fs = require("fs");

const databasePath = process.env.DATA_PATH || "./data";

const _checkQuest = (quest) => {
  if (!quest) throw new Error("No quest found");
  if (!quest.id) throw new Error("No quest.id found");
};

const _checkTag = (tag) => {
  //tag should be a string
  if (typeof tag !== "string") {
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
  if (!db) throw new Error("No database found");
  if (!db.quests) throw new Error("No database.quests found");
};

const _checkChannelId = (channelId) => {
  if (!channelId) throw new Error("No channelId provided");
  if (!channelId.match(/^[0-9]+$/))
    throw new Error("Invalid channelId provided: " + channelId);
};

const _checkQuestId = (questId) => {
  if (!questId) throw new Error("No questId provided");
  //quest id is a 2 or more char string
  if (!questId.match(/^[a-zA-Z0-9]{2,}$/))
    throw new Error("Invalid questId provided");
};

const _checkUserId = (userId) => {
  if (!userId) throw new Error("No userId provided");
  //quest id is a 2 or more char string
  if (!userId.match(/^[a-zA-Z0-9]{2,}$/))
    throw new Error("Invalid userId provided");
};

const _checkQuestObject = (questObject) => {
  if (!questObject) throw new Error("No questObject provided");
  if (!questObject.quest) throw new Error("No questObject.quest provided");
  //_checkQuest(questObject.quest);
};

const _checkTagObject = (tagObject) => {
  if (!tagObject) throw new Error("No tagObject provided");
  if (!tagObject.tag) throw new Error("No tagObject.tag provided");
  _checkTag(tagObject.tag);
};

function _generateID(index) {
  let numChars = 2; // number of characters in ID
  let charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // character set for ID
  let id = ""; // initialize ID string
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
    charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(numChars); // update character set for longer IDs
  }
  return id;
}

async function _getNextUnusedGlobalQuestId() {
  //list channels
  const channelIds = await getChannelsIds();
  console.debug(channelIds);

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

async function getChannelsIds() {
  const channelFiles = fs.readdirSync(`${databasePath}/quests`);
  const channelIds = channelFiles.map((file) => file.replace(".json", ""));
  //filter valid channel ids
  return channelIds.filter((channelId) => channelId.match(/^[0-9]+$/));
}

async function _loadChannelDatabase(channelId) {
  _checkChannelId(channelId);
  const databaseFile = `${databasePath}/quests/${channelId}.json`;
  if (!fs.existsSync(databaseFile)) {
    await _saveChannelDatabase(channelId, { quests: [] });
  }

  const json = await fs.promises.readFile(databaseFile, "utf8");
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

async function addPlayerToQuest(channelId, questId, userId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkUserId(userId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  const quest = db.quests.find(
    (a) => a.id.toLowerCase() === questId.toLowerCase()
  );
  if (!quest) throw new Error(`Quest ${questId} not found`);
  if (!quest.players) quest.players = [];
  if (quest.players.includes(userId))
    throw new Error(`User ${userId} already in quest ${questId}`);
  quest.players.push(userId);
  await _saveChannelDatabase(channelId, db);
  return quest;
}

async function removePlayerFromQuest(channelId, questId, userId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkUserId(userId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  const quest = db.quests.find(
    (a) => a.id.toLowerCase() === questId.toLowerCase()
  );
  if (!quest) throw new Error(`Quest ${questId} not found`);
  if (!quest.players) quest.players = [];
  if (!quest.players.includes(userId))
    throw new Error(`User ${userId} not in quest ${questId}`);
  quest.players = quest.players.filter((a) => a !== userId);
  await _saveChannelDatabase(channelId, db);
  return quest;
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

async function addChannelQuest(channelId, questObject) {
  _checkChannelId(channelId);
  _checkQuestObject(questObject);

  const newId = await _getNextUnusedGlobalQuestId();
  const newQuest = { ...questObject.quest, id: newId, dateCreated: new Date() };
  _checkQuest(newQuest);

  //TODO: check against all channels. not only this one
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  db.quests.forEach((element) => {
    if (element.id.toLowerCase() === newId.toLowerCase()) {
      throw new Error(`Error adding quests: ${newId} already exists`);
    }
  });

  db.quests.push(newQuest);
  await _saveChannelDatabase(channelId, db);
  return newQuest;
}

async function updateChannelQuest(channelId, questId, questObject) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkQuestObject(questObject);
  const db = await _loadChannelDatabase(channelId);

  let found = -1;
  db.quests.forEach((element, index) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = index;
    }
  });
  if (found === -1) {
    throw new Error(`Error updating quests: ${questId} not found`);
  }

  const questOveride = {
    dateUpdated: new Date(),
  };

  const questUpdated = { ...questObject.quest, ...questOveride };

  //update database quest
  db.quests[found] = questUpdated;
  await _saveChannelDatabase(channelId, db);
  return questUpdated;
}

async function startChannelQuest(channelId, questId, userId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkUserId(userId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  let found = null;
  db.quests.forEach((element) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = element;
    }
  });
  if (!found) {
    throw new Error(`Error starting quest: ${questId} not found`);
  }
  if (found.startedBy) {
    throw new Error(`Error starting quest: ${questId} already started`);
  }
  found.startedBy = userId;
  found.dateStarted = new Date();
  await _saveChannelDatabase(channelId, db);
  return found;
}

async function stopChannelQuest(channelId, questId, userId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkUserId(userId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);
  let found = null;
  db.quests.forEach((element) => {
    if (element.id.toLowerCase() === questId.toLowerCase()) {
      found = element;
    }
  });
  if (!found) {
    throw new Error(`Error stopping quest: ${questId} not found`);
  }
  if (!found.startedBy) {
    throw new Error(`Error stopping quest: ${questId} not started`);
  }
  found.startedBy = null;
  found.dateStarted = null;
  await _saveChannelDatabase(channelId, db);
  return found;
}

async function completeChannelQuest(channelId, questId, userId) {
  _checkChannelId(channelId);
  _checkQuestId(questId);
  _checkUserId(userId);
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
  quest.completedBy = userId;

  //update database quest
  db.quests[found] = quest;
  await _saveChannelDatabase(channelId, db);
  return quest;
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
  return quest;
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

async function resetDailyQuests() {
  const channels = await getChannelsIds();
  const quests = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const channelQuestsReseted = await resetChannelDailyQuests(channel);
    quests.push(...channelQuestsReseted);
  }
  return quests;
}

async function resetChannelDailyQuests(channelId) {
  _checkChannelId(channelId);
  const db = await _loadChannelDatabase(channelId);
  _checkChannelDatabase(db);

  //daily quests resets at midnight
  //reset datecomplete to every daily quest from yesterday and before

  const dateNow = new Date();
  const resetedQuests = [];
  db.quests.forEach((quest) => {
    if (!quest.daily) {
      return;
    }
    if (!quest.dateCompleted) {
      return;
    }
    //parse date
    const dateCompletedDay = new Date(quest.dateCompleted);
    dateCompletedDay.setHours(0, 0, 0, 0);

    const dateNowDay = new Date(dateNow);
    dateNowDay.setHours(0, 0, 0, 0);

    //check if dateCompletedDay is expired (not same day as today)
    if (dateCompletedDay.getTime() < dateNowDay.getTime()) {
      //reset dateCompleted
      quest.dateCompleted = null;
      //db.quests[index] = quest;
      resetedQuests.push(quest);
    }
  });
  await _saveChannelDatabase(channelId, db);
  return resetedQuests;
}

module.exports = {
  getChannelsIds,
  getChannelQuestById,
  getChannelQuests,
  getChannelPublicQuests,
  addChannelQuest,
  updateChannelQuest,
  startChannelQuest,
  stopChannelQuest,
  completeChannelQuest,
  uncompleteChannelQuest,
  deleteChannelQuest,
  undeleteChannelQuest,
  addTagToChannelQuest,
  removeTagFromChannelQuest,
  resetChannelDailyQuests,
  resetDailyQuests,
  addPlayerToQuest,
  removePlayerFromQuest,
};
