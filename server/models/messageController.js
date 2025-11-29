const Message = require('../models/Message');

const sendMessage = async (req, res) => {
    try {
        const newMessage = await Message.create(req.body);
        res.status(201).json({ success: true, data: newMessage });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

module.exports = { sendMessage };