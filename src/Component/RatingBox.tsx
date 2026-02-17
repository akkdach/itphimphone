import React from 'react';
import { Box, Typography, Rating } from '@mui/material';
interface IRatingBox {
    label:string,
    value:number,
    onChange?:(value:number)=>void
}
const RatingBox = ({ label = '', value = 4, onChange }:any) => {
  return (
    <Box
      sx={{
        // p: 2,
        paddingY:1,
        // backgroundColor: '#F5F5F5',
        // boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        textAlign: 'center',
        // maxWidth: 300,
        margin: 'auto',
      }}
    >
      <Typography variant="subtitle1" mb={1} color="primary">
        {label}
      </Typography>
      <Rating
        name="rating"
        value={value}
        onChange={onChange}
        precision={0.5}
        size="large"
      />
    </Box>
  );
};

export default RatingBox;
