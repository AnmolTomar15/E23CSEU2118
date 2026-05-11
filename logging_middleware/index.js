const logger = {
  info: (message, meta = {}) => {
    // In a real app, this might write to a file or external service
    process.stdout.write(`[INFO] ${new Date().toISOString()} - ${message} ${JSON.stringify(meta)}\n`);
  },
  error: (message, meta = {}) => {
    process.stderr.write(`[ERROR] ${new Date().toISOString()} - ${message} ${JSON.stringify(meta)}\n`);
  },
  warn: (message, meta = {}) => {
    process.stdout.write(`[WARN] ${new Date().toISOString()} - ${message} ${JSON.stringify(meta)}\n`);
  }
};

const requestLogger = (req, res, next) => {
  logger.info('Incoming Request', {
    method: req.method,
    url: req.url,
    body: req.body,
    headers: req.headers
  });

  const originalSend = res.send;
  res.send = function (body) {
    logger.info('Outgoing Response', {
      statusCode: res.statusCode,
      body: body
    });
    originalSend.call(this, body);
  };

  next();
};

module.exports = { logger, requestLogger };
