const express = require('express');
const settingsRoute = express.Router();
const settingsController = require('../controllers/settingsController');
const verifyToken = require('../middleware/verifyToken');

settingsRoute.patch('/settings/add-store-info',verifyToken,settingsController.addStoreInfo);
settingsRoute.get('/settings/get-store-info',settingsController.getSettingsInfo);

module.exports = settingsRoute;