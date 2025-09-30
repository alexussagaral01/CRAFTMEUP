const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');

router.post('/create', serviceController.createService);
router.get('/user/:userId', serviceController.getUserServices);
router.get('/all', serviceController.getAllServices);
router.put('/:id', serviceController.updateService);
router.delete('/:id', serviceController.deleteService);
router.post('/book', serviceController.createBooking);
router.get('/bookings/:userId', serviceController.getUserBookings);
router.put('/bookings/:id/status', serviceController.updateBookingStatus);
router.post('/feedback', serviceController.createFeedback);
router.get('/wallet/:userId', serviceController.getWalletBalance);
router.post('/wallet/transfer', serviceController.transferFunds);

module.exports = router;
