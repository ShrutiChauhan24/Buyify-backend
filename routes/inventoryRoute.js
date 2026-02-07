const express = require("express");
const inventoryRoute = express.Router();
const inventoryController = require('../controllers/inventoryController');
const verifyToken = require('../middleware/verifyToken');

inventoryRoute.get('/get-inventory-details',verifyToken,inventoryController.getInventoryDetails);
inventoryRoute.put('/update-inventory-stock/:productId',verifyToken,inventoryController.updateInventoryStocks);


module.exports = inventoryRoute;