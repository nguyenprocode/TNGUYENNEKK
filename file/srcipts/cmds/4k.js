const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');

module.exports = {
  config: {
    name: "4k",
    author: "Nguyên Blue, HMHung",
    Category: "Tiện ích",
    version: "1.0",
    hasPrefix: true,
    role: 0,
    cd: 3,
    info: "Làm Nét Ảnh Người Thật"
  },
  
  onRun: async ({ api, event }) => {
    if (!event.messageReply || !event.messageReply.attachments) {
      return api.sendMessage("⚠️ Hình ảnh không hợp lệ, vui lòng phản hồi một ảnh nào đó", event.threadID);
    }

    const attachments = event.messageReply.attachments;
    if (attachments.length === 0) {
      return api.sendMessage("⚠️ Không có hình ảnh được phản hồi", event.threadID);
    }

    const imageAttachment = attachments[0];
    if (!imageAttachment.url) {
      return api.sendMessage("⚠️ Không tìm thấy đường dẫn hình ảnh", event.threadID);
    }

    try {
      const response = await axios.get(imageAttachment.url, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      const filename = './srcipts/cmds/cache/abc.jpg';
      fs.writeFileSync(filename, buffer);

      const form = new FormData();
      form.append('file', fs.createReadStream(filename));

      const headers = {
        ...form.getHeaders(), // Sử dụng đúng header từ form-data
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,vi;q=0.8',
        'Origin': 'https://taoanhdep.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
      };

      const response2 = await axios.post('https://taoanhdep.com/public/net-anh-nguoi-2.php', form, { headers });

      console.log(`API Response: ${response2.status} ${response2.statusText}`);
      console.log(`API Response Data: ${response2.data}`);

      const imageUrl = response2.data;
      if (!imageUrl) {
        return api.sendMessage("⚠️ Không thể làm nét ảnh", event.threadID);
      }

      const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const outputFilename = './srcipts/cmds/cache/xyz.jpg';
      fs.writeFileSync(outputFilename, imageResponse.data);

      api.sendMessage({
        body: 'Làm Nét Thành Công!',
        attachment: fs.createReadStream(outputFilename)
      }, event.threadID);
    } catch (error) {
      console.error(error);
      return api.sendMessage("⚠️ Có lỗi xảy ra", event.threadID);
    }
  }
};
