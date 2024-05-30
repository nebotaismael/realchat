// models/messageReceipt.js
const connection = require('../models/db');

const createReceipt = async (message_id, recipient_id, status) => {
  const query = `INSERT INTO message_receipts (message_id, recipient_id, status) VALUES (?, ?, ?)`;
  const [results] = await connection.query(query, [message_id, recipient_id, status]);
  return results.insertId;
};

const getReceipts = async (message_id) => {
  const query = `SELECT * FROM message_receipts WHERE message_id = ?`;
  const [results] = await connection.query(query, [message_id]);
  return results;
};

const updateReceiptStatus = async (message_id, recipient_id, status) => {
  const query = `UPDATE message_receipts SET status = ? WHERE message_id = ? AND recipient_id = ?`;
  const [results] = await connection.query(query, [status, message_id, recipient_id]);
  return results;
};

module.exports = { createReceipt, getReceipts, updateReceiptStatus };