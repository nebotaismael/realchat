const bcrypt = require('bcrypt');
const pool = require('../models/db');

const registerUser = async (phone_number, name, status, password, profile_picture) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `INSERT INTO users (phone_number, name, status, password, profile_picture) VALUES (?, ?, ?, ?, ?)`;
    const [results] = await pool.query(query, [phone_number, name, status, hashedPassword, profile_picture]);
    return results;
  } catch (error) {
    console.error('Error registering user:', error);
    throw { status: 500, message: 'Error registering user' };
  }
};

const getUserByPhoneNumber = async (phone_number) => {
  try {
    console.log(phone_number);
    const query = `SELECT * FROM users WHERE phone_number = ?`;
    const [results] = await pool.query(query, [phone_number]);
    return results[0];
  } catch (error) {
    console.error('Error getting user by phone number:', error);
    throw { status: 500, message: 'Error getting user by phone number' };
  }
};

module.exports = { registerUser, getUserByPhoneNumber };