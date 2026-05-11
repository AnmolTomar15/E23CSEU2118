const { logger } = require('../../../logging_middleware');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Unauthorized access attempt', { path: req.path });
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  // Users are pre-authenticated. We assume the token is valid here, 
  // or we could verify it against an identity provider.
  req.user = { id: 'pre-authenticated-user' };
  next();
};

module.exports = authMiddleware;
