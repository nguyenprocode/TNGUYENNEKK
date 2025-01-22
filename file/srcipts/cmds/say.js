const { createReadStream, unlinkSync, writeFileSync } = require("fs-extra");
const { resolve } = require("path");
const axios = require('axios');

module.exports.config = {
	name: "say",
	version: "1.0.1",
	role: 0,
	author: "Mirai Team",
	info: "Khiến bot trả về file âm thanh của chị google thông qua văn bản",
	Category: "Tiện ích",
	guides: "[ru/en/ko/ja] [Text]",
	cd: 5,
	dependencies: {
		"path": "",
		"fs-extra": ""
	}
};

module.exports.onRun = async function({ api, event, args }) {
	try {
		const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
		
		// Tách phần ngôn ngữ và nội dung văn bản
		var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		var languageToSay = (["ru", "en", "ko", "ja"].some(item => content.indexOf(item) == 0)) ? content.slice(0, content.indexOf(" ")) : global.config.language;
		var msg = (languageToSay != global.config.language) ? content.slice(3, content.length) : content;

		// Giới hạn ký tự của Google TTS
		const maxLength = 200;
		let audioData = Buffer.alloc(0);

		// Chia nội dung nếu vượt quá giới hạn
		const chunks = [];
		while (msg.length > 0) {
			const chunk = msg.slice(0, maxLength);
			chunks.push(chunk);
			msg = msg.slice(maxLength);
		}

		// Tải xuống và ghép các phần âm thanh lại
		for (const chunk of chunks) {
			const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(chunk)}&tl=${languageToSay}&client=tw-ob`;
			const response = await axios.get(url, { responseType: 'arraybuffer' });
			audioData = Buffer.concat([audioData, response.data]);
		}

		// Lưu dữ liệu âm thanh vào file
		writeFileSync(path, audioData);

		// Gửi file âm thanh và xóa file sau khi gửi
		return api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
	} catch (e) {
		return console.log(e);
	}
};
