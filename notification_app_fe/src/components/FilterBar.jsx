import React from 'react';
import { Box, MenuItem, Select, FormControl, InputLabel, Pagination, Slider, Typography, ToggleButtonGroup, ToggleButton, TextField } from '@mui/material';

export const FilterBar = ({ type, setType, page, setPage, totalPages = 1 }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
      <FormControl size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="type-select-label">Notification Type</InputLabel>
        <Select
          labelId="type-select-label"
          value={type}
          label="Notification Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value="All">All</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
        </Select>
      </FormControl>
      
      <Pagination 
        count={totalPages} 
        page={page} 
        onChange={(e, val) => setPage(val)} 
        color="primary" 
      />
    </Box>
  );
};

export const PriorityFilterBar = ({ type, setType, n, setN }) => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 3 }}>
      <ToggleButtonGroup
        color="primary"
        value={type}
        exclusive
        onChange={(e, newType) => { if (newType) setType(newType); }}
        size="small"
      >
        <ToggleButton value="All">All</ToggleButton>
        <ToggleButton value="Event">Event</ToggleButton>
        <ToggleButton value="Result">Result</ToggleButton>
        <ToggleButton value="Placement">Placement</ToggleButton>
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 300 }}>
        <Typography id="n-slider" gutterBottom sx={{ whiteSpace: 'nowrap', mb: 0 }}>
          Top N:
        </Typography>
        <Slider
          value={n}
          onChange={(e, val) => setN(val)}
          step={1}
          marks
          min={1}
          max={50}
          valueLabelDisplay="auto"
          sx={{ flexGrow: 1 }}
        />
        <TextField
          type="number"
          size="small"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          slotProps={{ htmlInput: { min: 1, max: 100 } }}
          sx={{ width: 80 }}
        />
      </Box>
    </Box>
  );
};
