const axios = require('axios');

async function bypassUrl(url) {
  try {
    let apiUrl, publisherUrl;

    if (url.includes('traffic123')) {
      apiUrl = 'https://traffic123.net/que?q=status,azauth,q,t,z&filter=connection';
      publisherUrl = `https://traffic123.net/publisher`;
    } else if (url.includes('link68')) {
      apiUrl = 'https://link68.net/que?q=status,azauth,q,t,z&filter=connection';
      publisherUrl = `https://link68.net/publisher`;
    } else if (url.includes('laymangay')) {
      apiUrl = 'https://laymangay.com/que?q=status,azauth,q,t,z&filter=connection';
      publisherUrl = `https://laymangay.com/publisher`;
    } else if (url.includes('trafficuser')) {
      apiUrl = 'https://my.trafficuser.net/que?q=status,azauth,q,t,z&filter=connection';
      publisherUrl = `https://my.trafficuser.net/publisher`;
    } else if (url.includes('linkvertise')) {
      apiUrl = `https://api.bypass.vip/bypass?url=${encodeURIComponent(url)}`;
      const apiResponse = await axios.get(apiUrl);
      return apiResponse.data;
    } else {
      throw new Error('Unsupported URL domain');
    }

    const response = await axios.get(apiUrl);
    const { azauth, q, t } = response.data;

    const publisherResponse = await axios.get(`${publisherUrl}?azauth=${azauth}&q=${q}&t=${t}&opa=123&z=${encodeURIComponent(url)}`);
    const { password } = publisherResponse.data;

    return { password };
  } catch (error) {
    throw new Error(`Error bypassing URL: ${error.message}`);
  }
}

module.exports = {
  config: {
    name: "bypass",
    aliases: ['vuotlink'],
    version: "1.0.0",
    role: 0,
    author: "Nguyên Blue",
    info: "bypass link rút gọn",
    Category: "Tiện ích",
    guides: "[url]",
    cd: 5,
    images: []
  },
  onRun: async ({ event, api, args }) => {
    const url = args[0];

    if (!url) {
      return api.sendMessage('Các liên kết hỗ trợ:\n1. laymangay(.)net or com\n2. link68(.)net\n3. traffic123(.)net\n4. trafficuser(.)net\n5. linkvertise(.)com\n\n cách dùng: bypass [url]', event.threadID, event.messageID);
    }

    try {
      const result = await bypassUrl(url);
      api.sendMessage(`code: ${result.password || result.result}`, event.threadID, event.messageID);
    } catch (error) {
      api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
    }
  },
  onEvent: async () => {},
  onLoad: async () => {}
};
