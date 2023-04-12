require('dotenv').config({ path: __dirname + '/../../.env' });

const API_URL = process.env.API_URL || false;

const fetch = require('node-fetch');

//TODO: write wrapper for all quest api methods
async function getChannelQuests(channelId) {
  const response = await fetch(`${API_URL}/quests/${channelId}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function getChannelQuestById(channelId, questId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/${questId}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function createChannelQuest(channelId, quest) {
  const response = await fetch(`${API_URL}/quests/${channelId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ quest: quest }),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function completeChannelQuest(channelId, questId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/complete`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function deleteChannelQuest(channelId, questId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/${questId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

module.exports = {
  getChannelQuests,
  getChannelQuestById,
  createChannelQuest,
  completeChannelQuest,
  deleteChannelQuest,
};
