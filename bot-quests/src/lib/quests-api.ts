import * as dotenv from 'dotenv';
import * as fetch from 'node-fetch';

dotenv.config({
  path:
    __dirname +
    '/../../.env' +
    (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});

const API_URL = process.env.API_URL || false;

export async function resetDailyQuests() {
  const response = await fetch(`${API_URL}/quests/reset`, {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function resetDailyQuestsInChannel(channelId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/reset`, {
    method: 'POST',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function getChannelsWithQuests() {
  const response = await fetch(`${API_URL}/channels`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function getUserSettings(userId) {
  const response = await fetch(`${API_URL}/users/${userId}/settings`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

//put user settings
export async function setUserSettings(userId, settings) {
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
export async function getChannelQuests(channelId) {
  const response = await fetch(`${API_URL}/quests/${channelId}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function getChannelQuestById(channelId, questId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/${questId}`);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function createChannelQuest(channelId, quest) {
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

export async function updateChannelQuest(channelId, questId, quest) {
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

export async function completeChannelQuest(channelId, questId, userId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/complete/${userId}`,
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

export async function uncompleteChannelQuest(channelId, questId) {
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

export async function undeleteChannelQuest(channelId, questId) {
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

export async function deleteChannelQuest(channelId, questId) {
  const response = await fetch(`${API_URL}/quests/${channelId}/${questId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function addPlayerToQuest(channelId, questId, userId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/addplayer/${userId}`,
    {
      method: 'PUT',
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}

export async function removePlayerFromQuest(channelId, questId, userId) {
  const response = await fetch(
    `${API_URL}/quests/${channelId}/${questId}/removeplayer/${userId}`,
    {
      method: 'DELETE',
    }
  );
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
}
