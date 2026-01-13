const mongoose = require("mongoose");

const chatbotResponseSchema = new mongoose.Schema(
  {
    keywords: {
      type: [String],
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// This links to "chatbotresponses" collection automatically
module.exports = mongoose.model(
  "ChatbotResponse",
  chatbotResponseSchema
);
