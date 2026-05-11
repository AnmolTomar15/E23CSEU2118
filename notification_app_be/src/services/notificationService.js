const axios = require('axios');
const { getTopN } = require('../priority_inbox');
const { logger } = require('../../../logging_middleware');

let cachedToken = null;
let tokenExpiresAt = null;

async function getAuthToken() {
  if (cachedToken && tokenExpiresAt && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const response = await axios.post(process.env.AUTH_API, {
      email: process.env.EMAIL,
      name: process.env.NAME,
      rollNo: process.env.ROLL_NO,
      accessCode: process.env.ACCESS_CODE,
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET
    });

    // Assume response contains token and expiresIn (in seconds)
    cachedToken = response.data.token || response.data.access_token;
    const expiresIn = response.data.expiresIn || 3600; 
    tokenExpiresAt = Date.now() + (expiresIn * 1000) - 60000; // buffer of 1 minute
    
    logger.info('Fetched new auth token from AffordMed API');
    return cachedToken;
  } catch (err) {
    logger.error("Auth failed", { 
      status: err.response?.status,
      data: err.response?.data,
      message: err.message 
    });
    throw new Error('Authentication with AffordMed API failed');
  }
}

async function fetchNotifications({ limit, page, notification_type }) {
  const token = await getAuthToken();
  try {
    const params = {};
    if (limit) params.limit = limit;
    if (page) params.page = page;
    if (notification_type) params.notification_type = notification_type;

    const response = await axios.get(process.env.NOTIFICATION_API, {
      headers: {
        Authorization: `Bearer ${token}`
      },
      params
    });
    
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch notifications from API', { error: error.message });
    throw new Error('Failed to fetch notifications');
  }
}

async function getPriorityNotifications(n) {
  const token = await getAuthToken();
  try {
    // Fetch page 1 and page 2 with limit 10 each, combine them
    const [page1, page2] = await Promise.all([
      axios.get(process.env.NOTIFICATION_API, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, page: 1 }
      }),
      axios.get(process.env.NOTIFICATION_API, {
        headers: { Authorization: `Bearer ${token}` },
        params: { limit: 10, page: 2 }
      })
    ]);

    const allNotifications = [
      ...(page1.data.notifications || []),
      ...(page2.data.notifications || [])
    ];

    logger.info('Priority pool size', { count: allNotifications.length });
    return getTopN(allNotifications, n);
  } catch (error) {
    logger.error('Failed to fetch priority notifications', { 
      error: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error('Failed to fetch priority notifications');
  }
}

module.exports = {
  getAuthToken,
  fetchNotifications,
  getPriorityNotifications
};
