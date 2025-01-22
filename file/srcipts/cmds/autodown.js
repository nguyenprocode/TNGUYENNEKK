const axios = require("axios");
const fs = require("fs");
const ytdl = require('@distube/ytdl-core');
const path = require("path");

const isURL = (u) => /^http(s)?:\/\//.test(u);

exports.onEvent = async function (o) {
  try {
    const str = o.event.body;
    const send = (msg) => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);
    const head = (app) => `==『 Tự động tải ${app.toUpperCase()} 』==\n────────────────`;

    if (/xnxx/.test(str)) {
      const res = await axios.get(`https://apichatbot.onrender.com/download/xnxx?url=${str}`);
      if (res.data && res.data.video_url) {
        const videoUrl = res.data.video_url;
        const filePath = path.join(__dirname, 'cache', 'xnxx.mp4'); 

        const response = await axios({
          url: videoUrl,
          method: 'GET',
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
          send({
            body: `${head('XNXX')}\nTiêu Đề : ${res.data.title}`,
            attachment: fs.createReadStream(filePath)
          });
        });

        writer.on('error', (err) => {
          console.error("Lỗi khi lưu video:", err);
        });
      } else {
        send('Không tìm thấy video từ URL xnxx.');
      }
    } else if (/^https:\/\/www\.capcut\.com\//.test(str)) {
      const result = await global.api.capcutdl(str)
          send({
            body: `${head('CAPCUT')}\nTiêu Đề : ${result.title}\nMô tả: ${result.description}\nLượt dùng: ${result.usage}`,
            attachment: await global.tools.streamURL(result.video, 'mp4')
          });

    } else if (/threads\.net\//.test(str)) {
      let res = await global.api.threadsdl(str);
      let data = res.results;
      let vd = data.filter($ => $.type === 'video');
      let pt = data.filter($ => $.type === 'image');
      const s = attachment => send({ body: `${head('THREADS')}\n⩺ Tiêu đề: ${res.title}\n⩺ Tác giả: ${res.user.username}`, attachment });  
      Promise.all(vd.map($ => global.tools.streamURL($.url, 'mp4'))).then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
      Promise.all(pt.map($ => global.tools.streamURL($.url, 'jpg'))).then(r => r.filter($ => !!$).length > 0 ? s(r) : '');
  } else if (/^https:\/\/www\.instagram\.com\//.test(str)) {
      const res = await axios.get(`https://apichatbot.onrender.com/download/instagram?url=${str}`);
      if (res.data && res.data.data.videoUrl) {
        const videoUrl = res.data.data.videoUrl;
        const filePath = path.join(__dirname, 'cache', 'instagram.mp4'); 

        const response = await axios({
          url: videoUrl,
          method: 'GET',
          responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);

        response.data.pipe(writer);

        writer.on('finish', () => {
          send({
            body: `${head('INSTAGRAM')}\nTiêu Đề : ${res.data.data.title}`,
            attachment: fs.createReadStream(filePath)
          });
        });

        writer.on('error', (err) => {
          console.error("Lỗi khi lưu video:", err);
        });
      } else {
        send('Không tìm thấy video từ URL Instagram.');
      }
    } else if (/(^https:\/\/)((vm|vt|www|v)\.)?(tiktok|douyin)\.com\//.test(str)) {
      const json = await infoPostTT(str);
      let attachment = [];

      if (json.images != undefined) {
        for (const img of json.images) {
          attachment.push(await streamURL(img, 'png'));
        }
      } else {
        attachment = [await streamURL(json.play, 'mp4')];
      }

      o.api.sendMessage({
        body: `${head('TIKTOK')}
•𝐓𝐞̂𝐧 𝐊𝐞̂𝐧𝐡: ${json.author.nickname}
•𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${json.title}`,
        attachment
      }, o.event.threadID, (error, info) => {
        global.Seiko.onReaction.push({
          name: this.config.name,
          messageID: info.messageID,
          author: o.event.senderID,
          data: json
        });
      }, o.event.messageID);
    } else if (/(^https:\/\/)((www)\.)?(youtube|youtu)(PP)*\.(com|be)\//.test(str)) {
      const info = await ytdl.getInfo(str);
      const detail = info.videoDetails;
      const formats = info.formats;

      // Tìm định dạng video tốt nhất
      const bestVideoFormat = formats
        .filter(f => f.hasVideo && f.hasAudio) // Có video và âm thanh
        .sort((a, b) => (b.qualityLabel ? parseInt(b.qualityLabel) : 0) - (a.qualityLabel ? parseInt(a.qualityLabel) : 0))[0];

      // Tìm định dạng âm thanh tốt nhất
      const bestAudioFormat = formats
        .filter(f => f.hasAudio)
        .sort((a, b) => b.audioBitrate - a.audioBitrate)[0];

      if (bestVideoFormat) {
        o.api.sendMessage({
          body: `${head('YOUTUBE MP4')}
•🎵 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${detail.title}
•🙎‍♂️ 𝐀𝐮𝐭𝐡𝐨𝐫: ${detail.author.name}
•👀 𝗩𝗶𝗲𝘄𝘀: ${detail.viewCount}
•⏰ 𝗧𝗵𝗼̛̀𝗶 𝗹𝘂̛𝗼̛̣𝗻𝗴: ${detail.lengthSeconds}s
•🔗 𝐋𝐢𝐧𝐤: ${detail.video_url}
•𝗧𝗵ả "❤" để tải MP3`,
          attachment: await streamURL(bestVideoFormat.url, 'mp4')
        }, o.event.threadID, o.event.messageID);
        o.api.sendMessage({
          body: `${head('YOUTUBE MP3')}
•🎵 𝐓𝐢𝐞̂𝐮 Đ𝐞̂̀: ${detail.title}
•🙎‍♂️ 𝐀𝐮𝐭𝐡𝐨𝐫: ${detail.author.name}
•👀 𝗩𝗶𝗲𝘄𝘀: ${detail.viewCount}
•⏰ 𝗧𝗵𝗼̛̀𝗶 𝗹𝘂̛𝗼̛̣𝗻𝗴: ${detail.lengthSeconds}s
•🔗 𝐋𝐢𝐧𝐤: ${detail.video_url}
•𝗧𝗵ả "❤" để tải MP3`,
          attachment: await streamURL(bestAudioFormat.url, 'mp3')
        }, o.event.threadID, o.event.messageID);
      } else {
        console.error('Không tìm thấy định dạng phù hợp!');
        send({ body: 'Không tìm thấy định dạng video phù hợp để tải xuống.' });
      }
    } else {
      return;
    }
  } catch (error) {
    console.error('Lỗi xử lý sự kiện:', error);
  }
};

exports.onRun = () => {};

exports.onReaction = async function (o) {
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
    attachment: await streamURL(h.data.music, "mp3")
  }, t, m);
};

exports.config = {
  name: 'autodown',
  version: '1',
  role: 0,
  author: 'hmhung',
  info: '',
  Category: 'Tiện ích',
  guides: [],
  cd: 3
};

function streamURL(url, type) {
  return axios.get(url, {
    responseType: 'arraybuffer'
  }).then(res => {
    const filePath = path.join(__dirname, `/cache/${Date.now()}.${type}`);
    fs.writeFileSync(filePath, res.data);
    setTimeout(() => fs.unlinkSync(filePath), 1000 * 60);
    return fs.createReadStream(filePath);
  });
}

function infoPostTT(url) {
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
