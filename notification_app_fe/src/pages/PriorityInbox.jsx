import React, { useState, useMemo } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import { PriorityFilterBar } from '../components/FilterBar';

const PriorityInbox = () => {
  const [type, setType] = useState('All');
  const [n, setN] = useState(10);
  
  const params = { n }; // We fetch top N. If API supports type filter for priority, we pass it. If not, we filter client side.
  // Assuming the API returns mixed types for priority, we filter client-side for the demo
  const { data, loading, error, viewedIds } = useNotifications(true, params);

  const filteredData = useMemo(() => {
    if (type === 'All') return data;
    return data.filter(item => (item.Type || item.type) === type);
  }, [data, type]);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Priority Inbox
      </Typography>
      
      <PriorityFilterBar type={type} setType={setType} n={n} setN={setN} />

      {loading && <CircularProgress />}
      {error && <Typography color="error">Failed to load priority notifications.</Typography>}
      
      {!loading && !error && filteredData.length === 0 && (
        <Typography>No notifications found for this criteria.</Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {filteredData.map((notification) => {
          const id = notification.ID;
          const isNew = !viewedIds.has(id);
          return (
            <NotificationCard 
              key={id} 
              notification={notification} 
              isNew={isNew} 
              isPriority={true} 
            />
          );
        })}
      </Box>
    </Container>
  );
};

export default PriorityInbox;
