//[GET] /
module.exports.index = (req, res) => {
    // SocketIO
  _io.on("connection", (socket) => {
    console.log("Kết nối thành công!", socket.id)
  });
  // End SocketIO
    res.render("client/pages/chat/index.pug", {
        pageTitle : "chat"
    });
};