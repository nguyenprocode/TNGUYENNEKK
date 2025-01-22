const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "dogay",
    version: "1.0.0",
    role: 0,
    author: "DMH",
    info: "Kiểm tra độ gay của bạn",
    Category: "Giải trí",
    guides: "doga",
    cd: 3,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.onRun = async ({ event, api, Currencies, args, Users }) => {
    let tile = Math.floor(Math.random() * 101);

    // Đặt ID đặc biệt với tỷ lệ 0%
    const specialID = "61564467696632";
    let id;

    if (!args[0]) {
        id = event.senderID;
    } else if (Object.keys(event.mentions).length === 1) {
        id = Object.keys(event.mentions)[0];
    } else {
        id = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
    }

    if (!id) {
        return api.sendMessage("Không thể xác định người dùng.", event.threadID, event.messageID);
    }

    // Đặt tỷ lệ đặc biệt cho ID cụ thể
    if (id === specialID) {
        tile = 0;
    }

    const token = global.account.token.EAAD6V7;
    const name = (await Users.getData(id)).name;
    const imagePath = __dirname + "/cache/1.png";

    const callback = () => {
        api.sendMessage({
            body: `🌈 Tỉ lệ độ gay của bạn ${name}\n[🌟] Khoảng ${tile}% 😏`,
            attachment: fs.createReadStream(imagePath)
        }, event.threadID, () => fs.unlinkSync(imagePath), event.messageID);
    };

    request(encodeURI(`https://graph.facebook.com/${id}/picture?height=750&width=750&access_token=${token}`))
        .pipe(fs.createWriteStream(imagePath))
        .on('close', callback)
        .on('error', (err) => {
            console.error('Error downloading image:', err);
            api.sendMessage("Đã xảy ra lỗi khi tải ảnh.", event.threadID, event.messageID);
        });
};
