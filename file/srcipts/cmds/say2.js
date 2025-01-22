const { setSourceMapsEnabled } = require("process");

this.config = {
	name: "say2",
	version: "1.0.0",
	author: "ntkhang, hmhung",
	cd: 5,
	role: 0,
	info: "abc",
	Category: "Tiện ích",
};


module.exports.onRun = async function ({ api, args, message, event, download, globalGoat }) {
		const fs = require("fs-extra");
		const axios = require('axios');
		const qs = require('querystring');
		const apikey = "nWaXzdlpZzdMKdcjz1DCQ2xXH5tGxm6r";

		let content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");
		if (!content) return api.sendMessage("Vui lòng nhập một đoạn văn bản hoặc reply một tin nhắn!", event.threadID, event.messageID);

		const url = "https://api.zalo.ai/v1/tts/synthesize";
		const path = __dirname + "/cache/texttospeech.mp3";
		const datapush = {
			input: content.replace(/\n/g, " "),
			speed: 0.8,
			encode_type: 1,
			speaker_id: 4// 0 | 1 | 2 | 3
		};

		const result = await axios.post(url, qs.stringify(datapush), {
			headers: {
				apikey
			}
		});
		const link = result.data.data.url;

		let getfile;
		let ERROR = true;
		while (ERROR == true) {
			try {
				getfile = (await axios.get(link, { responseType: "arraybuffer" })).data;
				ERROR = false;
			}
			catch (e) {
				continue;
			}
		}
		fs.writeFileSync(path, Buffer.from(getfile));
		api.sendMessage({ attachment: fs.createReadStream(path) }, event.threadID, () => fs.unlink(path));
	}
