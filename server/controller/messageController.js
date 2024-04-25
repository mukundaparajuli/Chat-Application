const expressAsyncHandler = require("express-async-handler");
const Message = require("../Models/messageSchema");

// @Desc GET messages
// @Route /api/messages/:id
// @access private

const getMessages = expressAsyncHandler(async (req, res) => {
    const userId = req.params.id;
    const ourUserId = await req.user.userId;
    console.log(userId, ourUserId)
    const messages = await Message.find({
        sender: { $in: [userId] },
        recipient: { $in: [userId, ourUserId] },
    }).sort({ createdAt: 1 });
    console.log(messages)
    res.json(messages);
})

module.exports = { getMessages };