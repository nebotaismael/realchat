// controllers/chatParticipantController.js
const { addParticipant, getParticipants, removeParticipant } = require('./chatParticipant');

const addParticipantController = async (req, res) => {
  const { chat_session_id, user_id } = req.body;
  const participantId = await addParticipant(chat_session_id, user_id);
  res.status(200).json({ participantId });
};

const getParticipantsController = async (req, res) => {
  const { chat_session_id } = req.query;
  const participants = await getParticipants(chat_session_id);
  res.status(200).json(participants);
};

const removeParticipantController = async (req, res) => {
  const { chat_session_id, user_id } = req.body;
  await removeParticipant(chat_session_id, user_id);
  res.status(200).json({ message: 'Participant removed' });
};

module.exports = { addParticipantController, getParticipantsController, removeParticipantController };