module.exports.config = {
	name: "bantho",
	version: "1.0.1",
	role: 0,
	author: "quên - rework by DMH dzai",
	info: "Ảnh bàn thờ của đứa tag",
	Category: "Giải trí",
	guides: "@tag",
	cd: 5,
	dependencies: {
	  "fs-extra": "",
	  "axios": "",
	  "canvas" :"",
	  "jimp": "",
	  "node-superfetch": ""
	}
};

module.exports.circle = async (image) => {
	  const jimp = require('jimp');
  	image = await jimp.read(image);
  	image.circle();
  	return await image.getBufferAsync("image/png");
};

module.exports.onRun = async ({ event, api, args, Users }) => {
try {
  const Canvas = require('canvas');
  const request = require("node-superfetch");
  const jimp = require("jimp");
  const fs = require("fs-extra");
  var path_toilet = __dirname+'/cache/bantho.png'; 
  var id = Object.keys(event.mentions)[0] || event.senderID;
  const canvas = Canvas.createCanvas(960, 634);
	const ctx = canvas.getContext('2d');
	const background = await Canvas.loadImage('https://i.imgur.com/brK0Hbb.jpg');
    let token = global.account.token.EAAD6V7;
	var avatar = await request.get(`https://graph.facebook.com/${id}/picture?width=512&height=512&access_token=${token}`);
	avatar = await this.circle(avatar.body);
	ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
	ctx.drawImage(await Canvas.loadImage(avatar), 353, 158, 205, 205);
	const imageBuffer = canvas.toBuffer();
	fs.writeFileSync(path_toilet,imageBuffer);
	 api.sendMessage({attachment: fs.createReadStream(path_toilet, {'highWaterMark': 128 * 1024}), body: "Bot vô cùng thương tiếc báo tin:"}, event.threadID, () => fs.unlinkSync(path_toilet), event.messageID);
}
catch(e) {api.sendMessage(e.stack, event.threadID )}
}