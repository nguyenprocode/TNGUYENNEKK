const links = require('./../../system/data/media/vdgai.json'); 
const title = "Chỉ thế thôi."

class Command {
    constructor(config) {
        this.config = config;
        };
    


    async onEvent(o) {
      const body = o.event.body.toLowerCase();
      const keywords = ["vdgai", "múp", "mup", "gai", "girl"];
    
      if (keywords.some(keyword => body.startsWith(keyword))) {
          const send = (msg) => new Promise((r) => 
              o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID)
          );

          send({
              body: title,
              attachment: global.Seiko.queues.splice(0, 1),
          });
      }
      /*if (o.event.body === global.config.PREFIX) {
        const send = (msg) => new Promise((r) => 
              o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID)
          );

          send({
              body: "sunwin\nstk: 0385038164\nctk: Duong Thai Sang\nck xong sẽ có bất ngờ 🌚",
              attachment: global.Seiko.queues.splice(0, 1),
          });
      }*/
    }
  
    async onRun(o) {
        const send = msg => new Promise(r => o.api.sendMessage(msg, o.event.threadID, (err, res) => r(res || err), o.event.messageID));

        send({
            body: "sunwin\nstk: 0385038164\nctk: Duong Thai Sang\nck xong sẽ có bất ngờ 🌚",
            attachment: global.Seiko.queues.splice(0, 1),
        });
    }
}


module.exports = new Command({
    name: '\n',
    version: '0.0.1',
    role: 0,
    author: 'Niio-team (DC-Nam)',
    info: 'Video gái',
    Category: 'Giải trí',
    guides: '[]',
    cd: 0,
    hasPrefix: true,
});