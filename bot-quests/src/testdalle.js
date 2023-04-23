require('dotenv').config({ path: __dirname + '/../.env' });

const dalle = require('./lib/openai-dall-e');

const avatarUrl =
  'https://cdn.discordapp.com/avatars/169141120339673088/c7b1c0635e581bb6d4ed30fb3176071b.webp?size=80';

const questTitle = 'Boire le café';
const questDescription = 'Quete répetable, qui consiste à boire un café';
const prompt = `imagine un personnage de jeu rpg en style pixel-art vue top-down, qui est en train d'accomplir la quête intitulée [${questTitle}]`;

(async () => {
  try {
    const text = await dalle.getDallEImage(prompt);
    console.log(text);
  } catch (e) {
    // Deal with the fact the chain failed
    console.error(e);
  }
  // `text` is not available here
})();
