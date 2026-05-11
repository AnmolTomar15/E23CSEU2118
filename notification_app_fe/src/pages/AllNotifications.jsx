import React, { useState } from 'react';
import { Box, Typography, CircularProgress, Container } from '@mui/material';
import { useNotifications } from '../hooks/useNotifications';
import NotificationCard from '../components/NotificationCard';
import { FilterBar } from '../components/FilterBar';

const AllNotifications = () => {
  const [type, setType] = useState('All');
  const [page, setPage] = useState(1);
  
  const params = {
    page,
    limit: 10,
    ...(type !== 'All' && { notification_type: type })
  };

  const { data, loading, error, viewedIds } = useNotifications(false, params);

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        All Notifications
      </Typography>
      
      <FilterBar 
        type={type} 
        setType={setType} 
        page={page} 
        setPage={setPage} 
        totalPages={10} // Hardcoded for demo, normally from API
      />

      {loading && <CircularProgress />}
      {error && <Typography color="error">Failed to load notifications.</Typography>}
      
      {!loading && !error && data.length === 0 && (
        <Typography>No notifications found.</Typography>
      )}

      <Box sx={{ mt: 2 }}>
        {data.map((notification) => {
          const id = notification.ID;
          const isNew = !viewedIds.has(id);
          return (
            <NotificationCard 
              key={id} 
              notification={notification} 
              isNew={isNew} 
              isPriority={false} 
            />
          );
        })}
      </Box>
    </Container>
  );
};

export default AllNotifications;
