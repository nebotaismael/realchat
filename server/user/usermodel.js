const connection = require('../models/db');
const bcrypt = require('bcrypt');


const getUser = async (phone_number) => {
  try {
    const query = `SELECT * FROM users WHERE phone_number = ?`;console.log(phone_number);
    const [results] = await connection.query(query, [phone_number]);
 console.log(results);
    return results[0];
  } catch (error) {
    console.error('Error getting user:', error);
    throw { status: 500, message: 'Error getting user' };
  }
};

const getAllUsers = async () => {
  try {
    const query = `SELECT * FROM users`;
    const [results] = await connection.query(query);
    return results;
  } catch (error) {
    console.error('Error getting user:', error);
    throw { status: 500, message: 'Error getting user' };
  }
};

const deleteUser = async (phone_number) => {
  try {
    const query = `DELETE FROM users WHERE phone_number = ?`;
    const [results] = await connection.query(query, [phone_number]);
    return results;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw { status: 500, message: 'Error deleting user' };
  }
};

const updateUser = async (phone_number, name, status, password, profile_picture) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `UPDATE users SET name = ?, status = ?, password = ?, profile_picture = ? WHERE phone_number = ?`;
    const [results] = await connection.query(query, [name, status, hashedPassword, profile_picture, phone_number]);
    return results;
  } catch (error) {
    console.error('Error updating user:', error);
    throw { status: 500, message: 'Error updating user' };
  }
};
 
module.exports = { getUser, deleteUser, updateUser, getAllUsers};