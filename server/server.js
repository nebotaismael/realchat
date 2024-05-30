require('dotenv').config();
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const cors = require("cors");
const { Server } = require("socket.io"); // Assuming you're using Socket.IO
const bcrypt = require('bcrypt');
// Configure database connection (replace with your actual implementation)
const connection = require('./models/db');
const jwt = require('jsonwebtoken');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:5000'], // Replace with allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};
app.use(cors(corsOptions));

// Function to generate JWT (replace with your specific logic)
function generateAccessToken(user) {
  return jwt.sign({ phone_number: user.phone_number }, process.env.JWT_SECRET);
}

// Authentication middleware
const authentication = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).send('Unauthorized: Missing authorization header');
  }

  const token = authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).send('Unauthorized: Missing token');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'JsonWebTokenError') {
        return res.status(403).send('Forbidden: Invalid or expired token');
      } else {
        console.error('Error verifying token:', err.message);
        return res.status(500).send('Internal server error');
      }
    }

    req.user = user;
    next();
  });
};

// User registration
app.post('/register', async (req, res) => {
  const { phone_number, name, status, password, profile_picture } = req.body;

  try {
    // Validate user input
    if (!phone_number || !name || !password || !profile_picture) {
      return res.status(400).send('Missing required fields');
    }

    // Hash password securely
    const hashedPassword = await bcrypt.hash(password, 10); // Adjust salt rounds as needed

    // Construct prepared SQL query
    const query = `INSERT INTO users (phone_number, name, status, password, profile_picture) VALUES (?, ?, ?, ?, ?)`;

    // Execute prepared statement
    connection.query(query, [phone_number, name, status, hashedPassword, profile_picture], (error, results) => {
      if (error) {
        console.error(error);
        if (error.code === 'ER_DUP_ENTRY') {
          return res.status(409).send('Phone number or name already exists');
        }
        return res.status(500).send('Error registering user');
      }

      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// User login
app.post('/login', async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    // Validate required fields
    if (!phone_number || !password) {
      return res.status(400).send('Missing required fields');
    }

    // Securely retrieve user by phone number using prepared statement
    const query = `SELECT * FROM users WHERE phone_number = ?`;
    const [rows] = await connection.query(query, [phone_number]);
console.log(rows);
    if (rows.length === 0) {
      return res.status(401).send('Invalid credentials'); // More specific error message
    }

    // Hash the incoming password for comparison (optional if password is already stored hashed)
 

    // Verify password using bcrypt.compare (if not already hashed)
    if (!bcrypt.compareSync(password, rows[0].password)) {
        return res.status(401).send('Invalid credentials');
      }
  
      // Generate and send access token
      const accessToken = generateAccessToken(rows[0]);
      res.json({ accessToken });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  // Protected route example
  app.get('/protected', authentication, (req, res) => {
    try {
      // Access user information from req.user (if authentication is successful)
      res.json({ message: 'Welcome, authorized user!' });
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });

  app.use
  
  // Error handling middleware (optional)
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).send('Internal server error'); // Generic error response for security
  });
  
  // Socket.IO integration (optional, replace with your specific implementation)
  const io = new Server(http);
  io.on('connection', (socket) => {
    console.log('A user connected');
  
    // Handle socket events and logic here
    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
  
  const serverPort = process.env.PORT || 4000;
  http.listen(serverPort, () => console.log(`Server listening on port ${serverPort}`));
  