//typescript imports
import * as dotenv from 'dotenv';
import { default as logger } from './logger';
import * as schedule from 'node-schedule';
import * as api from './lib/quests-api';
import BotApplication from 'drz-ts-botapplication';


//load environment variables

dotenv.config({
  path:
    __dirname +
    '/../.env' +
    (process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''),
});

const basePath = process.env.BASE_PATH || process.cwd() || __dirname;

//const logger = pino({
//  level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
//});

import { GatewayIntentBits, Partials } from 'discord.js';
import { BotApplicationOptions } from 'drz-ts-botapplication/src/types/BotApplicationOptions';


const appEnv = {
  API_URL: process.env.API_URL || '',
  TPPT_URL: process.env.TPPT_URL || ''
}

const appConfig = {
  RUN_JOBS: process.env.RUN_JOBS === 'true',
  USE_DALLE: process.env.USE_DALLE === 'true',
  INVISIBLE: process.env.BOT_INVISIBLE === 'true',
};

const clientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Channel, Partials.Message, Partials.Reaction],
  presence: {
    status: appConfig.INVISIBLE ? 'invisible' : 'online',
  },
}

//schedule jobs?
if (appConfig.RUN_JOBS) {
  //reset daily quest job
  const job = schedule.scheduleJob('0 0 * * *', () => {
    logger.info('Resetting daily quests');
    try {
      api.resetDailyQuests();
    } catch (err: any) {
      logger.error(`Error reseting daily quests: ${err}`);
      logger.debug(err.stack);
    }
  });
  job.invoke();
}
//prepare instance of Discord.js client
const opts: BotApplicationOptions = {
  basePath: __dirname,
  clientOptions: clientOptions,
  appConfig: appConfig,
  appEnv: appEnv,
};

const app = new BotApplication(opts);

app.run();