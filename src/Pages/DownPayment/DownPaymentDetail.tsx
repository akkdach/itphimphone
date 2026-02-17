import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, Card, CardContent, useTheme } from '@mui/material';
import { EmojiObjects, CalendarToday, Person, Paid, Percent } from '@mui/icons-material';
import MinimalAppBar from '../../Component/MinimalAppBar';
import { useLocation } from 'react-router-dom';
import StatusBadge from '../../Component/StatusBadge';
import callApi from '../../Services/callApi';
import PaymentHistoryCard from '../../Component/PaymentHistoryCard';

const DetailRow: React.FC<any> = ({ label, value, icon, isTotal = false }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1.5}
      borderBottom={isTotal ? 'none' : `1px dashed ${theme.palette.divider}`}
      sx={{
        bgcolor: isTotal ? theme.palette.primary.light : 'transparent',
        borderRadius: isTotal ? 2 : 0,
        px: isTotal ? 2 : 0,
        mt: isTotal ? 1 : 0
      }}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Box color="text.secondary" display="flex">{icon}</Box>
        <Typography variant="body2" color="text.secondary">{label}</Typography>
      </Box>
      <Typography
        variant="body2"
        component="span"
        fontWeight={isTotal ? 'bold' : 'medium'}
        color={isTotal ? 'primary.contrastText' : 'text.primary'}
      >
        {value}
      </Typography>
    </Box>
  );
};

const DownPaymentDetail: React.FC = () => {
  const location = useLocation();
  const loanData = location.state;
  const [data, setData] = useState<any>(loanData);
  const [payment, setPayment] = useState<any>([]);
  const theme = useTheme();

  useEffect(() => {
    setData(loanData);
  }, [loanData]);

  useEffect(() => {
    onLoadPayment();
  }, [loanData?.id]);

  const onLoadPayment = async () => {
    if (loanData?.id) {
      const response = await callApi.get(`Mobile/MyPayment/DOWN/${loanData.id}`);
      setPayment(response.data);
    }
  };

  return (
    <>
      <MinimalAppBar onBack={() => window.history.back()} title="รายละเอียดสัญญา" />
      {data && (
        <Box p={2} bgcolor={theme.palette.grey[100]} minHeight="100vh">
          <Card elevation={0} sx={{ borderRadius: 3, mb: 3 }}>
            <CardContent>
              <Stack spacing={0.5}>
                <DetailRow label="เลขที่ใบจอง" value={data.id} icon={<EmojiObjects fontSize="small" />} />
                <DetailRow label="สินค้า" value={data.productName} icon={<EmojiObjects fontSize="small" />} />
                <DetailRow label="ราคาสินค้า" value={`฿${data.price.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                <DetailRow label="ส่วนลด" value={`฿${data.disCount.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                <DetailRow label="ยอดรวมหลังหักส่วนลด" value={`฿${data.priceAd.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                <DetailRow label="เงินมัดจำ" value={`฿${data.depositAmount.toLocaleString()}`} icon={<Paid fontSize="small" />} />
                <DetailRow label="เปอร์เซ็นต์มัดจำ" value={`${(data.depositPercen * 100).toFixed(0)}%`} icon={<Percent fontSize="small" />} />
                <DetailRow label="เปอร์เซ็นต์ที่ชำระแล้ว" value={`${(data.paidPercen * 100).toFixed(0)}%`} icon={<Percent fontSize="small" />} />
                <DetailRow label="จำนวนงวด" value={`${data.installmentCount.toLocaleString()} งวด`} icon={<EmojiObjects fontSize="small" />} />
                <DetailRow label="ยอดผ่อน/งวด" value={`฿${data.installmentAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} icon={<Paid fontSize="small" />} />
                <DetailRow
                  label="สถานะ"
                  value={<StatusBadge status={data.status} />}
                  icon={<Person fontSize="small" />}
                />
                <DetailRow label="ยอดคงเหลือ" value={`฿${data.remainingBalance.toLocaleString()}`} icon={<Paid fontSize="small" />} isTotal />
              </Stack>
            </CardContent>
          </Card>

          {/* Payment History Section */}
          <PaymentHistoryCard payments={payment} />
        </Box>
      )}
    </>
  );
};

export default DownPaymentDetail;