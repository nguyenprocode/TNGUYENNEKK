module.exports.config = {
    name: "loli",
    version: "1.0.0",
    role: 0,
    author: "XaviaTeam",
    info: "Gửi ảnh loli",
    Category: "Giải trí",
   guides: "",
    cd: 5
};

module.exports.onRun = async function({ api, event }) {
    const axios = require('axios');
    const fs = require('fs');
    const request = require('request');
    const { threadID, messageID } = event;

    try {
        const res = await axios.get(`https://xva-api.up.railway.app/api/loli`);
        const url = res.data.url;
        const imgStream = request(url).pipe(fs.createWriteStream(__dirname + "/cache/loli.jpg"));

        imgStream.on("close", () => {
            api.sendMessage({
                body: "Không biết nói gì!",
                attachment: fs.createReadStream(__dirname + "/cache/loli.jpg")
            }, threadID, () => fs.unlinkSync(__dirname + "/cache/loli.jpg"), messageID);
        });

    } catch (error) {
        api.sendMessage("Error!", threadID, messageID);
    }
};
