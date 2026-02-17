import React from 'react';
import Chip from '@mui/material/Chip';
import { PaymentStatus, paymentStatusColor, paymentStatusText } from './PaymentStatusLabel';

interface PaymentStatusChipProps {
  status: number; // รับค่าจาก API
}

const PaymentStatusChip: React.FC<PaymentStatusChipProps> = ({ status }) => {
  const text = paymentStatusText[status as PaymentStatus] || 'ไม่ทราบสถานะ';
  const color = paymentStatusColor[status as PaymentStatus] || 'default';

  return (
    <Chip
      label={text}
      color={color}
      variant="outlined"
      size="small"
    />
  );
};

export default PaymentStatusChip;