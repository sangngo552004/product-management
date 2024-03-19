const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = async (res) => {
    _io.once("connection", (socket) => {
        //Khi A gửi yêu cầu cho B
        socket.on("CLIENT_ADD_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;

            //Thêm id của A vào acceptFriends của B
            const existUserAInB = await User.findOne({
                _id : userIdB,
                acceptFriends: userIdA
            });

            if(!existUserAInB) {
                await User.updateOne({
                    _id : userIdB
                }, {
                    $push: {acceptFriends : userIdA}
                });
            }

            //Thêm id của B vào requestFriends của A
            const existUserBInA = await User.findOne({
                _id : userIdA,
                requestFriends : userIdB
            });

            if(!existUserBInA) {
                await User.updateOne({
                    _id : userIdA
                },{
                    $push: {requestFriends : userIdB}
                })
            }
            //lấy độ dài acceptFriends của B để trả về cho B
            const infoUserB = await User.findOne({
                _id : userIdB
            }).select("acceptFriends");

            const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriendsB
            });
            //lấy thông tin của A để trả về cho B
            const infoUserA = await User.findOne({
                _id : userIdA
            }).select("id fullName avatar");

            socket.broadcast.emit("SERVER_RETURN_INFO_ACCEPT_FRIEND", {
                userIdB : userIdB,
                infoUserA : infoUserA
            })
        });
        //Khi A hủy gửi yêu cầu cho B
        socket.on("CLIENT_CANCEL_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;
      
            // Xóa id của A trong acceptFriends của B
            await User.updateOne({
              _id: userIdB
            }, {
              $pull: { acceptFriends: userIdA }
            });
            
            // Xóa id của B trong requestFriends của A
            await User.updateOne({
              _id: userIdA
            }, {
              $pull: { requestFriends: userIdB }
            });
            //lấy độ dài acceptFriends của B để trả về cho B
            const infoUserB = await User.findOne({
                _id : userIdB
            }).select("acceptFriends");

            const lengthAcceptFriendsB = infoUserB.acceptFriends.length;

            socket.broadcast.emit("SERVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userIdB,
                lengthAcceptFriends: lengthAcceptFriendsB
            });
            // Lấu userId của A trả về cho B
            socket.broadcast.emit("SERVER_RETURN_ID_CANCEL_FRIEND", {
                userIdB: userIdB,
                userIdA: userIdA
            });
        });
        //Khi A từ chối yêu cầu của B
        socket.on("CLIENT_REFUSE_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;

            //xóa id của B trong acceptFriends của A
            await User.updateOne({
                _id : userIdA
            },{
                $pull : { acceptFriends : userIdB}
            });
            //xóa id của A trong requestFriends của B
            await User.updateOne({
                _id : userIdB
            },{
                $pull : {requestFriends : userIdA}
            })
        })
        //Khi A chấp nhận kết bạn của B
        socket.on("CLIENT_ACCEPT_FRIEND", async (userIdB) => {
            const userIdA = res.locals.user.id;
            // Tạo phòng chat mới
            const roomChat = new RoomChat({
                typeRoom : "friend",
                users: [
                    {
                        user_id : userIdA,
                        role: "superAdmin"
                    },
                    {
                        user_id : userIdB,
                        role: "superAmin"
                    }
                ],
            });
            await roomChat.save();
            //xóa id của B trong acceptFriends của A
            // Thêm {user_id, room_chat_id} của A vào friendsList của B
            await User.updateOne({
                _id : userIdA
            },{
                $push : {
                    friendsList : {
                        user_id : userIdB,
                        room_chat_id : roomChat.id
                    }
                },
                $pull : { acceptFriends : userIdB}
            });
            //xóa id của A trong requestFriends của B
            // Thêm {user_id, room_chat_id} của B vào friendsList của A
            await User.updateOne({
                _id : userIdB
            },{
                $push : {
                    friendsList : {
                        user_id : userIdA,
                        room_chat_id : roomChat.id
                    }
                },
                $pull : {requestFriends : userIdA}
            })
            //Thêm id của A vào friendsList của B
              
        })

    })
}