// controllers/chatSessionController.js
const { createChatSession, getChatSession } = require('./chatSession');

const createChatSessionController = async (req, res) => {
  const { is_group } = req.body;
  const sessionId = await createChatSession(is_group);
  res.status(200).json({ sessionId });
};

const getChatSessionController = async (req, res) => {
  const { id } = req.query;
  const session = await getChatSession(id);
  res.status(200).json(session);
};

module.exports = { createChatSessionController, getChatSessionController };