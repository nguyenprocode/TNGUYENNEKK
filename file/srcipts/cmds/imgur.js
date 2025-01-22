const axios = require("axios");
class Imgur {
  constructor() {
    this.clientId = "fc9369e9aea767c", this.client = axios.create({
      baseURL: "https://api.imgur.com/3/",
      headers: {
        Authorization: `Client-ID ${this.clientId}`
      }
    })
  }
  async uploadImage(url) {
    return (await this.client.post("image", {
      image: url
    })).data.data.link
  }
}
class Modules extends Imgur {
  constructor() {
    super()
  }
  get config() {
    return {
      name: "imgur",
      info: "Upload image to imgur",
      version: "1.0.0",
      author: "Thiệu Trung Kiên",
      cd: 5,
      guides: "imgur <url>",
      Category: "Tiện ích",
      role: 0
    }
  }
  onRun = async ({ api, event }) => {
    var array = [];
    if ("message_reply" != event.type || event.messageReply.attachments.length < 0) return api.sendMessage("[⚜️]➜ Vui lòng reply vào bức ảnh bạn cần tải lên", event.threadID, event.messageID);
    for (let { url } of event.messageReply.attachments) await this.uploadImage(url).then((res => array.push(res))).catch((err => console.log(err)));
    return api.sendMessage(`${array.join("\n")}`, event.threadID, event.messageID)
  }
}
module.exports = new Modules;
