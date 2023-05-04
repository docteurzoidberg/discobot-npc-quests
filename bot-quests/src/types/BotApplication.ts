import { Collection } from 'discord.js';
import { BotCommand } from './BotCommand';
import { BotConfig } from './BotConfig';
import { Logger } from 'pino';

export interface BotApplication {
  client: any;
  logger: Logger;
  commands: Collection<string, BotCommand>;
  updated: boolean;
  version: string;
  dataPath: string;
  config: BotConfig;
}
