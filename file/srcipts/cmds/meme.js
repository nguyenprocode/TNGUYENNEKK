const axios = require("axios");
const fs = require("fs");

module.exports = {
    config: {
        name: "meme",
        version: "1.0.0",
        info: ":))",
        guides: "meme",
        Category: "Giải trí",
        role: 0,
        cd: 5,
        author: "hmhung"
    },
    onRun: async (o) => {
        const { threadID: t, messageID: m, senderID: s } = o.event;
        const send = (msg) => o.api.sendMessage(msg, t, m);
        const memedark = require("./../../system/data/media/memedark.json");
        const memenhanvan = require("./../../system/data/media/memenhanvan.json");
        const memelord = require("./../../system/data/media/memelord.json");
        const hungdev = ["dark", "lord", "nhanvan"];
        const input = o.args[0]?.toLowerCase();

        if (!hungdev.includes(input))
            return send("Danh mục hiện có: dark, lord, nhanvan\n EX: /meme dark");

        let memeList;
        let categoryName;

        switch (input) {
            case "dark":
                memeList = memedark;
                categoryName = "Meme dark";
                break;
            case "lord":
                memeList = memelord;
                categoryName = "Meme lord";
                break;
            case "nhanvan":
                memeList = memenhanvan;
                categoryName = "Meme nhân văn";
                break;
        }

        const randomMeme = memeList[Math.floor(Math.random() * memeList.length)];
        
        const getFileType = (url) => {
            const ext = url.split('.').pop();
            return ext;
        };

        const fileType = getFileType(randomMeme); 

        const callback = async () => {
            o.api.sendMessage({
                body: `${categoryName}:`,
                attachment: await global.tools.streamURL(randomMeme, fileType)
            }, t, m);
        };

        callback();
    }
};
