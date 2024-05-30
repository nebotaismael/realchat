const mysql = require('mysql2/promise');  // Use promise-based API for cleaner async/await usage
const dbconfig = require('../config/dbconfig');

const connection = mysql.createPool({
  host:dbconfig.HOST,  // Use environment variables for secure credential storage
  user: dbconfig.USER,
  password: dbconfig.PASSWORD,
  database: dbconfig.DB,
  waitForConnections: true,   // Ensure pool always has available connections
  connectionLimit: 10,        // Set a reasonable connection limit for scalability
  queueLimit: 0              // No limit on queued requests (adjust as needed)
});

connection.getConnection()
  .then(connect => {
    console.log('Connected to MySQL Server:', connect.threadId);
    // Export the connection object for use throughout the application
  })
  .catch(err => {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);  // Exit the process on connection error for robustness
  });
  module.exports = connection; 