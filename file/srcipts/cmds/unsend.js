module.exports.config = {
	name: "gỡ",
	version: "1.0.0", 
	aliases: ["unsend"],
	role: 1,
	author: "HungCatMoi",
	info: "Gỡ tin nhắn của Bot",
	Category: "Box chat", 
	guides: "gỡ",
	hasPrefix: false,
	cd: 0,
	dependencies: [] 
};

module.exports.onRun = async function({ api, event, args, Users }) {
	if(!event.messageReply) return
	if (event.messageReply.senderID != api.getCurrentUserID()) return api.sendMessage(getText('unsendErr1'), event.threadID, event.messageID);
			if (event.type != "message_reply") return api.sendMessage(getText('unsendErr2'), event.threadID, event.messageID);
			return api.unsendMessage(event.messageReply.messageID, err => (err) ? api.sendMessage(getText('error'), event.threadID, event.messageID) : '');
		}
