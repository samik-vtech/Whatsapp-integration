const express = require("express");
const router = express.Router();

const messageController = require("../Controller/sendMessage");
router.post("/sendmessage", messageController.sendMessage);


module.exports = router;