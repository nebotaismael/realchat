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
const { getUserController, deleteUserController, updateUserController, getAllUsersController } = require('./user/usercontroller');
const { authentication, register, login, generateAccessToken } = require('./auth/authcontroller');
const { postMessageController, getMessagesController, updateMessageStatusController, deleteMessageController } = require('./message/MessageController');
const { addContactController, getContactsController, deleteContactController } = require('./contacts/contactController');
const { createChatSessionController, getChatSessionController } = require('./chatsessions/chatSessionController');
const { addParticipantController, getParticipantsController, removeParticipantController } = require('./chatparticipants/chatParticipantController');
const { createReceiptController, getReceiptsController, updateReceiptStatusController } = require('./MessageReceipt/messageReceiptController');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: ['http://localhost:5000'], // Replace with allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allowed headers
};
app.use(cors(corsOptions));

app.get('/user', authentication, getUserController);

app.get('/users', authentication, getAllUsersController);
// User update
app.put('/update', authentication, updateUserController);

// User delete
app.delete('/delete', authentication, deleteUserController  );
app.post('/message',authentication, postMessageController);
app.get('/messages',authentication, getMessagesController);
app.put('/message/status',authentication, updateMessageStatusController);
app.delete('/message',authentication, deleteMessageController);

app.post('/contact', authentication, addContactController);
app.get('/contacts',authentication, getContactsController);
app.delete('/contact',authentication, deleteContactController);
app.post('/chat-session',authentication, createChatSessionController);
app.get('/chat-session', authentication, getChatSessionController);

app.post('/register', register);
app.post('/login', login);

app.post('/chat-participant',authentication, addParticipantController);
app.get('/chat-participants',authentication, getParticipantsController);
app.delete('/chat-participant',authentication, removeParticipantController);

app.post('/message-receipt', authentication, createReceiptController);
app.get('/message-receipts',authentication, getReceiptsController);
app.put('/message-receipt/status',authentication, updateReceiptStatusController);


  // Error handling middleware (optional)
  app.use((err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging
    res.status(500).send('Internal server error'); // Generic error response for security
  });
  
  // Socket.IO integration (optional, replace with your specific implementation)
// Socket.IO integration
const io = new Server(http);
io.on('connection', (socket) => {
  console.log('A user connected');

  // Handle user authentication and join the user to a room for each chat session
  socket.on('authenticate', async (token) => {
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      const chatSessions = await getChatSessionController(user.id);
      chatSessions.forEach(session => {
        socket.join(`chat_${session.id}`);
      });
    } catch (err) {
      console.error(err); 
    } 
  });

  // Handle sending a new message
  socket.on('send_message', async (data) => {
    const { chat_session_id, sender_id, message_type, content, attachment_url } = data;
    const messageId = await postMessageController(chat_session_id, sender_id, message_type, content, attachment_url);
    io.to(`chat_${chat_session_id}`).emit('new_message', { messageId, chat_session_id, sender_id, message_type, content, attachment_url });
  });

  // Handle updating message status
  socket.on('update_message_status', async (data) => {
    const { message_id, recipient_id, status } = data;
    await updateMessageStatusController(message_id, recipient_id, status);
    io.to(`chat_${chat_session_id}`).emit('message_status_updated', { message_id, recipient_id, status });
  });

  // Handle adding a new chat participant
  socket.on('add_participant', async (data) => {
    const { chat_session_id, user_id } = data;
    await addParticipantController(chat_session_id, user_id);
    socket.join(`chat_${chat_session_id}`);
    io.to(`chat_${chat_session_id}`).emit('new_participant', { chat_session_id, user_id });
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});
  const serverPort = process.env.PORT || 4000;
  http.listen(serverPort, () => console.log(`Server listening on port ${serverPort}`));
  