const axios = require('axios');

module.exports = {
  config: {
    name: "tiksearch",
    aliases: ["tsearch"],
    version: "1.0.0",
    role: 0,
    author: "Hà Mạnh Hùng",
    info: "Tìm kiếm video TikTok theo từ khóa và chọn video theo số thứ tự",
    Category: "Tiện ích",
    guides: "Sử dụng: /tiksearch <từ khóa>",
    cd: 5,
    images: [],
  },

  onRun: async ({ event, api, args }) => {
    try {
      if (!args[0]) {
        return api.sendMessage("Vui lòng nhập từ khóa để tìm kiếm video TikTok!", event.threadID, event.messageID);
      }

      const keyword = args.join(" ");
      const response = await global.api.tiktoksearch(keyword);
      const data = response;

      if (!data || !data.length) {
        return api.sendMessage("Không tìm thấy kết quả nào cho từ khóa.", event.threadID, event.messageID);
      }

      let message = `Kết quả tìm kiếm cho từ khóa "${keyword}":\n\n`;
      data.slice(0, 5).forEach((video, index) => {
        message += `${index + 1}. Tiêu đề: ${video.desc}\n`;
        message += `Lượt xem: ${video.stats.playCount}\n`;
        message += `Người đăng: ${video.author.nickname} (@${video.author.uniqueId})\n\n`;
      });
      message += "Vui lòng trả lời bằng số thứ tự của video bạn muốn chọn.";

      // Gửi danh sách kết quả tìm kiếm
      api.sendMessage(message, event.threadID, (err, info) => {
        if (err) return console.error(err);

        // Lưu thông tin phản hồi của người dùng
        global.Seiko.onReply.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          videos: data.slice(0, 5), // Lưu lại danh sách video
          originalMessageID: event.messageID // Lưu messageID gốc để unsend
        });
      }, event.messageID);

    } catch (error) {
      console.error(error);
      api.sendMessage("Đã có lỗi xảy ra khi tìm kiếm video TikTok.", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, onReply }) => {
    try {
      const choice = parseInt(event.body);
      const selectedVideo = onReply.videos[choice - 1];

      if (!selectedVideo) {
        return api.sendMessage("Số thứ tự không hợp lệ, vui lòng chọn lại!", event.threadID, event.messageID);
      }
      if (event.senderID !== onReply.author) {
      api.sendMessage("Mày là thằng nào???", event.threadID, event.messageID); 
      return api.setMessageReaction("😕", event.messageID, () => {}, true);
  }


      // Lấy thông tin chi tiết video
      const json = await infoPostTT(`https://www.tiktok.com/video/${selectedVideo.id}`);
      api.unsendMessage(onReply.messageID);
      return api.sendMessage({
        body: `•👤 𝐓𝐞̂𝐧 𝐊𝐞̂𝐧𝐡: ${json.author.nickname}\n` +
              `•😽 𝐈𝐃 𝐧𝐠𝐮̛𝐨̛̀𝐢 𝐝𝐮̀𝐧𝐠: ${json.author.unique_id}\n` +
              `•🌐 𝐐𝐮𝐨̂́𝐜 𝐠𝐢𝐚: ${json.region}\n` +
              `•💬 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${json.title}\n` +
              `•❤️ 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗶𝗺: ${json.digg_count}\n` +
              `•👁‍🗨 𝐋𝐮̛𝐨̛̣𝐭 𝐱𝐞𝐦: ${json.play_count}\n` +
              `•💭 𝐋𝐮̛𝐨̛̣𝐭 𝗯𝗶̀𝗻𝗵 𝗹𝘂𝗮̣̂𝗻: ${json.comment_count}\n` +
              `•🔗 𝗟𝘂̛𝗼̛̣𝘁 𝗰𝗵𝗶𝗮 𝘀𝗲̉: ${json.share_count}\n` +
              `•⏰ Thời gian: ${json.duration}s\n` +
              `•📥 𝗟𝘂̛𝗼̛̣𝘁 𝘁𝗮̉𝗶: ${json.download_count}\n` +
              `•𝗧𝗵ả "❤"𝗻𝗲̂́𝘂 𝗺𝘂𝗼̂́𝗻 𝘁𝗮̉𝗶 𝗻𝗵𝗮̣𝗰`,
        attachment: await global.tools.streamURL(json.play, 'mp4')
      }, event.threadID, (error, info) => {
        global.Seiko.onReaction.push({
          name: module.exports.config.name,
          messageID: info.messageID,
          author: event.senderID,
          data: json
        });
      }, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("Đã có lỗi xảy ra khi xử lý lựa chọn của bạn.", event.threadID, event.messageID);
    }
  },

  onReaction: async function (o) {
    const { threadID: t, messageID: m, reaction: r } = o.event;
    const h = global.Seiko.onReaction.find(e => e.messageID == m);

    if (!h || r !== "❤") return;

    o.api.sendMessage({
      body: `
====『 MUSIC TIKTOK 』====
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱
👤 𝐈𝐃: ${h.data.music_info.id}
💬 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${h.data.music_info.title}
🔗 𝐋𝐢𝐧𝐤: ${h.data.music_info.play}
⏱️ 𝐓𝐡𝐨̛̀𝐢 𝐠𝐢𝐚𝐧: ${h.data.music_info.duration}
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱`,
      attachment: await global.tools.streamURL(h.data.music, "mp3")
    }, t, m);
  }
};

// Hàm gửi yêu cầu lấy thông tin video TikTok
async function infoPostTT(url) {
  return axios({
    method: 'post',
    url: `https://tikwm.com/api/`,
    data: {
      url
    },
    headers: {
      'content-type': 'application/json'
    }
  }).then(res => res.data.data);
}
