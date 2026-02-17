import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Box } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { title } from 'process';
import { useNavigate } from 'react-router-dom';

interface IMinimalAppBar {
  title :string
  onBack :()=>void;

}
const MinimalAppBar = ({ title }:IMinimalAppBar) => {
  
  const navigate = useNavigate();

  return (
    <AppBar
    className='top-bar'
      position="static"
      elevation={0}
      
      sx={{
        backgroundColor: 'primary', // เขียวเข้มแบบ K PLUS
        color: '#fff',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
      }}
    >
      <Toolbar>
        <IconButton edge="start" color="inherit" onClick={()=>navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIosNewIcon />
        </IconButton>

        <Box sx={{ flexGrow: 1, textAlign: 'center', mr: 4 }}>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MinimalAppBar;
