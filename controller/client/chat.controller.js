const User = require("../../models/user.model");
const Chat = require("../../models/chat.model");
//[GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

    // SocketIO
  _io.once("connection",  (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        content : content,
        user_id : res.locals.user.id
      })
      await chat.save();

      //trả data ra giao diện realtime
      _io.emit("SEVER_SEND_MESSAGE", {
        userId : userId,
        fullName : fullName,
        content : content
      })
    })

  });
  // End SocketIO

  //data từ database
  const chats = await Chat.find({
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