const express = require('express');
const productRoute = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

productRoute.get('/get-products-list',productController.getProductsList);
productRoute.get('/get-product-by-id/:id',productController.getProductById);

productRoute.post('/add-product',verifyToken,upload.array("images",4),productController.addProduct);
productRoute.get('/admin/get-all-products',verifyToken,productController.getAdminAllProducts);
productRoute.get('/admin/get-product-by-id/:id',verifyToken,productController.getAdminProductById);
productRoute.put('/admin/add-new-color/:id',verifyToken,productController.addNewColor);
productRoute.delete('/admin/remove-color/:id',verifyToken,productController.removeColor);
productRoute.put('/admin/update-product/:id',verifyToken,productController.updateProduct);
productRoute.delete('/admin/delete-product/:id',verifyToken,productController.deleteProduct);


module.exports = productRoute;