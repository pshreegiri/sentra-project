const ChatbotResponse = require("../models/ChatbotResponse");

exports.getChatbotReply = async (req, res) => {
  try {
    // Get user message from frontend
    const userMessage = req.body.message.toLowerCase();

    // Fetch all chatbot responses from DB
    const chatbotData = await ChatbotResponse.find();

    // Keyword matching logic
    for (let item of chatbotData) {
      for (let keyword of item.keywords) {
        if (userMessage.includes(keyword)) {
          return res.json({ reply: item.response });
        }
      }
    }

    // Default reply if no match found
    return res.json({
      reply: "Sorry, I couldn't understand your query. Please contact admin.",
    });
  } catch (error) {
    console.error("Chatbot error:", error);
    res.status(500).json({
      reply: "Server error. Please try again later.",
    });
  }
};
