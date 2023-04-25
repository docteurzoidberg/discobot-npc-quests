const api = require('../lib/quests');

const getChannelsWithQuests = async (req, res) => {
  const { logger } = req;
  logger.info('getChannelsWithQuests');

  const channelsWithQuests = [];
  const channels = await api.getChannelsIds();
  channels.forEach(async (channelId) => {
    const quests = await api.getChannelQuests(channelId);
    if (quests && quests.length > 0) {
      channelsWithQuests.push(channelId);
    }
  });
  res.json(channelsWithQuests);
};

const getChannels = async (req, res) => {
  const { logger } = req;
  logger.info('getChannels');
  const channels = await api.getChannelsIds();
  res.json(channels);
};

const router = require('express').Router();
router.get('/', getChannels);
router.get('/withquests', getChannelsWithQuests);
module.exports = router;
