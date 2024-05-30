// controllers/contactController.js
const { addContact, getContacts, deleteContact } = require('./contact');

const addContactController = async (req, res) => {
  const { user_id, contact_user_id } = req.body;
  const contactId = await addContact(user_id, contact_user_id);
  res.status(200).json({ contactId });
};

const getContactsController = async (req, res) => {
  const { user_id } = req.query;
  const contacts = await getContacts(user_id);
  res.status(200).json(contacts);
};

const deleteContactController = async (req, res) => {
  const { user_id, contact_user_id } = req.body;
  await deleteContact(user_id, contact_user_id);
  res.status(200).json({ message: 'Contact deleted' });
};

module.exports = { addContactController, getContactsController, deleteContactController };