// models/message.js
const connection = require('../models/db');

const createMessage = async (chat_session_id, sender_id, message_type, content, attachment_url, status) => {
  const query = `INSERT INTO messages (chat_session_id, sender_id, message_type, content, attachment_url, status) VALUES (?, ?, ?, ?, ?, ?)`;
  const [results] = await connection.query(query, [chat_session_id, sender_id, message_type, content, attachment_url, status]);
  return results.insertId;
};

const getMessages = async (chat_session_id) => {
  const query = `SELECT * FROM messages WHERE chat_session_id = ?`;
  const [results] = await connection.query(query, [chat_session_id]);
  return results;
};

const updateMessageStatus = async (id, status) => {
  const query = `UPDATE messages SET status = ? WHERE id = ?`;
  const [results] = await connection.query(query, [status, id]);
  return results;
};

const deleteMessage = async (id) => {
  const query = `DELETE FROM messages WHERE id = ?`;
  const [results] = await connection.query(query, [id]);
  return results;
};

module.exports = { createMessage, getMessages, updateMessageStatus, deleteMessage };