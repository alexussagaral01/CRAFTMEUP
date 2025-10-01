const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const upload = require('../middleware/upload');

router.post('/create', upload.single('paymentProof'), transactionController.createTransaction);
router.get('/user/:userId', transactionController.getUserTransactions);
router.put('/:id/status', transactionController.updateTransactionStatus);

module.exports = router;
