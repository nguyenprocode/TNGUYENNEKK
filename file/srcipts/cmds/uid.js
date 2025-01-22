module.exports.config = {
	name: "uid",
	version: "1.0.0",
	role: 0,
	author: "Mirai Team",
	info: "Lấy ID người dùng",
	Category: "Box chat",
	cd: 0
};

module.exports.onRun = async function({ api, event, args }) {
    const axios = require('axios'); 
    if(event.type == "message_reply") { 
	uid = event.messageReply.senderID
	return api.shareContact(`[😽]➜ Uid của bạn đây: ${uid}`, uid, event.threadID) }
    if (!args[0]) {return api.shareContact(`${event.senderID}`, event.senderID, event.threadID);}
    else {
	if (args[0].indexOf(".com/")!==-1) {
    const res_ID = await api.getUID(args[0]);  
    return api.shareContact(`${res_ID}`, res_ID, event.threadID) }
	else {
		for (var i = 0; i < Object.keys(event.mentions).length; i++) api.shareContact(`[😽]➜ Tên: ${Object.values(event.mentions)[i].replace('@', '')}\n[😽]➜ UID: ${Object.keys(event.mentions)[i]}`, event.mentions, event.threadID);
		return;
	}
}
}