const express = require("express");
const categoryRoute = express.Router();
const categoryController = require('../controllers/categoryController');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/multer');

categoryRoute.post("/add-category",verifyToken,upload.array("images",1),categoryController.addNewCategory)
categoryRoute.get("/get-all-categories",categoryController.getAllCategories)
categoryRoute.delete("/delete-category/:id",verifyToken,categoryController.deleteCategory)
categoryRoute.put("/edit-category/:id",verifyToken,categoryController.updateCategory)


module.exports = categoryRoute;