const notificationService = require('../services/notificationService');
const { logger } = require('../../../logging_middleware');

async function getNotifications(req, res) {
  try {
    const { limit, page, notification_type } = req.query;
    const data = await notificationService.fetchNotifications({ limit, page, notification_type });
    res.json(data);
  } catch (error) {
    logger.error('Error in getNotifications controller', { error: error.message });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function getPriorityNotifications(req, res) {
  try {
    const n = parseInt(req.query.n, 10) || 10;
    const data = await notificationService.getPriorityNotifications(n);
    res.json(data);
  } catch (error) {
    logger.error('Error in getPriorityNotifications controller', { error: error.message });
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getNotifications,
  getPriorityNotifications
};
