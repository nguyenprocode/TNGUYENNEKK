module.exports.config = {
    name: "cap",
    version: "1.0.0",
    role: 0,
    author: "Mirai Team",
    info: "Screenshot một trang web nào đó (NOT ALLOW NSFW PAGE)",
    Category: "Tiện ích",
    guides: "[url site]",
    cd: 5,
    dependencies: {
        "fs-extra": "",
        "path": "",
        "url": ""
    }
};

module.exports.onLoad = async () => {
    const { existsSync } = require("fs-extra");
    const { resolve } = require("path");

    const path = resolve(__dirname, "cache", "pornlist.txt");

    if (!existsSync(path)) return await global.utils.downloadFile("https://raw.githubusercontent.com/blocklistproject/Lists/master/porn.txt", path);
    else return;
};

module.exports.onRun = async ({ event, api, args }) => {
    const { readFileSync, unlinkSync } = require("fs-extra");
    const url = require("url");

    if (!global.moduleData.pornList) global.moduleData.pornList = readFileSync(__dirname + "/cache/pornlist.txt", "utf-8").split('\n').filter(site => site && !site.startsWith('#')).map(site => site.replace(/^(0.0.0.0 )/, ''));
    const urlParsed = url.parse(args.join(" "));

    if (global.moduleData.pornList.some(pornURL => urlParsed.host == pornURL)) return api.sendMessage("Trang web bạn nhập không an toàn!! (NSFW PAGE)", event.threadID, event.messageID);

    try {
        const imageUrl = `https://image.thum.io/get/width/1920/crop/400/fullpage/noanimate/${args.join(" ")}`;
        const path = __dirname + `/cache/${event.threadID}-${event.senderID}s.png`;

        // Tạo file ảnh bằng cách stream từ URL
        const attachment = await global.tools.streamURL(imageUrl, 'png');
        api.sendMessage({ attachment }, event.threadID, (err) => {
            if (err) console.error(err);
            // Xóa tệp sau khi gửi thành công
            unlinkSync(path);
        });
    } catch (error) {
        console.error(error);
        return api.sendMessage("Không tìm thấy url này, định dạng không đúng ?", event.threadID, event.messageID);
    }
};
