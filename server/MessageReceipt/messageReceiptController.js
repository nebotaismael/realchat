// controllers/messageReceiptController.js
const { createReceipt, getReceipts, updateReceiptStatus } = require('./messageReceipt');

const createReceiptController = async (req, res) => {
  const { message_id, recipient_id, status } = req.body;
  const receiptId = await createReceipt(message_id, recipient_id, status);
  res.status(200).json({ receiptId });
};

const getReceiptsController = async (req, res) => {
  const { message_id } = req.query;
  const receipts = await getReceipts(message_id);
  res.status(200).json(receipts);
};

const updateReceiptStatusController = async (req, res) => {
  const { message_id, recipient_id, status } = req.body;
  await updateReceiptStatus(message_id, recipient_id, status);
  res.status(200).json({ message: 'Receipt status updated' });
};

module.exports = { createReceiptController, getReceiptsController, updateReceiptStatusController };