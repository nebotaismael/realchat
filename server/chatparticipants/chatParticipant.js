// models/chatParticipant.js
const connection = require('../models/db');

const addParticipant = async (chat_session_id, user_id) => {
  const query = `INSERT INTO chat_participants (chat_session_id, user_id) VALUES (?, ?)`;
  const [results] = await connection.query(query, [chat_session_id, user_id]);
  return results.insertId;
};

const getParticipants = async (chat_session_id) => {
  const query = `SELECT * FROM chat_participants WHERE chat_session_id = ?`;
  const [results] = await connection.query(query, [chat_session_id]);
  return results;
};

const removeParticipant = async (chat_session_id, user_id) => {
  const query = `DELETE FROM chat_participants WHERE chat_session_id = ? AND user_id = ?`;
  const [results] = await connection.query(query, [chat_session_id, user_id]);
  return results;
};

module.exports = { addParticipant, getParticipants, removeParticipant };