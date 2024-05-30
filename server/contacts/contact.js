// models/contact.js
const connection = require('../models/db');

const addContact = async (user_id, contact_user_id) => {
  const query = `INSERT INTO contacts (user_id, contact_user_id) VALUES (?, ?)`;
  const [results] = await connection.query(query, [user_id, contact_user_id]);
  return results.insertId;
};

const getContacts = async (user_id) => {
  const query = `SELECT * FROM contacts WHERE user_id = ?`;
  const [results] = await connection.query(query, [user_id]);
  return results;
};

const deleteContact = async (user_id, contact_user_id) => {
  const query = `DELETE FROM contacts WHERE user_id = ? AND contact_user_id = ?`;
  const [results] = await connection.query(query, [user_id, contact_user_id]);
  return results;
};

module.exports = { addContact, getContacts, deleteContact };