const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "loppy",
    version: "1.0.0",
    role: 0,
    author: "Hung dep trai Convert By Dũngkon",
    info: "Bật tắt tính năng nhại tin nhắn kiểu loppy",
    Category: "Giải trí",
    guides: "!loppy",
    cd: 5,
};

let Loppy = [];
let alreadyProcessed = {};  // Lưu trạng thái xử lý sự kiện

module.exports.onRun = async function({ api, event }) {
    const { threadID, messageID } = event;

    const find = Loppy.find(item => item == threadID);
    if (!find) {
        Loppy.push(threadID);
        return api.sendMessage('Nhại kiểu loppy đã kích hoạt!', threadID, messageID);
    } else {
        Loppy = Loppy.filter(item => item != threadID);
        return api.sendMessage('Nhại kiểu loppy đã tắt!', threadID, messageID);
    }
};

module.exports.onEvent = async function({ api, event }) {
    const { threadID, messageID, body, senderID } = event;
    if (!body) return;

    const check = Loppy.find(item => item == threadID);
    if (!check) return;

    // Kiểm tra nếu người gửi là bot thì không phản hồi
    if (senderID === api.getCurrentUserID()) return;

    // Kiểm tra nếu sự kiện đã được xử lý
    if (alreadyProcessed[messageID]) return;

    const processedMessage = processSentence(body);

    api.sendMessage(processedMessage, threadID, messageID);

    // Đánh dấu sự kiện này đã được xử lý
    alreadyProcessed[messageID] = true;

    // Xóa trạng thái sau một thời gian ngắn để tránh tràn bộ nhớ
    setTimeout(() => {
        delete alreadyProcessed[messageID];
    }, 30000); // 30 giây
};

function replaceWordWithNh(word) {
    const vowels = 'aeiouăâêôơưáắấéếíóốớúứýàằầèềìòồờùừỳảẳẩẻểỉỏổởủửỷãẵẫẽễĩõỗỡũữỹạặậẹệịọộợụựỵ';
    word = word.toLowerCase();
    
    if (word == 'ok') return 'nhô nhê';
    if (word == 'cc' || word == 'vl') return 'nhờ nhờ';
    if (word == 'hihi') return 'nhi nhi';
    if (word == 'haha') return 'nha nha';
    if (word == 'hoho') return 'nho nho';
    if (word == 'paipai') return 'nhai nhai';
    if (word == 'kaka') return 'nha nha';
    if (word == 'dume') return 'nhu nhe';
    if (word == 'duma') return 'nhu nha';
    if (word == 'adu') return 'nha nhu';
    if (word == 'loppy') return 'nhop nhy';

    const index = word.split('').findIndex(char => vowels.includes(char));

    if (index !== -1) {
        return 'nh' + word.slice(index);
    }
    return word;
}

function processSentence(sentence) {
    const words = sentence.split(/\s+/);
    const processedWords = words.map(replaceWordWithNh);
    return processedWords.join(' ');
}
