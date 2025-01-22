module.exports.config = {
  name: "chuilientuc",
  version: "1.0.0",
  role: 1,
  author: "...",
  info: "Tag liên tục người bạn tag trong 5 lần\nCó thể gọi là gọi hồn người đó (cũng là dạng chửi đến chết nhưng nhẹ hơn)",
  Category: "Spam",
  guides: "chuilientuc @mention",
  cd: 1000000,
  dependencies: {
    "fs-extra": "",
    "axios": ""
  }
}

module.exports.onRun = async function({ api, args, Users, event}) {
  var mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage("Cần phải tag 1 người bạn muốn chửi", event.threadID);

  // ID người bị tag không muốn chửi
  const excludedID = '61564467696632'; // Thay bằng ID người bạn muốn loại trừ

  if (mention === excludedID) return api.sendMessage("Xin cái tuổi để chửi?", event.threadID);

  let name = event.mentions[mention];
  var arraytag = [];
  arraytag.push({id: mention, tag: name});
  var a = function (a) { api.sendMessage(a, event.threadID); }

  a("Ngóng tai mà nghe bố mày chửi nè !");
  setTimeout(() => { a({ body: "Đ!t con mẹ mày" + " " + name, mentions: arraytag }) }, 3000);
  setTimeout(() => { a({ body: "Địt cái lồn mẹ mày chết chưa hả thằng lồn" + " " + name, mentions: arraytag }) }, 5000);
  setTimeout(() => { a({ body: "Bố mày địt mẹ mày luôn đấy con chó" + " " + name, mentions: arraytag }) }, 7000);
  setTimeout(() => { a({ body: "Địt vô đầu gối, địt thối màn trinh" + " " + name, mentions: arraytag }) }, 9000);
  setTimeout(() => { a({ body: "Địt bất thình lình" + " " + name, mentions: arraytag }) }, 12000);
  setTimeout(() => { a({ body: "Địt kiểu âu tướng, địt hướng mặt trời" + " " + name, mentions: arraytag }) }, 15000);
  setTimeout(() => { a({ body: "Địt chơi địt bời, địt ra kiểu mới" + " " + name, mentions: arraytag }) }, 17000);
  setTimeout(() => { a({ body: "Địt tới địt lui, địt búi cả đầu" + " " + name, mentions: arraytag }) }, 20000);
  setTimeout(() => { a({ body: "Địt đâu cũng chết, địt bết cả lồn" + " " + name, mentions: arraytag }) }, 23000);
  setTimeout(() => { a({ body: "Địt kiểu ngang kiểu dọc, kiểu không cần khoa học" + " " + name, mentions: arraytag }) }, 25000);
  setTimeout(() => { a({ body: "Cũng chọc thủng lồn cái con đĩ mẹ mày" + " " + name, mentions: arraytag }) }, 28500);
  setTimeout(() => { a({ body: "Cái thằng đâm cha chém chú, bóp vú chị dâu" + " " + name, mentions: arraytag }) }, 31000);
  setTimeout(() => { a({ body: "Cạo đầu em nhỏ bắn bỏ em trai, kì lồn em gái" + " " + name, mentions: arraytag }) }, 36000);
  setTimeout(() => { a({ body: "Đái ỉa ra sông như công xỉa cánh" + " " + name, mentions: arraytag }) }, 39000);
  setTimeout(() => { a({ body: "Như đánh chó hoang, đập đầu chó thiến" + " " + name, mentions: arraytag }) }, 40000);
  setTimeout(() => { a({ body: "Bú lồn chim sẻ, bẽ lồn chim ri" + " " + name, mentions: arraytag }) }, 65000);
  setTimeout(() => { a({ body: "Kì lồn chim cắt mà đút lồn vào chim trâu" + " " + name, mentions: arraytag }) }, 70000);
  setTimeout(() => { a({ body: "Địt cái lồn mẹ mày thấy mày chết chưa hả con chó ăn cứt" + " " + name, mentions: arraytag }) }, 75000);
  setTimeout(() => { a({ body: "Đi với phật thì mặc áo cà sa, đi với ma thì mặc áo giấy" + " " + name, mentions: arraytag }) }, 80000);
  setTimeout(() => { a({ body: "Mà cái lồn con đĩ mẹ mày không đầy chấy thì cũng đầy ve" + " " + name, mentions: arraytag }) }, 85000);
  setTimeout(() => { a("Mà giữa cái hột le lại đầy ghẻ mới đẻ ra thằng súc vật như mày") }, 90000);
  setTimeout(() => { a({ body: "Tao mệt rồi không chửi nữa" + " " + name, mentions: arraytag }) }, 95000);
  setTimeout(() => { a({ body: "Nào ông chủ update lyric thì chửi tiếp nha con súc vật" + " " + name, mentions: arraytag }) }, 100000);
  setTimeout(() => { a({ body: "Xin chào và hẹn gặp lại thứ tinh trùng khuyết tật, thất bại của tạo hoá" + " " + name, mentions: arraytag }) }, 105000);
  setTimeout(() => { a("Gút Bai 🥺") }, 110000);
}
