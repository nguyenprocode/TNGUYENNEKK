/**
* @author ProCoderMew
* @warn Do not edit code or edit credits
*/

const fs = require("fs-extra");
const { resolve } = require("path");
const axios = require("axios");
const jimp = require("jimp");

module.exports.config = {
    name: "doggy",
    version: "2.0.0",
    role: 0,
    author: "DinhPhuc",
    info: "",
    Category: "Giải trí",
    guides: "[tag]",
    cd: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync, mkdirSync } = fs;
    const { downloadFile } = global.utils;
    const dirMaterial = resolve(__dirname, 'cache/canvas');
    const path = resolve(dirMaterial, 'doggy2.png');
    if (!existsSync(dirMaterial)) mkdirSync(dirMaterial, { recursive: true });
    if (!existsSync(path)) await downloadFile("https://i.imgur.com/mguIr9x.png", path);
};

async function makeImage({ one, two }) {
	let token = global.account.token.EAAD6V7;
    const __root = resolve(__dirname, "cache", "canvas");
    const doggy_img = await jimp.read(resolve(__root, "doggy2.png"));
    const pathImg = resolve(__root, `doggy_${one}_${two}.png`);
    const avatarOne = resolve(__root, `avt_${one}.png`);
    const avatarTwo = resolve(__root, `avt_${two}.png`);

    const getAvatarOne = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=${token}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

    const getAvatarTwo = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=${token}`, { responseType: 'arraybuffer' })).data;
    fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

    const circleOne = await jimp.read(await circle(avatarOne));
    const circleTwo = await jimp.read(await circle(avatarTwo));

    doggy_img.resize(500, 500)
        .composite(circleOne.resize(70, 70), 217, 152)
        .composite(circleTwo.resize(80, 80), 106, 269);

    const raw = await doggy_img.getBufferAsync("image/png");

    fs.writeFileSync(pathImg, raw);
    fs.unlinkSync(avatarOne);
    fs.unlinkSync(avatarTwo);

    return pathImg;
}

async function circle(image) {
    const img = await jimp.read(image);
    img.circle();
    return await img.getBufferAsync("image/png");
}

module.exports.onRun = async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const mention = Object.keys(event.mentions)[0];
    const tag = event.mentions[mention]?.replace("@", "");

    if (!mention) return api.sendMessage("Vui lòng tag 1 người", threadID, messageID);

    const one = senderID;
    const two = mention;

    return makeImage({ one, two }).then(path => 
        api.sendMessage({
            body: `Ơ kìa em:)) ${tag}`,
            mentions: [{
                tag: tag,
                id: mention
            }],
            attachment: fs.createReadStream(path)
        }, threadID, () => fs.unlinkSync(path), messageID)
    );
};
