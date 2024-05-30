// models/chatSession.js
const connection = require('../models/db');

const createChatSession = async (is_group) => {
  const query = `INSERT INTO chat_sessions (is_group) VALUES (?)`;
  const [results] = await connection.query(query, [is_group]);
  return results.insertId;
};

const getChatSession = async (id) => {
  const query = `SELECT * FROM chat_sessions WHERE id = ?`;
  const [results] = await connection.query(query, [id]);
  return results[0];
};

module.exports = { createChatSession, getChatSession };