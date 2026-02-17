import React from 'react';
import './Header.css'; // Import CSS file for styling
import avatar from "./avatar.png";
import { Avatar, Box, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useUser } from '../../Context/userContext';
import RatingBox from '../../Component/RatingBox';
import { useNavigate } from 'react-router-dom';
import { NotificationImportant, Notifications } from '@mui/icons-material';
const Header = () => {

  const theme = useTheme();
  const { user } = useUser();
  return (
    <Box
      className="header"
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: { xs: 1, md: 2 },
        background: theme.palette.background.default,
        borderRadius: 5,
        position: 'relative' // Important for absolute positioning
      }}
    >
      {/* 🔔 Bell Icon at Top Right */}
      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Notifications sx={{ color: '#fff', fontSize: { xs: 24, md: 32 } }} />
      </Box>

      {/* Left: Avatar */}
      <Box sx={{ marginRight: { xs: 1.5, md: 3 } }}>
        <Avatar
          src={user?.imageUrl ?? avatar}
          alt="avatar"
          sx={{ width: { xs: 60, md: 100 }, height: { xs: 60, md: 100 } }}
        />
      </Box>

      {/* Right: Member Info */}
      <Stack spacing={1} sx={{ textAlign: 'left' }}>
        {/* <RatingBox value={5} title="" /> */}
        <Typography variant="body1" color='info' sx={{ fontWeight: 500, fontSize: { xs: '1rem', md: '1.25rem' } }}>
          สวัสดี {user?.fullName}
        </Typography>
        <Typography color='info' sx={{ fontWeight: 300, fontSize: { xs: '0.8rem', md: '1rem' } }}>
          ผ่อนไปใช้ไป เลือกผ่อนได้สบายๆ
        </Typography>
      </Stack>
    </Box>


  );
};

export default Header;
