const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/priority', notificationController.getPriorityNotifications);
router.get('/', notificationController.getNotifications);

module.exports = router;
