const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

module.exports.config = {
  name: 'anime',
  author: 'Nguyên Blue',
  Category: 'Giải trí',
  version: '1.0.0',
  hasPrefix: false,
  role: 0,
  cd: 3,
  info: 'kho ảnh anime khổng lồ từ waifu',
}
  module.exports.onRun = async({ api, event }) => {
    const url = 'https://waifu.im';
    try {
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);
      const imageUrl = $('div.zoom img').last().attr('src');

      if (!imageUrl) {
        return;
      }

        api.sendMessage({
          attachment: await global.tools.streamURL(imageUrl, 'jpg'),
        }, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
    }
  }