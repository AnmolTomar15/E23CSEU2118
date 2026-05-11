import React from 'react';
import { Card, CardContent, Typography, Box, Chip, LinearProgress } from '@mui/material';

const NotificationCard = ({ notification, isNew, isPriority }) => {
  const typeColors = {
    Event: 'info',
    Result: 'warning',
    Placement: 'success',
  };

  const ts = notification.Timestamp || notification.timestamp || notification.created_at || new Date().toISOString();
  const dateStr = new Date(ts).toLocaleString();
  const type = notification.Type || notification.type || 'Event';
  const color = typeColors[type] || 'default';
  
  return (
    <Card 
      sx={{ 
        mb: 2, 
        borderLeft: isNew ? '4px solid' : 'none',
        borderLeftColor: 'secondary.main',
        opacity: isNew ? 1 : 0.7,
        transition: '0.3s',
        '&:hover': {
          opacity: 1,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip label={type} color={color} size="small" />
            {isNew && <Chip label="NEW" color="secondary" size="small" variant="outlined" />}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {dateStr}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mt: 1, mb: isPriority ? 2 : 0 }}>
          {notification.message || notification.Message || 'No message content'}
        </Typography>

        {isPriority && notification.score !== undefined && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
            <Typography variant="caption" color="text.secondary" sx={{ minWidth: 60 }}>
              Score: {notification.score.toFixed(2)}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(notification.score * 30, 100)} 
              sx={{ flexGrow: 1, height: 6, borderRadius: 3 }}
            />
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
