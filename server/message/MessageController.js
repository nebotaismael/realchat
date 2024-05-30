// controllers/messageController.js
const { createMessage, getMessages, updateMessageStatus, deleteMessage } = require('./message');

const postMessageController = async (req, res) => {
  const { chat_session_id, sender_id, message_type, content, attachment_url, status } = req.body;
  const messageId = await createMessage(chat_session_id, sender_id, message_type, content, attachment_url, status);
  res.status(200).json({ messageId });
};

const getMessagesController = async (req, res) => {
  const { chat_session_id } = req.query;
  const messages = await getMessages(chat_session_id);
  res.status(200).json(messages);
};

const updateMessageStatusController = async (req, res) => {
  const { id, status } = req.body;
  await updateMessageStatus(id, status);
  res.status(200).json({ message: 'Message status updated' });
};

const deleteMessageController = async (req, res) => {
  const { id } = req.body;
  await deleteMessage(id);
  res.status(200).json({ message: 'Message deleted' });
};

module.exports = { postMessageController, getMessagesController, updateMessageStatusController, deleteMessageController };