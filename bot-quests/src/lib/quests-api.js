require('dotenv').config({ path: __dirname + '/../../.env' });

const API_URL = process.env.API_URL || false;

const fetch = require('node-fetch');

async function resetDailyQuestsInChannel(channelId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/reset`, {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function getChannelsWithQuests() {
  const response = await fetch(`${API_URL}/channels`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

async function getUserSettings(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/settings`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

//put user settings
async function setUserSettings(userId, settings) {
  const response = await fetch(`${API_URL}/users/${userId}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

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

async function updateChannelQuest(channelId, questId, quest) {
  const response = await fetch(`${API_URL}/quests/${channelId}/${questId}`, {
    method: 'PUT',
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

async function completeChannelQuest(channelId, questId, userId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/${userId}/complete`,
    {
      method: 'PUT',
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

async function uncompleteChannelQuest(channelId, questId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/uncomplete`,
    {
      method: 'PUT',
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

async function undeleteChannelQuest(channelId, questId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/undelete`,
    {
      method: 'PUT',
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
  getChannelsWithQuests,
  getUserSettings,
  setUserSettings,
  getChannelQuests,
  getChannelQuestById,
  createChannelQuest,
  updateChannelQuest,
  completeChannelQuest,
  uncompleteChannelQuest,
  deleteChannelQuest,
  undeleteChannelQuest,
  resetDailyQuestsInChannel,
};
