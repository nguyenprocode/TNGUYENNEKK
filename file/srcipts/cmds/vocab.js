const { get, post } = require('axios');
//const girlArray = require('./../../system/data/media/girl.json');

class Command {
    constructor(config) {
        this.config = config;
    }

    async onRun(o) {
        const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));
        const vocabResponse = await get("https://raw.githubusercontent.com/hmhung1/data_chatbot/main/vocabData.json");
        const vocabulary = vocabResponse.data;


        const randomIndex = Math.floor(Math.random() * vocabulary.length);
        const word = vocabulary[randomIndex];

        const message = `
Học English cùng gái xinh 😍

Từ vựng: "${word.word}"
Phonetic: ${word.phonetic}

Chọn nghĩa đúng:
1. ${word.options[0]}
2. ${word.options[1]}
3. ${word.options[2]}
4. ${word.options[3]}

➢ Gõ số (1-4) để chọn đáp án.`;

        const response = await send(message);
        global.Seiko.onReply.push({
            name: this.config.name,
            messageID: response.messageID,
            author: o.event.senderID,
        });

        this.word = word;
        this.messageID = response.messageID;
    }

    async onReply(o) {
        const a = o.onReply.messageID;
        if (o.event.messageReply.messageID == a && /^[1-4]$/.test(o.event.body) && o.event.senderID == o.onReply.author) {
            const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));

            const answer = parseInt(o.event.body);
            const correctIndex = this.word.options.indexOf(this.word.definition) + 1;

            if (answer === correctIndex) {
                const girlResponse = await get("https://raw.githubusercontent.com/hmhung1/data_chatbot/main/girl.json");
                const girlArray = girlResponse.data;
                const girlRandomIndex = girlArray[Math.floor(Math.random() * girlArray.length)];
                send({ body:"Giỏi quá ta! em thưởng nè 🤭\n<!> Số dư +10000$", attachment: await global.tools.streamURL(girlRandomIndex, 'jpg') }); 
                o.Currencies.increaseMoney(o.event.senderID, 10000);
                return o.api.unsendMessage(a);
            } else {
                await send(`Sai rồi nha!`);
            }
        }
    }
}

module.exports = new Command({
    name: 'vocab',
    version: '0.0.1',
    role: 0,
    author: 'hmhung',
    info: 'Học từ vựng tiếng Anh',
    Category: 'Game',
    guides: '[vocab]',
    cd: 0,
    hasPrefix: true,
});
