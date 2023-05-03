import { Client, Collection } from 'discord.js';
import { BotCommand } from './BotCommand';

export interface BotApplication {
  client: Client;
  commands: Collection<string, BotCommand>;
  logger: any;
  updated: boolean;
  invisible: boolean;
  version: string;
  dataPath: string;
  db: any;
  config: any;
}
