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

const router = require('express').Router();
router.get('/', getChannelsWithQuests);
module.exports = router;
