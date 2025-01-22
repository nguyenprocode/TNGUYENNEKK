const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
    name: "fluxus",
    version: "1.0.0",
    role: 0,
    author: "Hung deeptry",
    info: "Bypass key flusuck",
    Category: "Tiện ích",
    guides: "fluxus <link>",
    cd: 5,
};

module.exports.onRun = async function({ api, event, args }) {
    const { threadID, messageID } = event;
    const input = args.join(" ");

    if (!input) {
        return api.sendMessage("Thiếu gì thì diền đó!\n/fluxus + link getkey", threadID, messageID);
    }

    try {
        const res = await axios.get(`https://stickx.top/key-fluxus/?url=${encodeURIComponent(input)}`, {
            timeout: 120000
        });

        const $ = cheerio.load(res.data);
        const key = $('h1').eq(2).text(); // Lấy text từ thẻ h1 thứ 3

        if (key) {
            await api.sendMessage(
                `[ Fluxus Key Bypasser ]
────────────────
Key: ${key}`, threadID, messageID);
        } else {
            await api.sendMessage("Không tìm thấy key trong thẻ h1 thứ 3.", threadID, messageID);
        }
    } catch (e) {
        console.error("Error:", e);
        await api.sendMessage("❌ Đã có lỗi xảy ra!", threadID, messageID);
    }
};
