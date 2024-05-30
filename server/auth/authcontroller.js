const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUser, getUserByPhoneNumber } = require('./authmodel');

// Function to generate JWT
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
const register = async (req, res) => {
  const { phone_number, name, status, password, profile_picture } = req.body;
  try {
    if (!phone_number || !name || !password || !profile_picture) {
      return res.status(400).send('Missing required fields');
    }
    await registerUser(phone_number, name, status, password, profile_picture);
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

// User login
const login = async (req, res) => {
  const { phone_number, password } = req.body;
  try {
    if (!phone_number || !password) {
      return res.status(400).send('Missing required fields');
    }
    const user = await getUserByPhoneNumber(phone_number);
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send('Invalid credentials');
    }
    const accessToken = generateAccessToken(user);
    res.json({ accessToken });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { generateAccessToken, authentication, register, login };