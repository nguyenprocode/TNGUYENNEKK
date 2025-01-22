const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
    name: "dodeptrai",
    version: "1.0.0",
    role: 0,
    author: "DMH",
    info: "Kiểm tra độ đẹp trai của bạn",
    Category: "Giải trí",
    guides: "dodeptrai",
    cd: 3,
    dependencies: {
        "request": "",
        "fs": ""
    }
};

module.exports.onRun = async ({ event, api, args, Users }) => {
    const fs = require("fs-extra");
    const request = require("request");
    const specialID = '61564467696632'; // ID đặc biệt có độ đẹp trai vô hạn
    let tile;

    if (!args[0]) {
        tile = event.senderID === specialID ? 200 : Math.floor(Math.random() * 101);
        const id = event.senderID;
        const name = (await Users.getData(id)).name;
        const callback = () => api.sendMessage({
            body: `😎 Tỉ lệ độ đẹp trai của bạn ${name}\n[👱] Khoảng ${tile}% 😏`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        return request(encodeURI(`https://graph.facebook.com/${id}/picture?height=750&width=750&access_token=${global.account.token.EAAD6V7}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    } else if (Object.keys(event.mentions).length == 1) {
        const mentions = Object.keys(event.mentions);
        const mentionedID = mentions[0];
        tile = mentionedID === specialID ? 100 : Math.floor(Math.random() * 101);
        const name = (await Users.getData(mentionedID)).name;
        const callback = () => api.sendMessage({
            body: `😎 Tỉ lệ độ đẹp trai của ${name}\n[👱] Khoảng ${tile}% 😏`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        return request(encodeURI(`https://graph.facebook.com/${mentionedID}/picture?height=750&width=750&access_token=${global.account.token.EAAD6V7}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    } else {
        const idmen = !args[1] ? (event.type === "message_reply" ? event.messageReply.senderID : event.senderID) : args[0];
        tile = idmen === specialID ? 100 : Math.floor(Math.random() * 101);
        const name = (await Users.getData(idmen)).name;
        const callback = () => api.sendMessage({
            body: `😎 Tỉ lệ độ đẹp trai của ${name}\n[👱] Khoảng ${tile}% 😏`,
            attachment: fs.createReadStream(__dirname + "/cache/1.png")
        }, event.threadID, () => fs.unlinkSync(__dirname + "/cache/1.png"), event.messageID);
        return request(encodeURI(`https://graph.facebook.com/${idmen}/picture?height=750&width=750&access_token=${global.account.token.EAAD6V7}`))
            .pipe(fs.createWriteStream(__dirname + '/cache/1.png'))
            .on('close', () => callback());
    }
};
