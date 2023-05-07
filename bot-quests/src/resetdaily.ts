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
  try {
    const result = await api.resetDailyQuests();
    logger.info(`Result:`);
    logger.info(result);
  } catch (err) {
    logger.error(`Error reseting daily quests: ${err}`);
    logger.debug(err.stack);
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
