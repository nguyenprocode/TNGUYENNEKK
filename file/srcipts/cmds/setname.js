module.exports.config = {
    name: 'setname',
    version: '1.1.1',
    role: 0,
    author: 'DC-Nam',
    info: 'Thay đổi tên biệt danh trong nhóm!',
    Category: 'Box chat',
    guides: '[...|reply|tag]',
    cd: 0
};
module.exports.onRun = ({
    api, event, args
}) => api.changeNickname(args.join(' '), event.threadID, event.type == 'message_reply' ? event.messageReply.senderID: Object.keys(event.mentions).length != 0 ? Object.keys(event.mentions)[0x0]: event.senderID, e => !e ? api.sendMessage(`${!args[0] ? '➜ Gỡ': '➜ Thay đổi'} biệt danh hoàn tất!`, event.threadID): api.sendMessage(`➜ Vui lòng tắt link liên kết nhóm để tiến hành setname cho all member`, event.threadID));