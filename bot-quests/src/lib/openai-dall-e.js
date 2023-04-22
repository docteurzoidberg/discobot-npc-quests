require('dotenv').config({
  path:
    __dirname + '/../../.env' + (process.env.NODE_ENV || '' !== '')
      ? '.' + process.env.NODE_ENV
      : '',
});

const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function getDallEImage(prompt, avatarUrl = '') {
  //TODO: handle avatar when api permits

  // Generate image from prompt
  const response = await openai.createImage({
    prompt: prompt,
    n: 1,
    size: '512x512',
  });
  return response.data.data[0].url;
}

module.exports = {
  getDallEImage,
};
