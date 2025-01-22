/*
@author: Hà Mạnh Hùng 
=> Do not change credit.
*/

const { loadImage, createCanvas } = require("canvas");
const fs = require("fs");
const axios = require("axios");

module.exports.config = {
    name: "money",
    version: "1.0.0",
    info: "Show số tiền hiện có với phong cách MB Bank.",
    guides: "/money [Tag]",
    Category: "Tiện ích",
    author: "HMHung",
    role: 0
};

module.exports.onRun = async function({ api, event, args, Users, Currencies }) {
    const backgroundUrl = "https://i.imgur.com/zc1hzaj.png";
    const { threadID: tid, messageID: mid, senderID: sid, mentions } = event;
    const fontDirectory = './system/data/tad/';
    //const backgroundPath = fontDirectory + 'mbbank.png';

    let targetID = sid;
    if (args[0] && Object.keys(mentions).length === 1) {
        targetID = Object.keys(mentions)[0];
    }

    const backgroundPath = fontDirectory + `${targetID}.png`;

    const dataUser = await Currencies.getData(targetID);
    const money = dataUser.money.toLocaleString();

    if (!fs.existsSync(backgroundPath)) {
        const backgroundImage = (await axios.get(encodeURI(backgroundUrl), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(backgroundPath, Buffer.from(backgroundImage));
    }

    const backgroundImage = await loadImage(backgroundPath);
    const canvas = createCanvas(backgroundImage.width, backgroundImage.height);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    const now = new Date();
    const utcOffset = 7;
    now.setHours(now.getHours() + utcOffset);
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;

    ctx.font = "17px UTM";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#FFFFFF";
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText(currentTime, 113, 33);
    ctx.fillText(currentTime, 113, 33);

    const userName = await Users.getNameUser(targetID);
    
    ctx.font = "35px UTM";
    const textWidth = ctx.measureText(userName).width;
    const xPosition = (canvas.width - textWidth) / 2;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.strokeText(userName, xPosition, 230);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(userName, xPosition, 230);

    ctx.font = "25px UTM";
    ctx.strokeStyle = "#00008B";
    ctx.lineWidth = 1;
    ctx.strokeText(`${money}`, 120, 435);
    ctx.fillStyle = "#00008B";
    ctx.fillText(`${money}`, 120, 435);

    const moneyWidth = ctx.measureText(`${money}`).width;

    ctx.font = "15px UTM";
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#808080";
    ctx.strokeText("VND", 120 + moneyWidth + 5, 435);
    ctx.fillStyle = "#808080";
    ctx.fillText("VND", 120 + moneyWidth + 5, 435);

    const finalImageBuffer = canvas.toBuffer();
    fs.writeFileSync(backgroundPath, finalImageBuffer);

    const replyMsg = `Số dư của bạn ${userName}:`;

    api.sendMessage({
        body: replyMsg,
        attachment: fs.createReadStream(backgroundPath),
    }, tid, () => {
        fs.unlinkSync(backgroundPath);
    }, mid);
};
