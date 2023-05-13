declare global {
  namespace NodeJS {
    interface ProcessEnv {
      //discord
      BOT_VERSION: string;
      BOT_TOKEN: string;
      DISCORD_CLIENT_ID: string;
      DISCORD_GUILD_ID: string;
      BOT_INVISIBLE: string;
      //www-api
      API_URL: string;
      //openai
      OPENAI_API_KEY: string;
      USE_DALLE: string;
      //tppt uploads
      TPPT_URL: string;
      TPPT_TOKEN: string;
      TPPT_AUTHOR: string;
      TPPT_PROVIDER: string;
    }
  }
}
export { }