const axios = require('axios');

module.exports = {
  config: {
    name: "tiktokinfo",
    aliases: ["tikin4"],
    version: "1.0.0",
    role: 0,
    author: "Hà Mạnh Hùng",
    info: "Lấy thông tin tài khoản TikTok",
    Category: "Tiện ích",
    guides: "Sử dụng: /tiktokInfo <tên_tài_khoản_TikTok>",
    cd: 5,
    images: [],
  },
  
  onRun: async ({ event, api, args }) => {
    try {
      const username = args[0]; 

      if (!username) {
        return api.sendMessage("Vui lòng nhập tên tài khoản TikTok.", event.threadID, event.messageID);
      }

      const response = await global.api.tiktokinfo(username);
      const info = response;

      if (!info.uniqueId) {
        return api.sendMessage("Không tìm thấy tài khoản TikTok.", event.threadID, event.messageID);
      }

      const message = {
        body: `✏️ Tên: ${info.nickname}
🔢 ID: ${info.uniqueId}
🤓 Người theo dõi: ${info.followerCount}
💕 Lượt thả tim: ${info.heartCount}
👥 Số bạn bè: ${info.friendCount}
📺 Số video: ${info.videoCount}
🌐 Khu vực: ${info.region}
🔤 Tiểu sử: ${info.signature || "Không có"}
🎎 Lượt theo dõi: ${info.followerCount}
⬆️ Đang theo dõi: ${info.followingCount}
📶 Ngày tạo tài khoản: ${info.createTime ? new Date(info.createTime * 1000).toLocaleString() : "Không có dữ liệu"}
☑️ Được xác thực: ${info.verified ? "Có" : "Không"}
💰 Seller: ${info.ttSeller ? "Có" : "Không"}
🔒 Tài khoản riêng tư: ${info.privateAccount ? "Có" : "Không"}
Avatar: `,
        attachment: await global.tools.streamURL(info.avatarLarger, 'jpg')
      };

      api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Đã có lỗi xảy ra khi lấy thông tin tài khoản TikTok.", event.threadID, event.messageID);
    }
  }
};
