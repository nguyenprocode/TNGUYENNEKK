const axios = require('axios');
const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "c-genshin",
  version: "2.0.2",
  role: 0,
  aithor: "tnt",
  info: "character genshin impact",
  Category: "Giải trí",
  guides: "c-genshin + id",
  cd: 0
};

module.exports.onRun = async function ({ api, event, args }) {
  const number = args.join("");
  if (!number) return api.sendMessage("Xem id nhân vật tại đây:https://apichatbot.onrender.com/genshin/list", event.threadID);

  try {
    const response = await axios.get(`https://apichatbot.onrender.com/genshin/info?id=${number}`);
    const { ID, name, story, element, birthday, countryside, sex, belong, audio, image } = response.data.character;

    const audioCallback = () => {
      const audioMessage = {
        body: `===[ GENSHIN IMPACT ]===\n> ID: ${ID}\n> Tên: ${name}\n> Tiểu sử: ${story}\n> Giới tính: ${sex}\n> Lãnh thổ: ${countryside}\n> Ngày sinh: ${birthday}\n> Hệ: ${element}\n> Thuộc: ${belong}`,
        attachment: fs.createReadStream(__dirname + "/cache/audio.mp3")
      };

      api.sendMessage(audioMessage, event.threadID, () => fs.unlinkSync(__dirname + "/cache/audio.mp3"));
    };

    const imageCallback = () => {
      const imageMessage = {
        body: `===[ GENSHIN IMAGE ]===\n> Tên: ${name}`,
        attachment: fs.createReadStream(__dirname + "/cache/image.jpg")
      };

      api.sendMessage(imageMessage, event.threadID, () => fs.unlinkSync(__dirname + "/cache/image.jpg"));
    };

    request(encodeURI(audio)).pipe(fs.createWriteStream(__dirname + "/cache/audio.mp3")).on("close", audioCallback);
    request(encodeURI(image)).pipe(fs.createWriteStream(__dirname + "/cache/image.jpg")).on("close", imageCallback);
  } catch (err) {
    console.log(err);
    api.sendMessage("Lỗi không nhận được data", event.threadID);
  }
};