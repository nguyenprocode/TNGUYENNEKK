module.exports.config = {
    name: "edit",
    version: "1.0.0",
    role: 1,
    credits: "Wioriz",// Vui lòng không thay đổi credit nếu không muốn làm súc vật
    info: "Chỉnh sửa tin nhắn của bot bằng cách reply với lệnh /edit",
    Category: "Hệ thống",
    guides: "/edit <nội dung mới>",
    cd: 5,
  };
  
  module.exports.onRun = async function ({ api, event, args }) {
    const content = args.join(" ");
    
    if (event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
      const messageID = event.messageReply.messageID;
  
      api.editMessage(messageID, content)
    } else {
      api.sendMessage("Hãy reply vào tin nhắn của bot để chỉnh sửa!", event.threadID, event.messageID);
    }
  };
  