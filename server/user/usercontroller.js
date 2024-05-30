const { getUser, deleteUser, updateUser, getAllUsers } = require('./usermodel');

const getUserController = async (req, res) => {
  const { phone_number } = req.user;
  try {
    if (!phone_number) {
      return res.status(400).send('Missing required fields');
    }
    const user = await getUser(phone_number);
    console.log(user);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const getAllUsersController = async (req, res) => {
 
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const deleteUserController = async (req, res) => {
  const { phone_number } = req.body;
  try {
    if (!phone_number) {
      return res.status(400).send('Missing required fields');
    }
    await deleteUser(phone_number);
    res.status(200).send('User deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

const updateUserController = async (req, res) => {
  const { phone_number, name, status, password, profile_picture } = req.body;
  try {
    if (!phone_number || !name || !password || !profile_picture) {
      return res.status(400).send('Missing required fields');
    }
    const user = await updateUser(phone_number, name, status, password, profile_picture);
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
};

module.exports = { getUserController, deleteUserController, updateUserController , getAllUsersController};