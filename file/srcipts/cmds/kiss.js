/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/



module.exports.config = {
    name: "kiss",
    version: "2.0.0",
    role: 0,
    author: "Yae Miko",
    info: "Hôn trộm và kiếm tiền",
    Category: "Giải trí",
    guides: "[tag]",
    cd: 2000,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
    const { resolve } = require("path");
    const { existsSync, mkdirSync } = require("fs-extra");
    const { downloadFile } = global.utils;
    const dirMaterial = __dirname + `/cache/`;
    const path = resolve(__dirname, 'cache', 'hon.png');
    if (!existsSync(dirMaterial + "")) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/BtSlsSS.jpg", path);

}

async function makeImage({ one, two }) {
    const fs = require("fs-extra");
    const path = require("path");
    const axios = require("axios"); 
    const jimp = require("jimp");
    const __root = path.resolve(__dirname, "cache");

    let hon_img = await jimp.read(__root + "/hon.png");
    let pathImg = __root + `/hon_${one}_${two}.png`;
    let avatarOne = __root + `/avt_${one}.png`;
    let avatarTwo = __root + `/avt_${two}.png`;
    let token = global.account.token.EAAD6V7;

    let getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));
    
    let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));
    
    let circleOne = await jimp.read(await circle(avatarOne));
    let circleTwo = await jimp.read(await circle(avatarTwo));
    hon_img.resize(700, 440).composite(circleOne.resize(200, 200), 390, 23).composite(circleTwo.resize(180, 180), 140, 80);
    
    let raw = await hon_img.getBufferAsync("image/png");
    
    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);
    
    return pathImg;
}
async function circle(image) {
    const jimp = require("jimp");
    image = await jimp.read(image);
    image.circle();
    return await image.getBufferAsync("image/png");
}

module.exports.onRun = async function ({ event, api, args, Currencies }) { 
    const fs = requure("fs-extra");
    const ae = ["💚Yeuanh❤","💛Yeuem💜"];
    const hc = Math.floor(Math.random() * 101) + 10;
    const rd = Math.floor(Math.random() * 1000000) + 100;
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions);
    var one = senderID, two = mention[0];
  await Currencies.increaseMoney(event.senderID, parseInt(hc*rd));
  
  if (!two) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);
  else {
        return makeImage({ one, two }).then(path => api.sendMessage({ body: `${ae[Math.floor(Math.random() * ae.length)]}\n Độ hảo cảm đối với bạn sau khi bị hôn trộm là ${hc} %\n + ${((hc)*rd)} $`, attachment: fs.createReadStream(path)}, threadID, () => fs.unlinkSync(path), messageID));
  }
}