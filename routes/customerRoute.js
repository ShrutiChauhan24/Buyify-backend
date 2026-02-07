const express = require("express");
const customerRoute = express.Router();
const customerController = require('../controllers/customerController');
const verifyToken = require('../middleware/verifyToken');

customerRoute.get('/get-all-customers',verifyToken,customerController.getAllCustomers);
customerRoute.get('/get-all-metrics-data',verifyToken,customerController.getMetricsData);

module.exports = customerRoute;