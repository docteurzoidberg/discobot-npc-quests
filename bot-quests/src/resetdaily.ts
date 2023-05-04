import dotenv from 'dotenv';

dotenv.config({
  path:
    __dirname +
    '/../.env' +
    (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});

import { default as logger } from './logger';
import * as api from './lib/quests-api';

//parsing env variables
const API_URL = process.env.API_URL || false;

//test api url is set
if (!API_URL) {
  logger.fatal('API_URL environment variable not set');
  process.exit(1);
}

const main = async () => {
  const channelIds = await api.getChannelsWithQuests();
  logger.info(`Found ${channelIds.length} channels with quests`);

  for (const channelId of channelIds) {
    logger.info(`Reseting daily quests for channel ${channelId}`);
    try {
      const result = await api.resetDailyQuestsInChannel(channelId);
      logger.info(`Result:`);
      logger.info(result);
    } catch (err) {
      logger.error(
        `Error reseting daily quests for channel ${channelId}: ${err}`
      );
      logger.debug(err.stack);
    }
  }
};

//async wrapper for main function
(async () => {
  try {
    await main();
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
})();

export {};
