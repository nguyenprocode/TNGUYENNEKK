const axios = require("axios");
const fs = require("fs");
const path = require("path");

class Imgur {
  constructor() {
    this.clientId = "fc9369e9aea767c";
    this.client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${this.clientId}`
      }
    });
  }

  async uploadImage(url) {
    return (await this.client.post("image", {
      image: url
    })).data.data.link;
  }
}

class Modules extends Imgur {
  constructor() {
    super();
  }

  get config() {
    return {
      name: "catbox",
      info: "upload file to Catbox",
      version: "1.0.0",
      author: "Thiệu Trung Kiên",
      cooldown: 5,
      guides: "catbox <url>",
      Category: "Tiện ích",
      role: 0
    };
  }

  onRun = async ({ api, event, args }) => {
    let array = [];
    let d = []; // Định nghĩa biến d
    const p = path.join(__dirname, 'data.json'); // Định nghĩa biến p với đường dẫn tệp JSON

    if (event.type !== "message_reply" || !event.messageReply.attachments.length) {
      return api.sendMessage("[⚜️]➜ Vui lòng reply vào bức ảnh bạn cần tải lên", event.threadID, event.messageID);
    }

    const l = event.messageReply.attachments.map(a => a.url);
    if (!l.length) return api.sendMessage("❎ Không tìm thấy URL hợp lệ để tải lên!", event.threadID, event.messageID);

    try {
      const u = await Promise.all(l.map(async link => await global.api.catbox(link)));
      d.push(...u);
      fs.writeFileSync(p, JSON.stringify(d, null, 2), 'utf-8');
      api.sendMessage(`${u}`, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error:", error);
      api.sendMessage("❎ Lỗi khi tải lên!", event.threadID, event.messageID);
    }

    /*const uploadPromises = event.messageReply.attachments.map(async ({ url }) => {
      try {
        const res = await this.uploadImage(url);
        array.push(res);
      } catch (err) {
        console.log(err);
      }
    });*/

    await Promise.all(uploadPromises); 
  }
}

module.exports = new Modules();
