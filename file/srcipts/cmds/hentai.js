const fs = require("fs");
const axios = require("axios");
const path = require("path");

module.exports.config = {
    name: "hentai",
    version: "1.0.0",
    role: 0,
    author: "XaviaTeam",
    info: "Cai deo gi vay?",
    Category: "Giải trí",
    guides: "[category]",
    cd: 3,
    dependencies: {
        "axios": "",
        "fs": "",
        "path": ""
    }
};

module.exports.languages = {
    "vi": {
        "invalidCategory": "Không hợp lệ, các danh mục hiện có:\n{categories}",
        "error": "Đã có lỗi xảy ra..."
    },
    "en": {
        "invalidCategory": "Invalid, available categories:\n{categories}",
        "error": "Error, try again later."
    },
    "ar": {
        "invalidCategory": "الفئات المتاحة غير صالحة:\n{categories}",
        "error": "خطأ ، حاول مرة أخرى في وقت لاحق..."
    }
}

const endpoints = ["waifu", "neko", "trap", "blowjob"];

module.exports.onRun = async function({ api, event, args, getText }) {
    try {
        const input = args[0]?.toLowerCase();
        if (!endpoints.includes(input)) {
            const availableCategories = endpoints.join(", ");
            const message = `Không hợp lệ, các danh mục hiện có:\n${availableCategories}`;
            return api.sendMessage(message, event.threadID, event.messageID);
        }

        const response = await axios.get(`https://api.waifu.pics/nsfw/${input}`);
        const data = response.data;

        if (!data.url) return api.sendMessage("Die API :v", event.threadID, event.messageID);

        const imageResponse = await axios.get(data.url, { responseType: 'arraybuffer' });
        const imageBuffer = imageResponse.data;

        const imagePath = path.join(__dirname, "cache", `${event.senderID}_${Date.now()}.jpg`);
        fs.writeFileSync(imagePath, imageBuffer);

        api.sendMessage({
            body: "Ngắm đi 😳\nTự động thu hồi sau 15s 🤓",
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, async (err, info) => {
          if (!err) {
            await new Promise(resolve => setTimeout(resolve, 15 * 1000));
            api.unsendMessage(info.messageID);
          }
        }, event.messageID);

        /*() => {
            fs.unlinkSync(imagePath);
        }, event.messageID);*/

    } catch (e) {
        console.error(e);
        return api.sendMessage("Đã có lỗi xảy ra...", event.threadID, event.messageID);
    }
}
