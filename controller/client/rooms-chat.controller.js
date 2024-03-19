const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");
// [GET] /rooms-chat/
module.exports.index = async (req, res) => {
    const userId = res.locals.user.id;

    const listRoomChat = await RoomChat.find({
        "users.user_id" : userId,
        typeRoom : "group",
        deleted: false
    })
    res.render("client/pages/rooms-chat/index", {
      pageTitle: "Danh sách phòng",
      listRoomChat: listRoomChat
    });
};

//[GET] /rooms-chat/create
module.exports.create = async (req, res) => {
    const friendsList = res.locals.user.friendsList;

    for(const friend of friendsList) {
        const infoFriend = await User.findOne({
            _id : friend.user_id,
        }).select("avatar fullName");

        friend.infoFriend = infoFriend;
    }

    res.render("client/pages/rooms-chat/create", {
        pageTitle: "Tạo phòng chat mới",
        friendsList : friendsList
      });
};

//[POST] /rooms-chat/create
module.exports.createPost = async (req, res) => {
    const usersId = req.body.usersId;
    const title = req.body.title;
    
    const dataRoom = {
        title : title,
        typeRoom : "group",
        users: []
    }

    dataRoom.users.push({
        user_id : res.locals.user.id,
        role : "superAdmin"
    });

    usersId.forEach(userId => {
        dataRoom.users.push({
            user_id: userId,
            role : "user"
        });
    });

    const roomChat = new RoomChat(dataRoom);
    await roomChat.save();

    res.redirect(`/chat/${roomChat.id}`);
}