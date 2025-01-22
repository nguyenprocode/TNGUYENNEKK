module.exports.config = {
  name: "autoseen",
  version: "1.0.0",
  role: 3,
  author: "NTKhang",
  info: "Bật/tắt tự động seen khi có tin nhắn mới",
  Category: "Hệ thống",
  guides: "on/off",
  cd: 5
};

module.exports.onEvent = async ({ api, event, args }) => {
    api.markAsReadAll(() => {});
};

module.exports.onRun = async ({ api, event, args }) => {
  api.markAsReadAll(() => {});
};
