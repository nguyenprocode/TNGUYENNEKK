module.exports.config = {
  name: "refresh",
  version: "1.0",
  role: 1,
  author: "ReU",
  info: "Làm mới danh sách quản trị viên",
  Category: "Box chat",
  guides: "để trống/threadID",
  cd: 5,
  
};
module.exports.onRun = async function ({ event, args, api, Threads }) { 
const { threadID } = event;
const targetID = args[0] || event.threadID;
var threadInfo = await Threads.getInfo(targetID);
let threadName = threadInfo.threadName;
let qtv = threadInfo.adminIDs.length;
await Threads.setData(targetID , { threadInfo });
global.data.threadInfo.set(targetID , threadInfo);
return api.sendMessage(`✅ Đã làm mới danh sách quản trị viên nhóm thành công!\n\n👨‍💻 Box: ${threadName}\n🔎 ID: ${targetID}\n\n📌 Cập nhật thành công ${qtv} quản trị viên nhóm!`, threadID);
}