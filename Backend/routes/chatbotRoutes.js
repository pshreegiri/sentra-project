const express = require("express");
const router = express.Router();

const {
  getChatbotReply,
} = require("../controllers/chatbotController");

// POST: send user message and get chatbot reply
router.post("/chat", getChatbotReply);

module.exports = router;
