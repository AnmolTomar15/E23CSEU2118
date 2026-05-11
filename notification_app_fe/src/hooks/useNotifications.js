import { useState, useEffect } from 'react';
import { getNotifications, getPriorityNotifications } from '../api/notifications';

export const useNotifications = (isPriority = false, params = {}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewedIds, setViewedIds] = useState(() => {
    const saved = localStorage.getItem('viewedNotificationIds');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      let resData;
      if (isPriority) {
        resData = await getPriorityNotifications(params.n || 10);
      } else {
        resData = await getNotifications(params);
      }
      
      const notifications = resData.notifications || resData || [];
      setData(notifications);
      
      // Update viewedIds
      const newViewed = new Set(viewedIds);
      notifications.forEach(n => newViewed.add(n.Id || n.id));
      setViewedIds(newViewed);
      localStorage.setItem('viewedNotificationIds', JSON.stringify(Array.from(newViewed)));

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPriority, params.n, params.notification_type, params.page, params.limit]);

  // To determine if a notification is new, we check if it was NOT in viewedIds initially
  // But wait, if we add it immediately, it won't show as NEW on first render.
  // We need a snapshot of viewedIds at the time of fetch.
  // Actually, keeping the viewedIds from before fetch is better.

  return { data, loading, error, viewedIds };
};
