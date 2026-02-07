const express = require("express");
const orderRoute = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middleware/verifyToken');

orderRoute.get('/admin/get-all-orders',verifyToken,orderController.getAdminAllOrders);
orderRoute.get('/admin/view-order-details/:orderId',verifyToken,orderController.adminViewOrderDetails);
orderRoute.put('/admin/update-order-status/:orderId',verifyToken,orderController.adminUpdateOrderStatus);
orderRoute.put('/admin/add-tracking-id/:orderId',verifyToken,orderController.adminAddTrackingId);
orderRoute.get('/user/get-my-orders',verifyToken,orderController.getMyOrders);
orderRoute.get('/user/track-order/:orderId',verifyToken,orderController.trackOrderDetails);

module.exports = orderRoute;