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
  PersonOutline,
  RateReview,
  ConfirmationNumber
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import ImageIconButton from '../../Component/ImageIconButton';
import { useCompanySettings } from '../../Utility/useCompanySettings';
import Menu1 from '../../assets/Menu1.png'
import Menu2 from '../../assets/Menu2.png'
import Menu3 from '../../assets/Menu3.png'
import Menu4 from '../../assets/Menu4.png'

const baseMenuItems = [
  { label: 'จองสินค้า', path: 'downPayment', icon: Menu1, notificationCount: 0 },
  { label: 'สินเชื่อ', path: 'loan', icon: Menu2, notificationCount: 0 },
  { label: 'ค่าบริการอื่นๆ', path: 'Invoice', icon: Menu2, notificationCount: 0 },
  { label: 'ประวัติการชำระเงิน', path: 'paid', icon: Menu3, notificationCount: 0 },
  // { label: 'ข้อมูลส่วนตัว', path: 'profile', icon: Menu4 },
];

const HomeMenu = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { settings } = useCompanySettings();

  // Build menu items dynamically based on CompanySetting flags
  const menuItems = [...baseMenuItems];

  // Show review menu if either loan or order review is enabled
  if (settings.enableReviewCouponForLoan || settings.enableReviewCouponForOrder) {
    menuItems.push({
      label: 'เขียนรีวิว',
      path: 'review',
      icon: null as any,
      notificationCount: 0,
      muiIcon: 'review',
    } as any);
  }

  // Show coupon menu if either loan or order coupon is enabled
  if (settings.enableCouponForLoan || settings.enableCouponForOrder) {
    menuItems.push({
      label: 'คูปองของฉัน',
      path: 'my-coupons',
      icon: null as any,
      notificationCount: 0,
      muiIcon: 'coupon',
    } as any);
  }

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
                {item.icon ? (
                  <ImageIconButton src={item.icon} size={theme.breakpoints.down('sm') ? 50 : 68} />
                ) : (item as any).muiIcon === 'review' ? (
                  <RateReview sx={{ fontSize: theme.breakpoints.down('sm') ? 50 : 68, color: '#6e5353' }} />
                ) : (item as any).muiIcon === 'coupon' ? (
                  <ConfirmationNumber sx={{ fontSize: theme.breakpoints.down('sm') ? 50 : 68, color: '#1b413c' }} />
                ) : null}
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
