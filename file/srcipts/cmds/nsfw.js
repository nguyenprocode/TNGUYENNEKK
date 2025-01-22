module.exports.config = {
	name: "nsfw",
	version: "1.0.0",
	role: 1,
	author: "Mirai Team",
	info: "Bật tắt quyền sử dụng các lệnh NSFW",
	Category: "Box chat",
	cd: 5,
};

module.exports.languages = {
    "vi": {
        "returnSuccessEnable": "Đã cho phép thành viên sử dụng lệnh NSFW!",
        "returnSuccessDisable": `Đã tắt chế độ NSFW!`,
        "error": "Đã có lỗi xảy ra, vui lòng thử lại sau"
    },
    "en": {
        "returnSuccessEnable": "Success enable NSFW command for this group",
        "returnSuccessDisable": "Success disable NSFW command for this group",
        "error": "Error! An error occurred. Please try again later!"
    }
}

module.exports.onRun = async function ({ event, api, Threads, getText }) {
    const { threadID, messageID } = event;
    const { getData, setData } = Threads;
    var type;

    try {
        let data = (await getData(threadID)).data || {};
        if (typeof data == "undefined" || data.NSFW == false) {
            data.NSFW = true;
            global.data.threadAllowNSFW.push(threadID);
            type = "on"
        }
        else {
            data.NSFW = false;
            global.data.threadAllowNSFW = global.data.threadAllowNSFW.filter(item => item != threadID);
        }
        await setData(threadID, { data });
        return api.sendMessage((type == "on") ? "Đã cho phép thành viên sử dụng lệnh NSFW!" : "Tắt thành công mode NSFW", threadID, messageID);
    } catch (e) { console.log(e); return api.sendMessage(getText("error"), threadID, messageID) }
}