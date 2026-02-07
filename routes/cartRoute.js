const express = require("express");
const cartRoute = express.Router();
const cartController = require('../controllers/cartController');
const verifyToken = require('../middleware/verifyToken');

cartRoute.put('/cart/add-item',verifyToken,cartController.addToCart);
cartRoute.put('/cart/item/increase-qty',verifyToken,cartController.increaseQty);
cartRoute.put('/cart/item/decrease-qty',verifyToken,cartController.decreaseQty);
cartRoute.delete('/cart/remove-item-from-cart',verifyToken,cartController.removeItemFromCart);
cartRoute.get('/cart/fetch-all-items',verifyToken,cartController.getAllCartItems);

module.exports = cartRoute;