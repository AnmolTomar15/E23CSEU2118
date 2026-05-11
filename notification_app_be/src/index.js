require('dotenv').config();
const express = require('express');
const cors = require('cors');
const notificationsRouter = require('./routes/notifications');
const { requestLogger, logger } = require('../../logging_middleware');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// Every request must be logged through it
app.use(requestLogger);

// Assuming all API routes need pre-authentication
app.use('/api', authMiddleware);
app.use('/api/notifications', notificationsRouter);

const { getAuthToken } = require('./services/notificationService');
app.get('/test-auth', async (req, res) => {
  try {
    const token = await getAuthToken();
    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use((err, req, res, next) => {
  logger.error('Unhandled Exception', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(PORT, () => {
  logger.info(`Backend proxy running on port ${PORT}`);
});
