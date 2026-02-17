import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  useTheme,
  Badge
} from '@mui/material';
import {
  Savings,
  AccountBalanceWallet,
  Payment,
  PersonOutline
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import ImageIconButton from '../../Component/ImageIconButton';
import Menu1 from '../../assets/Menu1.png'
import Menu2 from '../../assets/Menu2.png'
import Menu3 from '../../assets/Menu3.png'
import Menu4 from '../../assets/Menu4.png'
const menuItems = [
  { label: 'จองสินค้า', path: 'downPayment', icon: Menu1, notificationCount: 0 },
  { label: 'สินเชื่อ', path: 'loan', icon: Menu2, notificationCount: 0 },
  { label: 'ค่าบริการอื่นๆ', path: 'Invoice', icon: Menu2, notificationCount: 0 },
  { label: 'ประวัติการชำระเงิน', path: 'paid', icon: Menu3, notificationCount: 0 },
  // { label: 'ข้อมูลส่วนตัว', path: 'profile', icon: Menu4 },
];

const HomeMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box p={{ xs: 1, md: 3 }}>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={{ xs: 1, md: 2 }}
      >
        {menuItems.map((item) => (

          <Link to={`/${item.path}`} key={item.path} onClick={() => navigate(item.path)} style={{ textDecoration: 'none' }}>
            <Paper

              elevation={1}
              sx={{
                width: { xs: 100, sm: 120 },
                height: { xs: 100, sm: 120 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: theme.palette.info.main,
                boxShadow: 3,
                borderRadius: 5,
                position: 'relative'
              }}
            >
              <Badge
                badgeContent={item.notificationCount} // จำนวนแจ้งเตือน
                color="error" // สีแดง
                overlap="circular"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <ImageIconButton src={item.icon} size={theme.breakpoints.down('sm') ? 50 : 68} />
              </Badge>

              <Typography variant="body2" mt={1} color="secondary" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                {item.label}
              </Typography>
            </Paper>
          </Link>


        ))}
      </Box>
    </Box>
  );
};

export default HomeMenu;
