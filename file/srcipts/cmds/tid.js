module.exports.config = {
	name: "tid",	
	version: "1.0.0", 
	role: 0,
	author: "NTKhang",
	info: "Lấy id box", 
	Category: "Box chat",
	guides: "tid",
	cd: 5, 
	dependencies: '',
};

module.exports.onRun = async function({ api, event }) {
  api.sendMessage(event.threadID, event.threadID);
};
