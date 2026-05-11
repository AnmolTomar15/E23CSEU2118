function getWeight(type) {
  const weights = { Placement: 3, Result: 2, Event: 1 };
  return weights[type] || 0;
}

function getScore(notification) {
  const hoursElapsed = (Date.now() - new Date(notification.Timestamp).getTime()) / 3600000;
  const recency = 1 / (1 + hoursElapsed);
  return getWeight(notification.Type) * recency;
}

function getTopN(notifications, n = 10) {
  if (!Array.isArray(notifications)) return [];
  return notifications
    .map(item => ({ ...item, score: getScore(item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

module.exports = { getTopN, getScore };
