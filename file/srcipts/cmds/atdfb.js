const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fbdl = require("crawl-fb");
const cookies = "sb=TLioZo5ydG7iR_q_8Q7dclLy;datr=fQHjZpndgoCo9fIQZ-mIxx61;ps_l=1;ps_n=1;dpr=1.4187500476837158;vpd=v1%3B550x381x1.4187500476837158;m_pixel_ratio=1.4187500476837158;c_user=61563433091807;fr=0QmUM4lHa2gRlTaJW.AWVY7Liue4ksKx_nMuyTIWvSU8o.Bm4wF9..AAA.0.0.Bm8YRA.AWVLP68TIUE;xs=14%3AMLhc0OvvC6Y9MA%3A2%3A1727104065%3A-1%3A-1;locale=en_US;wd=1024x1479;fbl_st=100424904%3BT%3A28785069;wl_cbv=v2%3Bclient_version%3A2628%3Btimestamp%3A1727104151;";
const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36";
const cacheDir = path.join(__dirname, 'cache');
const { decode } = require("html-entities");
const isURL = (u) => /^http(s)?:\/\//.test(u);

if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir);
}

this.onEvent = async (o) => {
    try {
        const str = o.event.body;
        const a = 1;
        const b = 2;
        if (isURL(str)) {
            if (/fb|facebook/.test(str)) {
                const result = await fbdl(str, cookies, userAgent);
                const encodedText = result.title;
                const decodedText = decode(encodedText);
                const videoUrl = result.hd;
                const videoPath = path.join(cacheDir, 'video.mp4');
                const audioPath = path.join(cacheDir, 'audio.mp3');
                const abc = JSON.stringify(result);
                o.api.sendMessage(`${abc}`, o.event.threadID, o.event.messageID)
                
                // Tải video
                const writer = fs.createWriteStream(videoPath);
                const response = await axios({
                    url: videoUrl,
                    method: 'GET',
                    responseType: 'stream'
                });
                response.data.pipe(writer);

                writer.on('finish', async () => {
                    // Gửi tin nhắn yêu cầu chọn giữa MP4 và MP3 với reactions
                    const choiceMessage = `====[ MP3 OR MP4? ]====
1. 😠 MP4(Video)
2. 😆 MP3(Nhạc)\n
Hãy chọn reaction tương ứng để tải video MP4 hoặc âm thanh MP3.`;
const abc = JSON.stringify(result);
                    //await o.api.sendMessage(`${abc}`, o.event.threadID, o.event.messageID)
                    await o.api.sendMessage(choiceMessage, o.event.threadID, async (error, info) => {
                        if (error) return console.error("Error sending choice message:", error);

                        global.Seiko.onReaction.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: o.event.senderID,
                            videoPath: videoPath,
                            audioPath: audioPath,
                            decodedText: decodedText // Thêm decodedText vào đây
                        });
                        
                    });
                });

                writer.on('error', (error) => {
                    console.error("Error saving video:", error);
                });
            } else {
                //await o.api.sendMessage('Không tìm thấy video để tải xuống.', o.event.threadID, o.event.messageID);
            }
        }
    } catch (error) {
        console.log("Error:", error);
    }
}

this.onReaction = async (o) => {
    try {
        const { threadID, messageID, reaction, userID } = o.event;
        const h = global.Seiko.onReaction.find(e => e.messageID == messageID);

        if (!h || (reaction !== "😠" && reaction !== "😆")) return;
        if (userID !== h.author) return;

        if (reaction === '😠') {
            // Gửi video MP4
            o.api.unsendMessage(o.onReaction.messageID);
            await o.api.sendMessage({
                body: `====[ Facebook MP4 ]====\nTitle:${h.decodedText}`, 
                attachment: fs.createReadStream(h.videoPath)
            }, threadID, messageID);
        } else if (reaction === '😆') {
            // Chuyển đổi video MP4 thành MP3 và gửi
            o.api.unsendMessage(o.onReaction.messageID);
            ffmpeg.setFfmpegPath(ffmpegPath);

            ffmpeg(h.videoPath)
                .noVideo()
                .audioCodec('libmp3lame')
                .save(h.audioPath)
                .on('end', async () => {
                    await o.api.sendMessage({
                        body: `====[ Facebook MP3 ]====\nTitle:${h.decodedText}`, 
                        attachment: fs.createReadStream(h.audioPath)
                    }, threadID, messageID);
                })
                .on('error', (error) => {
                    console.error("Error converting to MP3:", error);
                    o.api.sendMessage('Có lỗi xảy ra trong quá trình chuyển đổi thành MP3.', threadID, messageID);
                });
        }
    } catch (error) {
        console.error('Lỗi xử lý reaction:', error);
    }
};

this.onRun = (o) => {
    o.api.sendMessage("hung dep trai", o.event.threadID)
}


this.config = {
    name: 'atdfb',
    version: '1.0.0',
    role: 2,
    author: 'Hùng',
    info: 'abc',
    Category: 'Admin',
    guides: '/fbdown [link]',
    cd: 5
};