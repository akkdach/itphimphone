import React from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Chip
} from '@mui/material';

const payments = [
  {
    payment_id: 'PAY001',
    payment_date: '2025-08-28',
    contract_no: 'CN123456',
    customer_name: 'คุณสมชาย',
    amount: 15000,
    payment_type: 'เงินโอน',
    status: 'รอตรวจสอบ',
  },
  {
    payment_id: 'PAY002',
    payment_date: '2025-08-27',
    contract_no: 'CN123457',
    customer_name: 'คุณสุดา',
    amount: 20000,
    payment_type: 'เงินสด',
    status: 'ชำระเงินสำเร็จ',
  },
  {
    payment_id: 'PAY003',
    payment_date: '2025-08-26',
    contract_no: 'CN123458',
    customer_name: 'คุณวีระ',
    amount: 18000,
    payment_type: 'เงินโอน',
    status: 'ปฏิเสธการชำระเงิน',
  },
];

const statusColor = {
  'PENDING': 'warning',
  'VERIFY': 'success',
  'REJECT': 'error',
};

const PaymentList = () => {
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>รหัสชำระเงิน</TableCell>
            <TableCell>วันที่</TableCell>
            <TableCell>เลขที่สัญญา</TableCell>
            <TableCell>ลูกค้า</TableCell>
            <TableCell>ยอดชำระ</TableCell>
            <TableCell>ประเภทการชำระ</TableCell>
            <TableCell>สถานะ</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {payments.map((row) => (
            <TableRow key={row.payment_id}>
              <TableCell>{row.payment_id}</TableCell>
              <TableCell>{row.payment_date}</TableCell>
              <TableCell>{row.contract_no}</TableCell>
              <TableCell>{row.customer_name}</TableCell>
              <TableCell>฿{row.amount.toLocaleString()}</TableCell>
              <TableCell>{row.payment_type}</TableCell>
              <TableCell>
                <Chip label={row.status} color={'primary'} />
              </TableCell>
              <TableCell align="center">
                <Button variant="contained" color="success" size="small" sx={{ mr: 1 }}>
                  ยืนยัน
                </Button>
                <Button variant="outlined" color="error" size="small">
                  ปฏิเสธ
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PaymentList;