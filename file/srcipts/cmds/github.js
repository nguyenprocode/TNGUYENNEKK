module.exports.config = {
	name: "github",
	version: "1.0.0",
	role: 0,
	author: "NTKhang, HMHung",
	info: "Xem thông tin người dùng GitHub công khai bằng tên người dùng",
	Category: "Tiện ích",
	guides: "[tên người dùng GitHub]",
	cd: 5
};

module.exports.languages = {
	"vi": {
		missingUsername: "Tên người dùng GitHub không được để trống!",
		userNotFound: "Không tìm thấy người dùng GitHub mang tên: %1!",
		errorOccurred: "Đã xảy ra lỗi khi lấy thông tin từ GitHub!",
		infoMessage: ">> %1 Thông tin người dùng GitHub! <<\n\nUsername: %2\nID: %3\nBio: %4\nPublic Repositories: %5\nFollowers: %6\nFollowing: %7\nLocation: %8\nAccount Created: %9\nAvatar:"
	},
	"en": {
		missingUsername: "GitHub username cannot be empty!",
		userNotFound: "Could not find GitHub user with the username: %1!",
		errorOccurred: "An error occurred while retrieving information from GitHub!",
		infoMessage: ">> %1 GitHub User Information! <<\n\nUsername: %2\nID: %3\nBio: %4\nPublic Repositories: %5\nFollowers: %6\nFollowing: %7\nLocation: %8\nAccount Created: %9\nAvatar:"
	}
};

module.exports.onRun = async function({ api, event, args }) {
	if (!args[0]) {
		return api.sendMessage("Tên người dùng GitHub không được để trống!", event.threadID, event.messageID);
	}

	const axios = require("axios");
	const moment = require("moment-timezone");
	const fs = require("fs-extra");
	const path = require("path");

	try {
		const response = await axios.get(`https://api.github.com/users/${encodeURI(args.join(' '))}`);
		const body = response.data;

		if (body.message) {
			return api.sendMessage(`Không tìm thấy người dùng GitHub mang tên: ${args.join(" ")}!`, event.threadID, event.messageID);
		}

		let { login, avatar_url, id, public_repos, followers, following, location, created_at, bio } = body;
		const info = `>> ${login} Thông tin người dùng GitHub! <<\n\nUsername: ${login}\nID: ${id}\nBio: ${bio || "No Bio"}\nPublic Repositories: ${public_repos || "None"}\nFollowers: ${followers}\nFollowing: ${following}\nLocation: ${location || "No Location"}\nAccount Created: ${moment(created_at).tz("Asia/Ho_Chi_Minh").format("DD/MM/YYYY HH:mm:ss")} (UTC +7)\nAvatar:`;

		const filePath = path.resolve(__dirname, 'cache', 'avatargithub.png');
		const writer = fs.createWriteStream(filePath);

		const downloadResponse = await axios({
			url: avatar_url,
			method: 'GET',
			responseType: 'stream'
		});

		downloadResponse.data.pipe(writer);

		writer.on('finish', () => {
			api.sendMessage({
				body: info,
				attachment: fs.createReadStream(filePath)
			}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
		});

		writer.on('error', err => {
			console.error(err);
			api.sendMessage("Đã xảy ra lỗi khi lấy thông tin từ GitHub!", event.threadID, event.messageID);
		});
	} catch (error) {
		api.sendMessage("Đã xảy ra lỗi khi lấy thông tin từ GitHub!", event.threadID, event.messageID);
		console.error(error);
	}
}
