const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
const chatSocketIO = require("../../sockets/client/chat.socket");
//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {

    // SocketIO
  chatSocketIO(req, res);
  // End SocketIO
  const roomChatId = req.params.roomChatId;
  //data từ database
  const chats = await Chat.find({
    room_chat_id: roomChatId,
    deleted : false
  })

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id : chat.user_id
    }).select("fullName");

    chat.infoUser = infoUser;
  }
    res.render("client/pages/chat/index.pug", {
        pageTitle : "chat",
        chats : chats
    });
};