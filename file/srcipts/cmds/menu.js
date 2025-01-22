this.config = {
    name: "menu",
    version: "1.1.1",
    aliases: ["help"],
    role: 0,
    author: "Niio, Hùng deeptry",
    info: "Xem danh sách lệnh và info",
    Category: "Tiện ích",
    guides: "[tên lệnh/all]",
    cd: 0
};
this.languages = {
    "vi": {},
    "en": {}
}
this.onRun = async function({ api, event, args }) {
    try {
        const { threadID: tid, messageID: mid, senderID: sid } = event;
        var type = !args[0] ? "" : args[0].toLowerCase();
        var msg = "";
        const cmds = global.Seiko.commands;
        const TIDdata = global.data.threadData.get(tid) || {};
        const moment = require("moment-timezone");
        var thu = moment.tz('Asia/Ho_Chi_Minh').format('dddd');
        if (thu == 'Sunday') thu = 'Chủ Nhật';
        if (thu == 'Monday') thu = 'Thứ Hai';
        if (thu == 'Tuesday') thu = 'Thứ Ba';
        if (thu == 'Wednesday') thu = 'Thứ Tư';
        if (thu == "Thursday") thu = 'Thứ Năm';
        if (thu == 'Friday') thu = 'Thứ Sáu';
        if (thu == 'Saturday') thu = 'Thứ Bảy';
        const time = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:s | DD/MM/YYYY");
        const admin = global.config.ADMINBOT;
        const NameBot = global.config.BOTNAME;
        const version = global.config.version;
        const axios = require('axios');
        const fs = require('fs-extra');

        var prefix = TIDdata.PREFIX || global.config.PREFIX;

        if (type == "all") {
            const commandsList = Array.from(cmds.values()).map((cmd, index) => {
                return `${index + 1}. ${cmd.config.name}\n📝 Mô tả: ${cmd.config.info}\n\n`;
            }).join('');
            return api.sendMessage(commandsList, tid, mid);
        }

        if (type) {
            const command = Array.from(cmds.values()).find(cmd => cmd.config.name.toLowerCase() === type);
            if (!command) {
                const stringSimilarity = require('string-similarity');
                const commandName = args.shift().toLowerCase() || "";
                const commandValues = Array.from(cmds.keys());
                const checker = stringSimilarity.findBestMatch(commandName, commandValues);
                if (checker.bestMatch.rating >= 0.5) command = cmds.get(checker.bestMatch.target);
                msg = `⚠️ Không tìm thấy lệnh '${type}' trong hệ thống.\n📌 Lệnh gần giống được tìm thấy '${checker.bestMatch.target}'`;
                return api.sendMessage(msg, tid, mid);
            }
            const cmd = command.config;
            const varNoname = cmd.aliases ? cmd.aliases.join(", ") : "Không có";
msg = `[ HƯỚNG DẪN SỬ DỤNG ]\n\n📜 Tên lệnh: ${cmd.name}\n 💤 Tên khác: ${varNoname}\n 🕹️ Phiên bản: ${cmd.version}\n🔑 Quyền Hạn: ${premssionTxt(cmd.role)}\n📝 Mô Tả: ${cmd.info}\n🏘️ Nhóm: ${cmd.Category}\n📌 Cách Dùng: ${cmd.guides}\n⏳ Cooldowns: ${cmd.cd}s`;
return api.sendMessage(msg, tid, mid);

        } else {
            const commandsArray = Array.from(cmds.values()).map(cmd => cmd.config);
            const array = [];
            commandsArray.forEach(cmd => {
                const { Category, name: nameModule } = cmd;
                const find = array.find(i => i.cmdCategory == Category);
                if (!find) {
                    array.push({
                        cmdCategory: Category,
                        nameModule: [nameModule]
                    });
                } else {
                    find.nameModule.push(nameModule);
                }
            });
            array.sort(sortCompare("nameModule"));
            array.forEach(cmd => {
                if (['Admin', 'NO PREFIX'].includes(cmd.cmdCategory.toUpperCase()) && !admin.includes(sid)) return;
                msg += `[ ${cmd.cmdCategory.toUpperCase()} ]\n📝 Tổng lệnh: ${cmd.nameModule.length} lệnh\n${cmd.nameModule.join(", ")}\n\n`;
            });
            msg += `📝 Tổng số lệnh: ${cmds.size} lệnh\n👤 Tổng số admin bot: ${admin.length}\n👾 Tên Bot: ${NameBot}\n🕹️ Phiên bản: ${version}\n⏰ Hôm nay là: ${thu}\n⏱️ Thời gian: ${time}\n${prefix}help + tên lệnh để xem chi tiết\n${prefix}help + all để xem tất cả lệnh`;
            return api.sendMessage({ body: msg }, tid, mid);
        }
    } catch (err) {
        console.error(`Đã xảy ra lỗi trong lệnh abc: ${err.message}`);
        api.sendMessage(`❌ Đã xảy ra lỗi: ${err.message}`, event.threadID, event.messageID);
    }
};

function sortCompare(k) {
    return function (a, b) {
        return (a[k].length > b[k].length ? 1 : a[k].length < b[k].length ? -1 : 0) * -1;
    };
}

function premssionTxt(a) {
    return a == 0 ? 'Thành Viên' : a == 1 ? 'Quản Trị Viên Nhóm' : a == 2 ? 'ADMINBOT' : 'Người Điều Hành';
}
