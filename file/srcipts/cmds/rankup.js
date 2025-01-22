module.exports.config = {
	name: "rankup",
	version: "7.3.1",
	role: 1,
	author: "haha",
	info: "Thông báo khi người dùng lên level mới",
	Category: "Box chat",
	dependencies: {
		"fs-extra": ""
	},
	cooldowns: 2,
};

module.exports.onEvent = async function({ api, event, Currencies, Users }) {
	const { threadID, senderID } = event;
	const { loadImage, createCanvas } = require("canvas");
	const axios = require("axios");
	const fs = require("fs-extra");

	const expData = await Currencies.getData(senderID);
	let exp = expData.exp + 1;

	const curLevel = Math.floor((Math.sqrt(1 + (4 * exp / 3) + 1) / 2));
	const level = Math.floor((Math.sqrt(1 + (4 * (exp + 1) / 3) + 1) / 2));

	if (level > curLevel && level != 1) {
		const name = global.data.userName.get(senderID) || await Users.getNameUser(senderID);
		const msg = `🌏➣ Độ 𝐂𝐡ị𝐮 𝐂𝐡ơ𝐢 𝐂ủ𝐚 『 ${name} 』\n🌌➣ Đã Đạ𝐭 Đế𝐧 Đẳ𝐧𝐠 𝐂ấ𝐩 ${level} 𝐂ủ𝐚 𝐌ô𝐧 𝐏𝐡á𝐢 𝐍𝐡𝐢ề𝐮 𝐋ờ𝐢 ☻`;

		// Chọn hình nền ngẫu nhiên
		const backgrounds = [
			"https://i.imgur.com/mXmaIFr.jpeg",
			"https://i.imgur.com/SeLdZua.jpeg",
			"https://i.imgur.com/HrHPulp.jpeg",
			"https://i.imgur.com/zZpub9k.jpeg",
			"https://i.imgur.com/EP7gdQy.jpeg"
		];
		const backgroundURL = backgrounds[Math.floor(Math.random() * backgrounds.length)];

		// Tải ảnh đại diện và hình nền
		const token = global.account.token.EAAD6V7;
		const avatarURL = `https://graph.facebook.com/${senderID}/picture?width=720&height=720&access_token=${token}`;
		
		const [avatarRes, backgroundRes] = await Promise.all([
			axios.get(avatarURL, { responseType: "arraybuffer" }),
			axios.get(backgroundURL, { responseType: "arraybuffer" })
		]);

		const baseImage = await loadImage(backgroundRes.data);
		const baseAvatar = await loadImage(avatarRes.data);

		// Vẽ lên canvas
		const canvas = createCanvas(baseImage.width, baseImage.height);
		const ctx = canvas.getContext("2d");

		ctx.drawImage(baseImage, 0, 0, canvas.width, canvas.height);
		ctx.rotate(-25 * Math.PI / 180);
		ctx.drawImage(baseAvatar, 27.3, 103, 108, 108);

		// Chuyển canvas thành buffer
		const imageBuffer = canvas.toBuffer();

		// Gửi tin nhắn kèm hình ảnh
		api.sendMessage({
			body: msg,
			mentions: [{ tag: name, id: senderID }],
			attachment: imageBuffer
		}, threadID);

		// Cập nhật exp
		await Currencies.setData(senderID, { exp });
	}
};

module.exports.onRun = async function({ api, event, Threads }) {
	const { threadID, messageID } = event;
	const data = (await Threads.getData(threadID)).data;

	data.rankup = !data.rankup;
	await Threads.setData(threadID, { data });
	global.data.threadData.set(threadID, data);

	const status = data.rankup ? "[⚜️] ➜ 𝐁ậ𝐭" : "[⚜️] ➜ 𝐓ắ𝐭";
	return api.sendMessage(`${status} "𝐑𝐚𝐧𝐤𝐮𝐩 𝐒𝐮𝐜𝐜𝐞𝐬𝐬 🌋"`, threadID, messageID);
};
