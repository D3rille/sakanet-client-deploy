import React from 'react';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import StarRateIcon from '@mui/icons-material/StarRate';

function RatingBar({ rating, count, maxCount }) {
  return (
    <Box display="flex" alignItems="center" mb={0.5} mr={2}>
      {/* <Rating name={`rating-${rating}`} value={rating} readOnly size="small" /> */}
      <Typography variant="body2">
        {rating}<StarRateIcon sx={{fontSize:"0.8rem", color:"#FFC436"}}/>
        </Typography>
      <Box mx={1} flexGrow={1}>
        <Box
          bgcolor="primary.main"
          height={10}
          width={`${(count / maxCount) * 100}%`}
        ></Box>
      </Box>
      <Typography variant="body2">{count}</Typography>
    </Box>
  );
}

function StarRatingChart({ ratings }) {
  const maxCount = Math.max(...Object.values(ratings));

  return (
    <div>
      {Object.entries(ratings)
        .sort(([a], [b]) => b - a)
        .map(([rating, count]) => (
          <RatingBar key={rating} rating={parseInt(rating, 10)} count={count} maxCount={maxCount} />
        ))}
    </div>
  );
}

export default StarRatingChart;
