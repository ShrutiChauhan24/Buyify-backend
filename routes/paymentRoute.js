const express = require('express');
const paymentRoute = express.Router();
const paymentController = require('../controllers/paymentController');
const verifyToken = require('../middleware/verifyToken');

paymentRoute.post('/create-razorpay-order',verifyToken,paymentController.createRazorpayOrder);
paymentRoute.post('/verify-razorpay-payment',verifyToken,paymentController.verifyRazorpayPayment);
paymentRoute.post('/create-cod-order',verifyToken,paymentController.createCODOrder);

module.exports = paymentRoute;